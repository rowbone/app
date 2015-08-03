'use strict';

app.service('peerCountriesService', ['$q', 'DataService', 
	function($q, DataService) {

		var objCountries = {},
				dataAll = [],
				isLoading = true,
				dataSrcUrl = 'views/components/conow-country-sel/data/country-queryAllCountry.json',
				self = this;

		this.deferred = $q.defer();
		this.peerCountriesPromise = this.deferred.promise;

		var init = function() {
			DataService.getData(dataSrcUrl)
				.then(function(data) {
					if(data.success) {
						data = data.obj;
					}
					objCountries = data;
					angular.forEach(objCountries, function(value, key) {
						dataAll = dataAll.concat(value);
					});

					self.deferred.resolve('Initing finished...');
				}, function(msg) {
					console.error('msg-->', msg);
					self.deferred.reject('Initing wrong...');
				})
		};

		// initialization
		init();

		// get all countries data
		this.getAllCountries = function() {

			return objCountries;
		};

		/**
		 * 根据 code 获取对应的国家名称
		 * @param  {countryCode} 已选择国家的 code
		 * @return {countryName} 已选择国家的名称
		 */
		this.getSelectedCountryName = function(countryCode) {
			var countryName = '';
			var iLen = dataAll.length;
			for(var i=0; i<iLen; i++) {
				if(dataAll[i].CODE === countryCode) {
					countryName = dataAll[i].VALUE;
					break;
				}
			}

			return countryName;
		};

		/**
		 * [getGroupIndex description]
		 * @param  {[type]} label [description]
		 * @return {[type]}       [description]
		 */
		this.getGroupIndex = function(label) {
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

		/**
		 * 重置每个分组为初始项[未选择]
		 */
		this.getResetGroupData = function(groupData) {
			var iLen = groupData.length;
			for(var i=0; i<iLen; i++) {
				groupData[i].expanded = false;
			}

			return groupData;
		};

	}
]);

/**
 * @param  {input}
 * @return {[type]}
 */
app.filter('countryCodeToName', ['peerCountriesService', '$q', 
	function(peerCountriesService, $q) {
		return function(input) {

			peerCountriesService.peerCountriesPromise
				.then(function() {
					return peerCountriesService.getSelectedCountryName(input);
				})

		};

		return filterFunc;
	}
]);

app.filter('groupByAlphabet', ['$filter', 
	function($filter) {
		var filterFunc = function(input) {
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

			return arr;
		};

		return filterFunc;
	}
]);

/*
 * conow country select directive
 */
app.directive('conowCountrySelect', ['DataService', 'conowModals', 'countriesService', '$timeout', '$filter', 'peerCountriesService', 
	function(DataService, conowModals, countriesService, $timeout, $filter, peerCountriesService) {
		return {
			restrict: 'AE', 
			scope: {
				ngModel: '='
			},
			require: '?ngModel',
			replace: true,
			template: '<input type="text" ng-click="countrySelClick($event)">',
			link: function($scope, elem, attrs, ctrl) {
				//
				var vm = $scope.vm = {};

				peerCountriesService.peerCountriesPromise
					.then(function(data) {
						vm.dataAll = peerCountriesService.getAllCountries();
						vm.groupData = $filter('groupByAlphabet')(vm.dataAll);

						// 当绑定的code以数字开始时，才调用转换方法
						var regExp = /^\d+/;
						if(regExp.test($scope.ngModel)) {
							vm.selectedName = peerCountriesService.getSelectedCountryName($scope.ngModel);
							elem.val(vm.selectedName);
						}
					});

				// click function
				$scope.countrySelClick = function(e) {
					var modalInstance = conowModals.open({
						templateUrl: 'views/components/conow-country-sel/tpls/country-sel-tpl.html',
						size: 'lg',
						title: '选择',
						controller: 'countrySelCtrl',
						resolve: {
							modalParams: function() {
								return {
									dataAll: vm.dataAll,
									groupData: peerCountriesService.getResetGroupData(vm.groupData),
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
 * peerCountriesSel controller
 */
app.controller('countrySelCtrl', ['$scope', '$conowModalInstance', 'modalParams', 'peerCountriesService', 
	function($scope, $conowModalInstance, modalParams, peerCountriesService) {

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

			// 清空搜索框
			vm.searchKey = '';

			group.expanded = true;
			// group.selectedLabel = item.label;

			var groupIndex = peerCountriesService.getGroupIndex(item.label);
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