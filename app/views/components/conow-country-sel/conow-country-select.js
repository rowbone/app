'use strict';

// countries data service
app.service('countriesService', ['$q', 'DataService', 
	function ($q, DataService) {
		// 
		var deferred = $q.defer();
		var url = 'views/components/conow-country-sel/data/IC_COUNTRY.json'
		var dataAll = [];
		var self = this;
		var options = {
			isLoading: true
		};

		var init = function() {

		}

		// 获取所有国家的数据
		this.getAllCountries = function() {

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

		this.getSelected = function(keyCode, dataAll, codeName) {
			return getSelectedFromData(keyCode, dataAll, codeName);
		}

		// other methods

	}
]);

// conow country select directive
app.directive('conowCountrySelect', ['DataService', 'conowModals', 'countriesService', 
	function(DataService, conowModals, countriesService) {

		return {
			restrict: 'AE',
			scope: {
				titles: '=',
				url: '=',
				selectedVal: '=',
				ngModel: '='
			},
			require: '?ngmodel',
			replace: true,
			template: '<input type="text" ng-click="countrySelClick($event)">',
			link: function($scope, elem, attrs, ctrl) {
				var selectedObj = null;
		
				var promise = countriesService.getAllCountries();
				promise.then(function(data) {
					selectedObj = countriesService.getSelected($scope.ngModel, data, 'OPTION_VALUE');

					elem.val(selectedObj.OPTION_NAME);
				}, function(msg) {
					console.log('msg-->', msg);
				})

				var vm = $scope.vm = {};

				$scope.countrySelClick = function(e) {
					e.preventDefault();

					var modalInstance = conowModals.open({
						templateUrl: 'views/components/conow-country-sel/tpls/country-sel-tpl.html',
						title: '选择',
						size: 'full',
						controller: 'countrySelCtrl',
						resolve: {
							modalParams: function() {
								return {
									titles: $scope.titles,
									url: $scope.url,
									selected: $scope.selectedVal
								}
							}
						}
					});
					modalInstance.result.then(function(data) {
						var selectedVal = null;
console.log('data-->', data);
						for(var i=data.length - 1; i >= 0; i--) {
							if(!angular.equals(data[i], [])) {
								selectedVal = data[i];
								break;
							}
						}

						// $scope.selected = selectedVal.OPTION_NAME;
						elem.val(selectedVal.OPTION_NAME);
						ctrl.$setViewValue(selectedVal.OPTION_VALUE);

					}, function(msg) {
						console.log('dismiss msg-->', msg);
					});

					e.stopPropagation();
				}
			}
		};
	}
]);

// country select controller
app.controller('countrySelCtrl', ['$scope', '$conowModalInstance', 'DataService', 'modalParams', 
	function($scope, $conowModalInstance, DataService, modalParams) {
		// 
		var vm = $scope.vm = {},
				options = $scope.options = {
					titles: modalParams.titles,
					url: modalParams.url,
					selected: modalParams.selected
				};

		var init = function() {
			vm.dataCascade = [[], []];
			vm.selected = [{}, {}];

			DataService.getData(options.url)
				.then(function(data) {
					if(data.obj) {
						data = data.obj;
					}
					vm.dataAll = data;
					vm.dataCascade[0] = data;

				}, function(msg) {
					console.error('msg-->', msg);
				})
		};

		// data init
		init();

		$scope.select = function(e, selectedLevel, item) {
			e.preventDefault();

			switch(selectedLevel) {
				case '1':
					vm.selected[0] = item;
					vm.dataCascade[1] = item.children;

					break;
				case '2':
					vm.selected[1] = item;

					$scope.confirm();

					break;
			}

		};

		// 确定返回
		$scope.confirm = function() {
			$conowModalInstance.close(vm.selected);
		};

	}
]);