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
			isLoadingAll: false,
			isHasCommon: true,
			isShowAllLabels: true,
			isShowSearch: true,
			searchUrl: '',
			isMultiSelect: false
		};

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

app.factory('AlphabetGroupFactory', [
	function() {
		var service = {};

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

		return service;
	}
]);

/**
 * [conowAlphabetGroupSel]:字母分组选择指令
 */
app.directive('conowAlphabetGroupSel', ['$filter', 'DataService', 'conowModals', 
	function($filter, DataService, conowModals) {
		return {
			restrict: 'AE',
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
							vm.objData = data.obj;

							vm.groupData = $filter('groupByAlphabet')(vm.objData);
						} else {
							console.error('Data init wrong...');
						}
					}, function(msg) {
						console.error('Data init wrong...');
					});



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
									selectedName: vm.selectedName
								}
							}
						}
					});

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

		// 已选项名称
		vm.selectedName = modalParams.selectedName;

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
		$scope.backCountryList = function(e) {
			e.preventDefault();

			options.search = false;
		};

		// 搜索结果点击选择
		$scope.countryItemClick = function(e, item) {
			e.preventDefault();

			vm.selected = item;
			vm.selectedName = item['OPTION_NAME'];

			$scope.confirm(e);
		};

		// country label group click function
		$scope.countryLabelClick = function(e, group) {
			e.preventDefault();

			if(group.expanded) {
				group.expanded = false;
				// group.selectedLabel = null;
				vm.selectedLabel = null;
			} else {
				var children = group.children;
				var child = null;
				for(var i=0; i<children.length; i++) {
					if(children[i]['children'].length > 0) {
						child = children[i];
						break;
					}
				}
				$scope.labelItemClick(e, child, group);
			}
		};

		// label item click function
		$scope.labelItemClick = function(e, item, group) {
			e.preventDefault();

			var alphabetGroupFactory = new AlphabetGroupFactory();

			// 清空搜索框
			vm.searchKey = '';

			group.expanded = true;
			// group.selectedLabel = item.label;

			var groupIndex = alphabetGroupFactory.getGroupIndex(item.label);
			vm.contentData[groupIndex] = item.children;
			vm.selectedLabel = item.label;

			e.stopPropagation();
		};

		// country click function
		$scope.countryClick = function(e, item) {
			e.preventDefault();

			vm.selected = item;
			vm.selectedName = item['OPTION_NAME'];

			angular.forEach(vm.groupData, function(value, key) {
				value.expanded = false;
			});

			$scope.confirm(e);
		};

		// 确认
		$scope.confirm = function(e) {
			e.preventDefault();
			
			$conowModalInstance.close(vm.selected);
		}
	}
]);

