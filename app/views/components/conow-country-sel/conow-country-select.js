'use strict';

app.directive('conowCountrySelect', ['DataService', 'conowModals', 
	function(DataService, conowModals) {

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
				console.log('in link');
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

		var getSelected = function(keyCode, dataAll, codeName) {
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
						return getSelected(keyCode, dataAll[i].children, codeName);
					} else {
						continue;						
					}
				}
			}
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

					var code = '103';
					console.log('111111111111111111111');
					console.log(getSelected(code, vm.dataAll, 'OPTION_VALUE'));
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

					break;
			}

		};

		// 确定返回
		$scope.confirm = function() {
			$conowModalInstance.close(vm.selected);
		};

	}
]);