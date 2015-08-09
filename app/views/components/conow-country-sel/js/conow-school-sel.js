'use strict';

app.service('schoolService', ['DataService', '$q', 
	function(DataService, $q) {
		var dataAll = [], 
				self = this,
				dataSrcUrl = 'views/components/conow-country-sel/data/school/query-is-common-school.json';

		this.deferred = $q.defer();
		this.schoolPromise = this.deferred.promise;

		var init = function() {
			DataService.getData(dataSrcUrl)
				.then(function(data) {
					if(data.success) {
						data = data.obj;

						dataAll = data;
						self.deferred.resolve('Init finished...');
					} else {
						self.deferred.reject('Init wrong...' + msg);
					}
				}, function(msg) {
					self.deferred.reject('Init wrong...' + msg);
				})
		};

		// initialization
		init();

		/**
		 * get all school data
		 */
		this.getSchoolData = function() {
			return dataAll;
		}

	}
]);

/**
 * conowSchoolSel directive
 */
app.directive('conowSchoolSel', ['$filter', 'schoolService', 'conowModals', 
	function($filter, schoolService, conowModals) {
		return {
			restrict: 'A',
			scope: {
				ngModel: '='
			},
			replace: true,
			template: '<input type="text" ng-click="schoolSelClick($event)">',
			link: function(scope, elem, attrs) {
				var vm = scope.vm = {};

				schoolService.schoolPromise
					.then(function() {
						var objData = schoolService.getSchoolData();
						vm.dataAll = {'COMMON': objData};
						var strAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
						for(var i=0; i<strAlphabet.length; i++) {
							vm.dataAll[strAlphabet[i]] = null;
						}
						vm.groupData = $filter('groupByAlphabet')(vm.dataAll);
					}, function(msg) {
						console.error(msg);
					});

				// select click to open modal
				scope.schoolSelClick = function(e) {
					var modalInstance = conowModals.open({
						templateUrl: 'views/components/conow-country-sel/tpls/country-sel-tpl.html',
						size: 'lg',
						title: '选择',
						controller: 'schoolSelCtrl',
						resolve: {
							modalParams: function() {
								return {
									dataAll: vm.dataAll,
									groupData: vm.groupData,
									selectedName: vm.selectedName
								}
							}
						}
					});

					modalInstance.result.then(function(data) {
						$scope.ngModel = data.CODE;

						$timeout(function() {
							elem.val(data.VALUE);

							vm.selectedName = data.VALUE;
						}, 100);
					}, function(msg) {
						console.info('msg-->', msg);
					});
				};

			}
		}
	}
]);

/**
 * [school select modal controller]
 */
app.controller('schoolSelCtrl', ['$scope', '$conowModalInstance', 'modalParams', 
	function($scope, $conowModalInstance, modalParams) {

		var vm = $scope.vm = {
			dataAll: modalParams.dataAll,
			groupData: modalParams.groupData,
			contentData: [[], [], [], [], [], []],
			selectedLabel: null
		};
		var options = $scope.options= {
			search: false,
			isLoading: false
		};
	}
]);

/**
 * schoolSelDemoCtrl
 * demo controller
 */
app.controller('schoolSelDemoCtrl', ['$scope', 
	function($scope) {
		var options = $scope.options = {
			dataSrcUrl: 'views/components/conow-country-sel/data/school/query-is-common-school.json',
			getSelectedValueUrl: 'views/components/conow-country-sel/data/school/get-selected-value.json', 
			isLoadingAll: false,
			isHasCommon: true,
			isShowAllLabels: true,
			isShowSearch: true,
			searchUrl: '',
			isMultiSelect: false,
			selectedKey: 'CODE',
			selectedValue: 'VALUE'
		};

		var vm = $scope.vm = {
			selected: '18'
		}

	}
]);

/**
 * [alphabet group filter]: 根据字母表顺序对数据进行分组
 */
app.filter('groupByAlphabet', ['$filter', 
	function($filter) {
		var filterFn = function(input) {
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
					arrSrc[i].label = '热门';
					arrTmp.push(arrSrc[i]);
					arr.push({
						'expanded': false,
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
						// 
						// arr.push(arrTmp);
						arr.push({
							'expanded': false,
							'children': arrTmp
						});

						arrTmp = [];
					}
				}

				arr[arr.length - 1].children.push(arrSrc[iLen - 1]);
			}			
console.log('arr-->', arr);
			return arr;
		};

		return filterFn;
	}
]);

