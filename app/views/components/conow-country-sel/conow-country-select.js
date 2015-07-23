'use strict';

// countries data service
app.service('countriesService', ['$q', 'DataService', 
	function ($q, DataService) {
		// 
		var deferred = $q.defer();
		var url = 'views/components/conow-country-sel/data/IC_COUNTRY.json';
		var dataAll = [];
		var self = this;
		var options = {
			isLoading: true
		};

		var init = function() {

		}

		// 获取所有国家的数据
		this.getAllCountries = function(url) {

			if(!url) {
				console.error('Please provide the data url...');
			}

			DataService.getData(url)
				.then(function(data) {
					self.dataAll = data;

					options.isLoading = false;
					deferred.resolve(data);
				}, function(msg) {
					self.dataAll = [];
					options.isLoading = false;

					deferred.reject('Get countries data wrong-->', msg);
				});

			return deferred.promise;
		};

		// data init
		// self.getAllCountries();

		var getAllSelected = function(keyCode, dataAll, codeName, selected) {
			var iLen = dataAll.length;

			for(var i=0; i<iLen; i++) {
				if(dataAll[i][codeName] == keyCode) {
					return dataAll[i];
				}
			}
			var dataTmp = [];
			for(var i=0; i<iLen; i++) {
				dataTmp = dataAll[i].children;

				for(var j=0; j<dataTmp.length; j++) {
					if(dataTmp[j][codeName] == keyCode) {
						return [dataAll[i], dataTmp[j]];
					}
				}
			}

			return null;
		};

		this.getAllSelected = function(keyCode, dataAll, codeName) {
			return getAllSelected(keyCode, dataAll, codeName, []);
		};

		// 根据 code 获取对应的已选项
		var getSelectedFromData = function(keyCode, dataAll, codeName) {
			var codeName = codeName;
			var selected = null;
			// var selected = [];
			if(!codeName) {
				codeName = 'code';
			}
			if(!dataAll) {
				return;
			}

			var iLen = dataAll.length;
			for(var i=0; i<iLen; i++) {
				if(dataAll[i][codeName] === keyCode) {
					return dataAll[i];
				} else {
					if(dataAll[i].children) {
						return getSelectedFromData(keyCode, dataAll[i].children, codeName);
					} else {
						continue;						
					}
				}
			}
		};

		// 根据 id 获取已选 country 的 name 
		this.getSelectedCountryName = function(keyCode) {
			var url = 'views/components/conow-country-sel/data/country-name.json?CODE=';
			var deferred = $q.defer();

			DataService.getData(url + keyCode)
				.then(function(data) {
					if(data.success && data.obj) {
						data = data.obj;
					}
					deferred.resolve(data);
				}, function(msg) {
					deferred.reject(msg);
				});

			return deferred.promise;
		}

		this.getSelected = function(keyCode, dataAll, codeName) {
			return getSelectedFromData(keyCode, dataAll, codeName);
		}

		this.getGroupIndex = function(label) {
			var strAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			var index = strAlphabet.indexOf(label);
			var groupIndex = -1;

			if(index >= 20) {
				groupIndex = 4;
			} else {
				groupIndex = parseInt(index / 5);
			}

			return groupIndex;
		};

		this.getResetGroupData = function(groupData) {
			var iLen = groupData.length;
			for(var i=0; i<iLen; i++) {
				groupData[i].expanded = false;
			}

			return groupData;
		};

		// other methods

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
					// console.log('key-->', key, ';value-->', value);
					this.push({
						'label': key,
						'children': value,
						'selected': false
					})
				}, arrSrc);
			} else {
				console.info('Data source is not an object');
			}

			var iLen = arrSrc.length;
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

