'use strict';

/**
 * [alphabet group filter]: 根据字母表顺序对数据进行分组
 */
app.filter('groupByAlphabet', ['$filter', 
	function($filter) {
		var filterFn = function(input, isCommonExpanded) {
			var arrSrc = [];
			var arr = [];
			var arrTmp = [];

			if(angular.isObject(input)) {

				angular.forEach(input, function(value, key) {
					this.push({
						'label': key,
						'children': value,
						'selected': false
					})
				}, arrSrc);
			} else {
				console.info('Data source is not an object');
			}

			// 如果有 COMMON 数据，则单独处理[生成的数据"热门"一项需要单独一行显示]
			var iLen = arrSrc.length;
			for(var i=0; i<iLen; i++) {
				if(arrSrc[i].label === 'COMMON') {
					var commonExpanded = false;
					arrSrc[i].label = '热门';
					if(isCommonExpanded) {
						arrSrc[i].selected = true;
						commonExpanded = true;
					}
					arrTmp.push(arrSrc[i]);
					arr.push({
						'expanded': commonExpanded,
						'children': arrTmp
					});

					arrSrc.splice(i, 1);
					arrTmp = [];			// arrTmp 置空

					break;
				}
			}

			iLen = arrSrc.length;
			if(iLen > 0) {
				for(var i=0; i<iLen; i++) {
					arrTmp.push(arrSrc[i]);
					if(i % 5 === 4) {
						arr.push({
							'expanded': false,
							'children': arrTmp
						});

						arrTmp = [];
					}
				}

				arr[arr.length - 1].children.push(arrSrc[iLen - 1]);
			}			

			return arr;
		};

		return filterFn;
	}
]);

/**
 * [AlphabetGroupFactory]：字母分组服务，用于一些公共方法
 */
app.factory('AlphabetGroupFactory', ['DataService', 
	function(DataService) {
		var service = {};

		// 根据字母获取在分组中的索引
		service.getGroupIndex = function(label, isHasCommon) {
			var strAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			var index = strAlphabet.indexOf(label);
			var groupIndex = -1;

			if(index >= 20) {
				groupIndex = 4;
			} else if(index == -1) {
				groupIndex = -1;
			} else {
				groupIndex = parseInt(index / 5);
			}

			if(isHasCommon) {
				return groupIndex + 1;
			} else {
				return groupIndex;
			}
		};

		// 获取已选项的值
		service.getSelectedValue = function(selectedKey, allData, keyCode, valueCode) {
			keyCode = keyCode || 'CODE';
			valueCode = valueCode || 'VALUE';

			var iLen = allData.length;
			for(var i=0; i<iLen; i++) {
				if(allData[i][keyCode] == selectedKey) {
					return allData[i][valueCode];
				}
			}

			console.info('Get selectedValue wrong, return the selectedKey');
			return selectedKey;
		};

		/**
		 * 重置每个分组为初始项[未选择]
		 */
		service.getResetGroupData = function(groupData, isCommonExpanded) {
			var iLen = groupData.length;
			for(var i=0; i<iLen; i++) {
				if(i === 0 && isCommonExpanded) {
					groupData[i].expanded = true;
				} else {
					groupData[i].expanded = false;
				}
			}

			return groupData;
		};

		return service;
	}
]);

/**
 * [conowAlphabetGroupSel]:字母分组选择指令
 */