app.factory('AlphabetGroupFactory', ['DataService', 
	function(DataService) {
		var service = {};

		// 根据字母获取在分组中的索引
		service.getGroupIndex = function(label) {
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

			return groupIndex + 1;
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
				ngModel: '='
			}, 
			replace: true,
			template: '<input type="text" ng-click="selClick($event)">',
			link: function(scope, elem, attrs) {

				var options = scope.$eval(attrs.conowAlphabetGroupSel);
				var vm = scope.vm = {};

				// init options
				if(!options.dataSrcUrl) {
					console.error('Get dataSrcUrl wrong...');
					return false;
				}
				// fetch init data
				DataService.getData(options.dataSrcUrl)
					.then(function(data) {
						console.log(data);
						if(data.success) {
							var objData = data.obj;

							var strAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
							var arrAlphabet = strAlphabet.split('');
							for(var i=0; i<arrAlphabet.length; i++) {
								objData[arrAlphabet[i]] = null
							};

							vm.groupData = $filter('groupByAlphabet')(objData);

							vm.objData = objData;
						} else {
							console.error('Data init wrong...');
						}
					}, function(msg) {
						console.error('Data init wrong...');
					});

				// 如果页面没有获取到所有的额数据，则通过参数给点接口获取对应的已选择值
				if(options.getSelectedValueUrl) {
					DataService.getData(options.getSelectedValueUrl)
						.then(function(data) {
							if(data.success && data.obj) {
								vm.selectedValue = data.obj;

								$timeout(function() {
									elem.val(data.obj);
								});
							} else {
								console.error('Get selected value wrong...');
							}
						}, function(msg) {
							console.error(msg);
						})
				}


				/**
				 * [点击触发方法]
				 * @param  {[type]} e [description]
				 * @return {[type]}   [description]
				 */
				scope.selClick = function(e) {
					e.preventDefault();
					var modalInstance = conowModals.open({
						templateUrl: 'views/components/conow-country-sel/tpls/alphabet-group-sel-tpl.html',
						size: 'lg',
						title: '选择',
						controller: 'alphabetGroupSelCtrl',
						resolve: {
							modalParams: function() {
								return {
									dataAll: vm.dataAll,
									groupData: vm.groupData,
									selectedValue: vm.selectedValue,
									options: options
								}
							}
						}
					});

					modalInstance.result.then(function(data) {
						console.log(data);
					}, function(msg) {
						console.error('msg-->', msg);
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
app.controller('alphabetGroupSelCtrl', ['$scope', '$conowModalInstance', 'modalParams', 'AlphabetGroupFactory', 
	function($scope, $conowModalInstance, modalParams, AlphabetGroupFactory) {
		var vm = $scope.vm = {
			dataAll: modalParams.dataAll,
			groupData: modalParams.groupData,
			contentData: [[], [], [], [], [], []],
			selectedLabel: null
		};
		var options = $scope.options= {
			search: false,
			isLoading: false
		};
		angular.extend(options, modalParams.options);


		// 已选项值
		vm.selectedValue = modalParams.selectedValue;

		var dataList = [];
		angular.forEach(vm.dataAll, function(value, key) {
			dataList = dataList.concat(value);
		});
		vm.dataList = dataList;

		// 搜索框 keyup 触发搜索
		$scope.searchKeyup = function(e) {
			
			if(e.keyCode === 13) {
				options.search = true;
				options.isLoading = true;
			}
		};

		// 返回国家列表
		$scope.back2List = function(e) {
			e.preventDefault();

			options.search = false;
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
			e.preventDefault();

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
			e.preventDefault();

			// var alphabetGroupFactory = new AlphabetGroupFactory();

			// 清空搜索框
			vm.searchKey = '';

			group.expanded = true;
			// group.selectedLabel = item.label;

			var groupIndex = AlphabetGroupFactory.getGroupIndex(item.label);

			// if(!item.children && options.)
			vm.contentData[groupIndex] = item.children;
			vm.selectedLabel = item.label;

			e.stopPropagation();
		};

		// item click function
		$scope.itemClick = function(e, item) {
			e.preventDefault();

			vm.selected = item;
			// vm.selectedName = item['OPTION_NAME'];

			// angular.forEach(vm.groupData, function(value, key) {
			// 	value.expanded = false;
			// });

			$scope.confirm(e);
		};

		// 确认
		$scope.confirm = function(e) {
			e.preventDefault();
			
			$conowModalInstance.close(vm.selected);
		}
	}
]);

