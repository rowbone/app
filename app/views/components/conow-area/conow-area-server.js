
/*
 * conow-area2 的指令实现（包含市的分组选择和省市区的级联选择）
 * */
(function(angular) {
	'use strict';

	var app = angular.module('app');

	app.directive('conowArea2', ['$filter', '$timeout', 'AreaService', 'conowModals', '$rootScope', '$http', 
		function($filter, $timeout, AreaService, conowModals, $rootScope, $http) {
			return {
				restrict: 'AE',
				require: ['?^form', '?ngModel'],
				compile: function(tElem, tAttrs) {		
					return this.link;
				},
				scope: {
					ngModel: '=',
					callbackFn: '&'
				},
				replace: true,
				templateUrl: 'js/directives/conow-area/tpls/area-sel-tpl.html',
				link: function(scope, elem, attrs, ctrls) {
					var vm = scope.vm = {},
						selectedCode = '',
						citySelOptions = scope.citySelOptions = {
							dataSrcUrl: '/service/region!queryCity',
							isLoadingAll: true,
							isHasCommon: true,
							isCommonExpanded: true,
							isShowAllLabels: false,
							isShowSearch: true,
							isMultiSelect: false,
							selectKey: 'CODE',
							selectValue: 'SHORT_NAME',
							selectTitle: 'NAME',
							colsPerRow: 4,
							colsClass: 'cols-per-row-4',
							selectType: 'city',
							commonColsPerRow: 3,
							commonColsClass: 'cols-per-row-3',
							titleName: '地区选择',
							inland: true,
							overseas: false
						},
						overseasSelOptions = scope.overseasSelOptions = {
							dataSrcUrl: '/service/country!queryAllCountry',
							isLoadingAll: true,
							isHasCommon: true,
							isCommonExpanded: true,
							isShowAllLabels: false,
							isShowSearch: true,
							isMultiSelect: false,
							selectKey: 'ID',
							selectValue: 'VALUE',
							selectTitle: 'VALUE',
						},
						selectType = 'city',
						ctrl = ctrls[1],
						templateUrlBase = 'js/directives/conow-area/tpls/';

					
					// select-type 属性为2时，为级联选择
					if(attrs.selectType == 2) {
						selectType = 'cascade';
					} else if(attrs.selectType == 3) {
						selectType = 'areaMaintain';
					}
					
					// broadcast for adv-search params init starts
					// add by wlj @20151215
					var options = scope.options = {},
						emitAdvsearch = attrs.emitAdvsearch,
						ngModel = attrs.ngModel;
					
					if(angular.isDefined(emitAdvsearch) && angular.isDefined(ngModel)) {
						ngModel = ngModel.split('.').pop();
						options.isBroadcast = true;
						options.ngModel = ngModel;
					}
					// broadcast for adv-search params init ends
					
					// selectType 为 'city' 时的处理方法
					var cityFn = function(directInitOptions) {
						var overseas = attrs.overseas;
						var areaOverseas = null;

						// inland && overseas
						if(angular.isDefined(overseas) && !angular.equals(overseas, 'false')) {
							citySelOptions.overseas = true;
							templateUrl = templateUrlBase + 'area-group-sel-inland-overseas-tpl.html';
							$http.post('/service/country!queryAllCountry')
								.success(function(data) {
									console.log(data);
									areaOverseas = data.obj;
								})
								.error(function(msg) {
									console.log(msg);
								});
						}

						var options = citySelOptions;
						
						// 点击选择
						scope.openPickerModal = function(e) {
							e.preventDefault();
							var modalInstance = null;
							var controllerName = '';
							var options2 = null;

							// if(!citySelOptions.overseas) {
								var areaCity = AreaService.getAreaCity();
								
								vm.groupData = $filter('groupByAlphabet')(areaCity.origData, true);
								vm.dataList = areaCity.citiesAll;
								vm.selectedValue = scope.selected;
console.log(vm.groupData);
								controllerName = 'areaGroupSelCtrl';
// 							// } else {
								vm.groupData2 = $filter('groupByAlphabet')(areaOverseas, true);
								
console.log(vm.groupData2);
								// controllerName = 'areaOverseasSelCtrl';
								controllerName = 'areaGroupSelCtrl';
								options2 = overseasSelOptions;
// 							// }
								
							modalInstance = conowModals.open({
								templateUrl: templateUrl,
								size: 'md',
								adaptive: true,
								isModalBox: true,
								isFull: true,
								title: options.titleName || '选择',
								controller: controllerName,
								resolve: {
									modalParams: function() {
										return {
											dataAll: vm.dataAll,
											groupData: vm.groupData,
											groupData2: vm.groupData2,
											dataList: vm.dataList,
											selectedValue: vm.selectedValue,
											options: options,
											options2: options2
										}
									}
								}
							});

							modalInstance.result.then(function(data) {
								scope.ngModel = data[options.selectKey];

								if (angular.isFunction(scope.callbackFn) && angular.isDefined(data)) {
									(scope.callbackFn)({ 'selectedItem': data });
								}

								$timeout(function() {
									var selectedValue = data[options.selectValue];
						        	scope.selected = selectedValue;
						        	
									if(angular.isDefined(directInitOptions) && directInitOptions.isBroadcast) {
										$rootScope.$broadcast('emit-advsearch', {
											'model': directInitOptions.ngModel,
											'name': scope.selected,
											'type': 'select'
										});
									}
								}, 100);
								
								// todo: if form, make field dirty
					        	if(ctrls[0]) ctrls[0].$setDirty();
					        	if(ctrls[1]) ctrls[1].$dirty = true;
							}, function(msg) {
								console.log('msg-->', msg);
							})

							e.stopPropagation();
						};
					}
					
					// selectType 为 'cascade' 时的处理方法
					var cascadeFn = function(directInitOptions) {
						templateUrl = templateUrlBase + 'area-cascade-tpl.html';
						// 点击选择
						scope.openPickerModal =  function(e) {
							e.preventDefault();
							var modalInstance = conowModals.open({
								templateUrl: templateUrl,
								controller: 'areaSelModalCtrl',
								title:'请选择地区',
								size:"md",
								isModalBox: true,
								/*adaptive: true,
								isFull: true,*/
								resolve: {
									modalParams: function() {
										var options = {};
										var selectLevel = attrs.selectLevel;
										if (selectLevel === undefined || selectLevel === '') {
											options.selectLevel = 2;
										} else {
											options.selectLevel = 1;
										}
										var selectedArea = {};
										selectedArea.code = ctrl.$modelValue;
		
										return {
											'options': options,
											'selectedArea': selectedArea
										};
									}
								}
							});
		
							modalInstance.result.then(function(rtnVal) {
								if (rtnVal && rtnVal.label) {
									var code = rtnVal.code, 
										label = rtnVal.label;
									
									scope.ngModel = code;								
									scope.selected = label;
									
									if(angular.isDefined(directInitOptions) && directInitOptions.isBroadcast) {
										$rootScope.$broadcast('emit-advsearch', {
											'model': directInitOptions.ngModel,
											'name': scope.selected,
											'type': 'select'
										});
									}
									
									// todo: if form, make field dirty
						        	if(ctrls[0]) ctrls[0].$setDirty();
						        	if(ctrls[1]) ctrls[1].$dirty = true;
								}
							}, function(rtnVal) {
								console.log(rtnVal);
							});
						};
					};
					
					// selectType 为 'areaMaintain' 时的处理方法
					var areaMaintainFn = function(directInitOptions) {
						templateUrl = templateUrlBase + 'area-maintain-sel-tpl.html';
						
						scope.openPickerModal = function(e) {
							var modalInstance = conowModals.open({
								templateUrl: templateUrl,
								controller: 'areaMaintainSelModalCtrl',
								title:'请选择地区',
								size:"md",
								resolve: {
									modalParams: function() {
										var options = {};
										var selectLevel = attrs.selectLevel;
										if (selectLevel === undefined || selectLevel === '') {
											options.selectLevel = 2;
										} else {
											options.selectLevel = 1;
										}
		
										return {
											'dataAll': vm.areaMaintainData,
											'options': options,
											'selectedAreaNodes': vm.areaMaintainRegionNodes
										};
									}
								}
							});
							
							modalInstance.result.then(function(rtnVal) {
								if (rtnVal && rtnVal.label) {
									var code = rtnVal.code, 
										label = rtnVal.label;
									
									scope.ngModel = code;								
									scope.selected = label;
									
									vm.areaMaintainRegionNodes = rtnVal.selectedArr;
									
									if(angular.isDefined(directInitOptions) && directInitOptions.isBroadcast) {
										$rootScope.$broadcast('emit-advsearch', {
											'model': directInitOptions.ngModel,
											'name': scope.selected,
											'type': 'select'
										});
									}
									
									// todo: if form, make field dirty
						        	if(ctrls[0]) ctrls[0].$setDirty();
						        	if(ctrls[1]) ctrls[1].$dirty = true;
								}
							}, function(rtnVal) {
								console.log(rtnVal);
							});
						}
					}
					
					// 地区 CODE 转换获取地区名称
					var unbindWatcher = scope.$watch(
						function(){return elem.val();},
						// This is the change listener, called when the value returned from the above function changes
						function(newValue, oldValue) {
							// 如果赋值不是8位数字不进行转换
							var regExp = /^\d{8}$/;
							var selectedCode = '';
							selectedCode = ctrl.$modelValue;
							if(ctrl.$modelValue) {
								unbindWatcher();
							}
							if(selectType === 'areaMaintain') {				    
							    var promise = AreaService.getRegionMaintainData('/service/region!queryRegionCountryToCity');
							    promise.then(function(data) {
							    	if(angular.isDefined(data.obj)) {
							    		data = data.obj;
							    	}
							    	vm.areaMaintainData = data;
							    	
							    	vm.areaMaintainRegionNodes = AreaService.getAreaMaintainRegionNodes(vm.areaMaintainData, newValue);
							    	if(vm.areaMaintainRegionNodes.length > 0) {
							    		scope.selected = vm.areaMaintainRegionNodes[vm.areaMaintainRegionNodes.length - 1]['NAME'];
							    		
							    		if(options.isBroadcast) {
											$rootScope.$broadcast('emit-advsearch', {
												'model': options.ngModel,
												'name': scope.selected,
												'type': 'init'
											});
										}
							    	}
							    }, function(msg) {
							    	vm.areaMaintainData = [];
							    	vm.areaMaintainRegionNodes = [];
							    	console.error(msg);
							    });
							} else {
								if (regExp.test(newValue)) {
									AreaService.init();
									
									AreaService.promiseRegions.then(
										function(data){
											if (selectType === 'cascade') {
												// 获取层级关系的地区名称
												scope.selected = AreaService.getAreaPath(ctrl.$modelValue);
												
												if(options.isBroadcast) {
													$rootScope.$broadcast('emit-advsearch', {
														'model': options.ngModel,
														'name': scope.selected,
														'type': 'init'
													});
												}
											} else {
												// 获取地区名称
												scope.selected = AreaService.getArea(ctrl.$modelValue);
												
												if(options.isBroadcast) {
													$rootScope.$broadcast('emit-advsearch', {
														'model': options.ngModel,
														'name': scope.selected,
														'type': 'init'
													});
												}
											}
										},
										function(msg) {
											console.log('error in loading areaService');
											console.error(msg);
										}
									);													
								}
							}						
						}
					);

					var templateUrl = templateUrlBase + 'area-group-sel-tpl.html';
					switch(selectType) {
						case 'city':
							cityFn(options);
							break;
						case 'cascade':
							cascadeFn(options);
							break;
						case 'areaMaintain': 
							areaMaintainFn(options);
							break;
						default: 
							break;
					}

				}
			};
		}
	]);

	app.controller('areaOverseasSelCtrl', ['$scope', 'modalParams', 
		function($scope) {
			var vm = $scope.vm = {
				dataAll: modalParams.dataAll,
				groupData: AlphabetGroupFactory.getResetGroupData(modalParams.groupData, true),
				contentData: [[], [], [], [], [], []],
				selectedLabel: null
			},
				options = $scope.options= {
					search: false,
					isLoading: false,
					colsClass: '',
					commonColsClass: ''
				},
				colsClass = '',
				commonColsClass = '';
			
			angular.extend(options, modalParams.options);
		}
	])

	/**
	 * [area group select controller]:用于地区字母分组的弹出层选择
	 * @param  {modalParams} 
	 */
	app.controller('areaGroupSelCtrl', ['$scope', '$conowModalInstance', 'modalParams', 'AlphabetGroupFactory', 'DataService', '$timeout', '$filter', 
		function($scope, $conowModalInstance, modalParams, AlphabetGroupFactory, DataService, $timeout, $filter) {
			var vm = $scope.vm = {
				dataAll: modalParams.dataAll,
				groupData: AlphabetGroupFactory.getResetGroupData(modalParams.groupData, true),
				groupData2: AlphabetGroupFactory.getResetGroupData(modalParams.groupData2, true),
				contentData: [[], [], [], [], [], []],
				contentData2: [[], [], [], [], [], []],
				selectedLabel: null
			},
				options = $scope.options= {
					search: false,
					isLoading: false,
					colsClass: '',
					commonColsClass: ''
				},
				colsClass = '',
				commonColsClass = '',
				options2 = $scope.options2 = angular.extend({}, options);
			
			angular.extend(options, modalParams.options);
			angular.extend(options2, modalParams.options2);
			
			$scope.cityNameFilter = function(item) {
				return (item[options.selectTitle].indexOf(vm.searchKey) > -1 
						|| item[options.selectValue].indexOf(vm.searchKey) > -1);
			}
			
			// 生成每一列的样式类名 - start @20151026
			switch(options.colsPerRow) {
				case 1: 
					colsClass = ' cols-per-row-1';
					break;
				case 2:
					colsClass = ' cols-per-row-2';
					break;
				case 4: 
					colsClass = ' cols-per-row-4';
					break;
				case 5: 
					colsClass = ' cols-per-row-5';
					break;
				default:			// 默认为每行显示3列
					colsClass = ' cols-per-row-3';
			}
			
			options.colsClass += colsClass;
			
			if(angular.isDefined(options.commonColsPerRow)) {
				switch(options.commonColsPerRow) {
					case 1: 
						commonColsClass = ' cols-per-row-1';
						break;
					case 2:
						commonColsClass = ' cols-per-row-2';
						break;
					case 4: 
						commonColsClass = ' cols-per-row-4';
						break;
					case 5: 
						commonColsClass = ' cols-per-row-5';
						break;
					default:			// 默认为每行显示3列
						commonColsClass = ' cols-per-row-3';
				}
				
				options.commonColsClass += commonColsClass;
			} else {
				options.commonColsClass = options.colsClass;
			}
			// 生成每一列的样式类名 - end @20151026
			
			// 当配置common展开时，初始化展开"热门"分组，并显示对应的数据
			if(options.isCommonExpanded) {
				vm.contentData[0] = vm.groupData[0].children[0].children;
				vm.contentData2[0] = vm.groupData2[0].children[0].children;
			}

			// 已选项值
			vm.selectedValue = modalParams.selectedValue;
			// 所有待选项数组
			vm.dataList = angular.copy(modalParams.dataList);

			// 搜索框 keyup 触发搜索		对搜索逻辑进行调整@20151116
			$scope.searchKeyup = function(e) {
				var searchTimeout = null;
				
				if(searchTimeout) {
					$timeout.cancel(searchTimeout);
				}
				
				searchTimeout = $timeout(function() {
					options.search = true;
					
					if(angular.isUndefined(vm.searchKey)) {
						options.noKeyWord = true;
						options.showSearchResult = false;
						
						vm.dataListShow = [];
					} else if(vm.searchKey.length === 0) {
						options.search = false;
					} else if(vm.searchKey.length > 0) {
						options.noKeyWord = false;
						options.showSearchResult = true;
						
						vm.dataListShow = $filter('filter')(vm.dataList, vm.searchKey);
					} else {
						// for other conditions
					}	
				}, 500);

			};

			// 返回国家列表
			$scope.back2List = function(e) {
				e.preventDefault();
				
				options.search = false;
				vm.searchKey = '';
			};

			// 搜索结果点击选择
			$scope.searchItemClick = function(e, item) {
				e.preventDefault();

				vm.selected = item;
				vm.selectedName = item['OPTION_NAME'];

				$scope.confirm(e);
			};

			// group label click function
			$scope.groupLabelClick = function(e, group) {
				if(e) {
					e.preventDefault();
				}

				if(group.expanded) {
					group.expanded = false;
					// group.selectedLabel = null;
					vm.selectedLabel = null;
				} else {
					var children = group.children,
						iLen = children.length,
						child = children[0];
					
					if(angular.equals(options.isShowAllLabels, false)) {					
						for(var i=0; i<iLen; i++) {
							if(children[i].children.length > 0) {
								child = children[i];
								break;
							}
						}
					}
					
					$scope.itemLabelClick(e, child, group);
				}
			};

			// item label click function
			$scope.itemLabelClick = function(e, item, group) {
				if(e) {
					e.preventDefault();
				}
				
				var vmLen = vm.groupData.length;
				
				for(var i=0; i<vmLen; i++) {
					vm.groupData[i].expanded = false;
				}

				group.expanded = true;

				var groupIndex = AlphabetGroupFactory.getGroupIndex(item.label, options.isHasCommon);

				if(!item.children && !options.isLoadingAll && options.getDataInitialsUrl) {
					DataService.postData(options.getDataInitialsUrl, {'Initials': item.label})
						.then(function(data) {
							if(data.success && data.obj) {
								data = data.obj[item.label];

								item.children = data;
								vm.contentData[groupIndex] = data;
								vm.contentData2[groupIndex] = data;
							}
						}, function(msg) {
							console.error(msg);
						});
				}
				if(options.isLoadingAll || item.children) {
					vm.contentData[groupIndex] = item.children;
					vm.contentData2[groupIndex] = item.children;
				}

				vm.selectedLabel = item.label;

				if(e) {
					e.stopPropagation();
				}
			};

			// item click function
			$scope.itemClick = function(e, item) {
				e.preventDefault();

				vm.selected = item;
				$timeout(function() {
					vm.selectedValue = item[options.selectValue];

					 $scope.confirm(e);
				});
			};

			// 确认
			$scope.confirm = function(e) {
				e.preventDefault();
				
				$conowModalInstance.close(vm.selected);
			}
		}
	]);

	/*
	 * 地区级联选择弹出层 controller
	 * */
	app.controller('areaSelModalCtrl', ['$scope', '$timeout', '$http', 'modalParams', '$filter', 'AreaService','$conowModalInstance',
	    function($scope, $timeout, $http, modalParams, $filter, AreaService,$conowModalInstance) {

	        var entity = $scope.entity = {},
	        	options = $scope.options = {
		    		isShowSearch: true,
		    		isConfirmDisabled: false
		        },
	        	areaCascade = AreaService.getAreaCascade(),
	        	areaSelected = entity.areaSelected = {
		            province: null,
		            city: null,
		            county: null
		        },
		        virtualCodeArr = areaCascade['virtual'];
	        
	        angular.extend(options, AreaService.getKeysOptions());
	        
	        entity.provinces = areaCascade.provinces;

	        entity.selectedTab = 0;
	        
	        // 根据已选择的对象，生成符合格式的返回数据
	        var generateSelected = function(areaSelected, virtualCodeArr) {
	        	var label = '',
	        		code = '',
	        		province = areaSelected.province,
	        		city = areaSelected.city,
	        		county = areaSelected.county;
	        		
	        	if (angular.isDefined(province) && !angular.equals(province, null)) {
	        		if(!AreaService.isVirtualNode(province, virtualCodeArr)) {
		        		code = province[options.keyCode];
	        		}
	        		label = province[options.keyName];
		        }
		        if (angular.isDefined(city) && !angular.equals(city, null)) {
		        	if(!AreaService.isVirtualNode(city, virtualCodeArr)) {
		        		code = city[options.keyCode];
	        		} else {
		        		if(angular.equals(county, null)) {
		        			options.isConfirmDisabled = true;
		        		}
	        		}
		        	label += '-' + city[options.keyName];
		        } else {
		        	options.isConfirmDisabled = false;
		        }
		        if (angular.isDefined(county) && !angular.equals(county, null)) {
		        	if(!AreaService.isVirtualNode(county, virtualCodeArr)) {
		        		code = county[options.keyCode];
	        		}
		        	label += '-' + county[options.keyName];
		        }
		        
		        entity.selectedData = {
		        	'label': label,
		        	'code': code
		        };
	        };

	        // 获取已选择的项
	        if (modalParams.selectedArea.code) {
	            var regionNodes = AreaService.getRegionNodes(modalParams.selectedArea.code),
	            	regionNodesLen = regionNodes.length;
	            
	            entity.selectedTab = regionNodesLen - 1;
	            areaSelected.province = regionNodes[0];
	            areaSelected.city = regionNodes[1];
	            areaSelected.county = regionNodes[2];
	            
	            if(angular.isDefined(areaSelected.province)) {
	            	entity.cities = areaSelected.province[options.keyChildren];
	            }            
	            if(angular.isDefined(areaSelected.city)) {
	            	entity.counties = areaSelected.city[options.keyChildren];
	            }
	            
	            generateSelected(areaSelected, virtualCodeArr);
	        };

	        // 点击选择地区
	        $scope.areaSelect = function(obj, selectType, $event) {
	        	
	        	// 用于判断返回已选值得标志(当子节点为空或者选择"区"时，则返回)
	        	var returnFlag = false;
	        	
	            if (selectType == 'province') {
	            	entity.cities = obj[options.keyChildren];
	            	if(angular.isUndefined(entity.cities) || entity.cities.length === 0) {
	            		returnFlag = true;
	            	}
	                entity.counties = null;
	                areaSelected.province = obj;
	                areaSelected.city = null;
	                areaSelected.county = null;
	            } else if (selectType == 'city') {
	            	entity.counties = obj[options.keyChildren];
	            	if(angular.isUndefined(entity.counties) || entity.counties.length === 0) {
	            		returnFlag = true;
	            	}
	                areaSelected.city = obj;
	                areaSelected.county = null;
	            } else if (selectType == 'county') {
	            	returnFlag = true;
	                areaSelected.county = obj;
	            } else {
	                console.log('Get a wrong selectType: ' + selectType);
	            }
	            
	            generateSelected(areaSelected, virtualCodeArr);
	            
	            // 切换各层级时，过滤参数置空
	            entity.searchKey = '';
	            
	            // 为区一级时，自动返回
	            if(returnFlag) {
	            	$scope.confirm();
	            }
	            $event.preventDefault();
	        };
	        
	        // 确定触发，返回已选值
	        $scope.confirm = function() {
	        	$conowModalInstance.close(entity.selectedData);
	        };

	        $scope.close = function() {
	            $conowModalInstance.dismiss('close');
	        };

	        $scope.cancel = function() {
	            $conowModalInstance.dismiss('cancel');
	        };
	    }
	]);

	/*
	 * 地区维护弹出选择 controller
	 * */
	app.controller('areaMaintainSelModalCtrl', ['$scope', '$conowModalInstance', 'modalParams', 'AreaService', 
	    function($scope, $conowModalInstance, modalParams, AreaService) {

		    var vm = $scope.vm = {},
		    	options = $scope.options = {
		    		isShowSearch: true
		        };
		    
		    angular.extend(options, AreaService.getKeysOptions());
		    
		    vm.countries = modalParams.dataAll;
		
		    var areaSelected = vm.areaSelected = {
		    	country: null,
		        province: null,
		        city: null
		    };
		
		    vm.selectedTab = 0;
		    
		    // 根据已选择的对象，生成符合格式的返回数据
		    var generateSelected = function(areaSelected) {
		    	var label = '',
		    		code = '',
		    		selectedArr = [];

		        if (areaSelected.country) {
		        	label = areaSelected.country[options.keyName];
		        	code = areaSelected.country[options.keyCode];
		        	selectedArr.push(areaSelected.country);
		        }
		    	if (areaSelected.province) {
		    		label += '-' + areaSelected.province[options.keyName];
		    		code = areaSelected.province[options.keyCode];
		        	selectedArr.push(areaSelected.province);
		        }
		        if (areaSelected.city) {
		        	label += '-' + areaSelected.city[options.keyName];
		        	code = areaSelected.city[options.keyCode];
		        	selectedArr.push(areaSelected.city);
		        }
		        
		        vm.selectedData = {
		        	'label': label,
		        	'code': code,
		        	'selectedArr': selectedArr
		        };
		    };
		
		    // 获取已选择的项
		    var selectedAreaNodes = modalParams.selectedAreaNodes;
		    if (angular.isArray(selectedAreaNodes) && selectedAreaNodes.length > 0) {
		        var regionNodes = selectedAreaNodes,
		        	regionNodesLen = regionNodes.length;
		        
		        vm.selectedTab = regionNodesLen - 1;
		        areaSelected.country = regionNodes[0];
		        areaSelected.province = regionNodes[1];
		        areaSelected.city = regionNodes[2];
		        
		        if(angular.isDefined(areaSelected.country)) {
		        	vm.provinces = areaSelected.country[options.keyChildren];
		        }            
		        if(angular.isDefined(areaSelected.province)) {
		        	vm.cities = areaSelected.province[options.keyChildren];
		        }
		        
		        generateSelected(areaSelected);
		    };
		    
		    // 处理国家选择
		    var countryFn = function(obj) {
		    	vm.provinces = obj[options.keyChildren];
		    	vm.cities = null;
	            areaSelected.country = obj;
	            areaSelected.province = null;
	            areaSelected.city = null;
		    };
		    
		    // 处理省份选择
		    var provinceFn = function(obj) {
		    	vm.cities = obj[options.keyChildren];
	            areaSelected.province = obj;
	            areaSelected.city = null;
		    };
		    
		    // 处理城市选择
		    var cityFn = function(obj) {
		    	areaSelected.city = obj;
		    };
		
		    // 点击选择地区
		    $scope.areaSelect = function(obj, selectType, $event) {
		    	switch(selectType) {
			    	case 'country':
			    		countryFn(obj);
			    		break;
			    	case 'province':
			    		provinceFn(obj);
			    		break;
			    	case 'city':
			    		cityFn(obj);
			    		break;
		    		default:
		    			break;
		    	}
		        
		        generateSelected(areaSelected);
		        
		        // 切换各层级时，过滤参数置空
		        vm.searchKey = '';
		        
		        // 为区一级时，自动返回
		        if(selectType == 'city') {
		        	$scope.confirm();
		        }
		        $event.preventDefault();
		    };
		    
		    // 确定触发，返回已选值
		    $scope.confirm = function() {
		    	$conowModalInstance.close(vm.selectedData);
		    };
		
		    $scope.close = function() {
		        $conowModalInstance.dismiss('close');
		    };
		
		    $scope.cancel = function() {
		        $conowModalInstance.dismiss('cancel');
		    };
		}
	]);
})(angular);