// conow country select directive
app.directive('conowCountrySelect1', ['DataService', 'conowModals', 'countriesService', '$timeout', '$filter', 
	function(DataService, conowModals, countriesService, $timeout, $filter) {
		return {
			restrict: 'AE', 
			scope: {
				ngModel: '='
			},
			// require: '?ngModel',
			replace: true,
			template: '<input type="text" ng-click="countrySelClick($event)">',
			link: function($scope, elem, attrs, ctrl) {
				//
				var url = 'views/components/conow-country-sel/data/country-letter.json';
				var vm = $scope.vm = {};

				var getSelectedCountryPromise = countriesService.getSelectedCountryName($scope.ngModel);
				getSelectedCountryPromise.then(function(data) {
					vm.selectedName = data;
					elem.val(data);
				}, function(msg) {
					console.info('msg-->', msg);
				});

				DataService.getData(url)
					.then(function(data) {
						// 
						console.log('data-->', data);
						if(data.obj) {
							data = data.obj;
						}
						vm.dataAll = data;
						vm.groupData = $filter('groupByAlphabet')(data);
					}, function(msg) {
						console.error('msg-->', msg);
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
									groupData: countriesService.getResetGroupData(vm.groupData),
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

app.controller('countrySelCtrl', ['$scope', '$conowModalInstance', 'modalParams', 'countriesService', 
	function($scope, $conowModalInstance, modalParams, countriesService) {

		var vm = $scope.vm = {
			dataAll: modalParams.dataAll,
			groupData: modalParams.groupData,
			contentData: [[], [], [], [], []],
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

			var groupIndex = countriesService.getGroupIndex(item.label);
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

// conow country cascade select directive
app.directive('conowCountryCascadeSelect', ['DataService', 'conowModals', 'countriesService', '$timeout', 
	function(DataService, conowModals, countriesService, $timeout) {

		return {
			restrict: 'AE',
			scope: {
				ngModel: '='
			},
			require: '?ngmodel',
			replace: true,
			template: '<input type="text" ng-click="countrySelClick($event)">',
			link: function($scope, elem, attrs, ctrl) {
			// 	var vm = $scope.vm = {};

			// 	$scope.titles = ['大洲', '国家'];

			// 	var url = 'views/components/conow-country-sel/data/IC_COUNTRY.json';
		
			// 	var promise = countriesService.getAllCountries(url);
			// 	promise.then(function(data) {

			// 		vm.selectedArr = countriesService.getAllSelected($scope.ngModel, data, 'OPTION_VALUE');

			// 		elem.val(vm.selectedArr[vm.selectedArr.length - 1].OPTION_NAME);
			// 	}, function(msg) {
			// 		console.log('msg-->', msg);
			// 	})

			// 	$scope.countrySelClick = function(e) {
			// 		e.preventDefault();

			// 		var modalInstance = conowModals.open({
			// 			templateUrl: 'views/components/conow-country-sel/tpls/country-cascade-sel-tpl.html',
			// 			title: '选择',
			// 			size: 'full',
			// 			controller: 'countryCascadeSelCtrl',
			// 			resolve: {
			// 				modalParams: function() {
			// 					return {
			// 						titles: $scope.titles,
			// 						selected: vm.selectedArr
			// 					}
			// 				}
			// 			}
			// 		});
			// 		modalInstance.result.then(function(data) {
			// 			var selectedVal = null;

			// 			for(var i=data.length - 1; i >= 0; i--) {
			// 				if(!angular.equals(data[i], [])) {
			// 					selectedVal = data[i];
			// 					break;
			// 				}
			// 			}
						
			// 			// 设置返回的值
			// 			// ctrl.$setViewValue(selectedVal.OPTION_VALUE);
			// 			// 直接设置 controller 绑定的值
			// 			$scope.ngModel = selectedVal.OPTION_VALUE;

			// 			// 设置显示的值
			// 			$timeout(function() {
			// 				elem.val(selectedVal.OPTION_NAME);
			// 			}, 100);

			// 		}, function(msg) {
			// 			console.log('dismiss msg-->', msg);
			// 		});

			// 		e.stopPropagation();
			// 	}
			}
		};
	}
]);

// country cascade select controller
app.controller('countryCascadeSelCtrl', ['$scope', '$conowModalInstance', 'DataService', 'modalParams', 
	function($scope, $conowModalInstance, DataService, modalParams) {
		var url = 'views/components/conow-country-sel/data/IC_COUNTRY.json';
		var vm = $scope.vm = {
				selected: modalParams.selected
			},
			options = $scope.options = {
				titles: modalParams.titles,
				url: url,
				tabs: [true, false]
			};

		var init = function() {
			vm.dataCascade = [[], []];
			if(!vm.selected) {
				vm.selected = [{}, {}];
			}

			DataService.getData(options.url)
				.then(function(data) {
					if(data.obj) {
						data = data.obj;
					}
					vm.dataAll = data;
					vm.dataCascade[0] = data;

					if(!angular.equals(vm.selected[0], [])) {
						vm.dataCascade[1] = vm.selected[0].children;

						options.tabs = [false, true];
					}

				}, function(msg) {
					console.error('msg-->', msg);
				})
		};

		// data init
		// init();

		$scope.select = function(e, selectedLevel, item) {
			e.preventDefault();

			switch(selectedLevel) {
				case '1':
					vm.selected[0] = item;
					vm.dataCascade[1] = item.children;

					break;
				case '2':
					vm.selected[1] = item;

					$scope.confirm(e);

					break;
			}

		};

		// 确定返回
		$scope.confirm = function(e) {
			e.preventDefault();

			$conowModalInstance.close(vm.selected);
		};

	}
]);