app.directive('conowAlphabetGroupSel', ['$filter', 'DataService', 'conowModals', '$timeout', 
	function($filter, DataService, conowModals, $timeout) {
		return {
			restrict: 'AE',
			scope: {
				ngModel: '=',
				callbackFn: '&'
			}, 
			replace: true,
			template: '<input type="text" ng-click="selClick($event)">',
			link: function(scope, elem, attrs) {

				var options = scope.$eval(attrs.conowAlphabetGroupSel);
				var vm = scope.vm = {};

				if(angular.isUndefined(options.selectTitle)) {
					options.selectTitle = options.selectValue;
				}

				// init options
				if(!options.dataSrcUrl) {
					console.error('Get dataSrcUrl wrong...');
					return false;
				}
				// fetch init data
				DataService.getData(options.dataSrcUrl)
					.then(function(data) {
						if(data.success) {
							var objData = data.obj;
							if(!options.isLoadingAll) {
								// 初始化不加载所有数据，生成对应字母的假数据
								var strAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
								var arrAlphabet = strAlphabet.split('');
								for(var i=0; i<arrAlphabet.length; i++) {
									objData[arrAlphabet[i]] = null
								};
							} else {
								// 初始化时加载所有数据，生成数据list数组
								var dataList = [];
								angular.forEach(objData, function(value, key) {
									dataList = dataList.concat(value);
								});
								vm.dataList = dataList;
								// 转换已选择 key 为 value
								for(var i=0; i<dataList.length; i++) {
									if(dataList[i][options.selectKey] === scope.ngModel) {
										$timeout(function() {
											var selectedValue = dataList[i][options.selectValue];

											elem.val(selectedValue);
											vm.selectedValue = selectedValue;
										});

										break;
									}
								}
							}

							vm.groupData = $filter('groupByAlphabet')(objData, true);

							vm.objData = objData;
						} else {
							console.error('Data init wrong...');
						}
					}, function(msg) {
						console.error('Data init wrong...');
					});

				if(options.isLoadingAll) {
					// 
				} else if(!options.isLoadingAll && options.getSelectedValueUrl) {
					// 如果页面没有获取到所有的数据，则通过参数给定接口获取对应的已选择值
					DataService.getData(options.getSelectedValueUrl)
					 // DataService.postData(options.getSelectedValueUrl, {'CODE': scope.ngModel})
						.then(function(data) {
							if(data.success && data.obj) {
								var selectedValue = data.obj[options.selectValue];
								
								vm.selectedValue = selectedValue;

								$timeout(function() {
									elem.val(selectedValue);
								});
							} else {
								console.error('Get selected value wrong...');
							}
						}, function(msg) {
							console.error(msg);
						})
				} else {
					// 
				};

				/**
				 * [点击触发方法]
				 * @param  {[type]} e [description]
				 * @return {[type]}   [description]
				 */
				scope.selClick = function(e) {
					e.preventDefault();
					var modalInstance = conowModals.open({
						// templateUrl: 'js/directives/conow-alphabet-group/tpls/alphabet-group-sel-tpl.html',
						templateUrl: 'views/components/conow-country-sel/tpls/alphabet-group-sel-tpl.html',
						size: 'lg',
						title: options.titleName || '',
						controller: 'alphabetGroupSelCtrl',
						resolve: {
							modalParams: function() {
								return {
									dataAll: vm.dataAll,
									groupData: vm.groupData,
									dataList: vm.dataList,
									selectedValue: vm.selectedValue,
									options: options
								}
							}
						}
					});

					modalInstance.result.then(function(data) {
						scope.ngModel = data[options.selectKey];

						$timeout(function() {
							var selectedValue = data[options.selectValue];
							elem.val(selectedValue);

							vm.selectedValue = selectedValue;

							if(angular.isFunction(scope.callbackFn)) {
								(scope.callbackFn)({'selected': data});
							}
						}, 100);
					}, function(msg) {
						console.log('msg-->', msg);
					})

					e.stopPropagation();
				};
			}
		}
	}
]);

/**
 * [alphabet group select controller]:用于字母分组的弹出层选择
 * @param  {modalParams} 
 */
app.controller('alphabetGroupSelCtrl', ['$scope', '$conowModalInstance', 'modalParams', 'AlphabetGroupFactory', 'DataService', '$timeout', '$filter', 
	function($scope, $conowModalInstance, modalParams, AlphabetGroupFactory, DataService, $timeout, $filter) {
		var vm = $scope.vm = {
			dataAll: modalParams.dataAll,
			groupData: AlphabetGroupFactory.getResetGroupData(modalParams.groupData, true),
			contentData: [[], [], [], [], [], []],
			selectedLabel: null
		};
		var options = $scope.options= {
			search: false,
			isLoading: false
		};
		angular.extend(options, modalParams.options);
		// 当配置common展开时，初始化展开"热门"分组，并显示对应的数据
		if(options.isCommonExpanded) {
			vm.contentData[0] = vm.groupData[0].children[0].children;
		}

		// 已选项值
		vm.selectedValue = modalParams.selectedValue;
		// 所有待选项数组
		vm.dataList = modalParams.dataList;

		// 搜索框 keyup 触发搜索
		$scope.searchKeyup = function(e) {
			
			if(e.keyCode === 13) {
				options.search = true;

				if(options.isLoadingAll) {
					// 
				} else if(options.searchUrl) {
					options.isLoading = true;

//					DataService.getData(options.searchUrl)
					DataService.postData(options.searchUrl, {'NAME': vm.searchKey})
						.then(function(data) {
							if(data.success && data.obj) {
								data = data.obj;

								// vm.dataList = $filter('orderBy')(data, 'VALUE');
								vm.dataList = data;

								options.isLoading = false;
							}
						}, function(msg) {
							console.log(msg);
						});
				}
			}

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
				var children = group.children;
				var child = children[0];
				// var child = null;
				// for(var i=0; i<children.length; i++) {
				// 	if(children[i]['children'].length > 0) {
				// 		child = children[i];
				// 		break;
				// 	}
				// }
				$scope.itemLabelClick(e, child, group);
			}
		};

		// item label click function
		$scope.itemLabelClick = function(e, item, group) {
			if(e) {
				e.preventDefault();
			} 

			// var alphabetGroupFactory = new AlphabetGroupFactory();

			// 清空搜索框
			vm.searchKey = '';

			group.expanded = true;
			// group.selectedLabel = item.label;

			var groupIndex = AlphabetGroupFactory.getGroupIndex(item.label, options.isHasCommon);

			if(!item.children && !options.isLoadingAll && options.getDataInitialsUrl) {
				DataService.getData(options.getDataInitialsUrl)
				// DataService.postData(options.getDataInitialsUrl, {'Initials': item.label})
					.then(function(data) {
						if(data.success && data.obj) {
							data = data.obj[item.label];

							item.children = data;
							vm.contentData[groupIndex] = data;
						}
					}, function(msg) {
						console.error(msg);
					});
			}
			if(options.isLoadingAll || item.children) {
				vm.contentData[groupIndex] = item.children;
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