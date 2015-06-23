'use strict';

app.service('cascadeSelectService', ['$http', 
	function($http) {
		// 
		var selected = [];

		this.setSelected = function(sel) {
			selected = sel;
		};

		this.getSelected = function() {
			return selected;
		};

		this.getOptionName = function(optionCode) {
			var optionName = '军委副主席职';

			return optionName;
		};

	}
]);

app.directive('conowCascadeSelect', ['DataService', 'conowModals', 'cascadeSelectService', '$interval', 
	function(DataService, conowModals, cascadeSelectService, $interval) {
		return {
			restrict: 'A',
			// templateUrl: 'views/components/cascade-sel/tpls/cascade-sel.html',
			require: '?ngModel',
			transclude: true,
			scope: {
				titles: '=',
				url: '=',
				sel: '='
			},
			link: function(scope, elem, attrs, ctrl) {

				var interval = $interval(function() {
					if(!angular.equals(ctrl.$modelValue, NaN)) {
						$interval.cancel(interval);

						elem.val(cascadeSelectService.getOptionName(ctrl.$modelValue));
					}
				}, 100);

				elem.bind('click', function(e) {
					
					if(angular.equals(cascadeSelectService.getSelected(), [])) {
						cascadeSelectService.setSelected(scope.sel);
					}

					var modalInstance = conowModals.open({
						templateUrl: 'views/components/conow-cascade-select/tpls/cascade-select.html',
						title: '选择',
						size: 'full',
						controller: 'cascadeSelectCtrl',
						resolve: {
							modalParams: function() {
								return {
									titles: scope.titles,
									url: scope.url
								}
							}
						}
					});

					modalInstance.result.then(function(data) {
						var value = data[data.length - 1];
						elem.val(value.name);
						ctrl.$setViewValue(value.code);
					});

					e.stopPropagation();
				});

			}
		}
	}
]);

app.controller('cascadeSelectCtrl', ['$scope', 'DataService', '$conowModalInstance', 'modalParams', 'cascadeSelectService', 
	function($scope, DataService, $conowModalInstance, modalParams, cascadeSelectService) {
		$scope.titles = modalParams.titles;
		$scope.selected = cascadeSelectService.getSelected();

		var options = $scope.options = {
			tabs: [true, false, false]
		};

		var init = function() {
			var url = modalParams.url;
			DataService.getData(url)
				.then(function(data) {
					$scope.dataLevel1 = data;
					var iLen = data.length;
					for(var i=0; i<iLen; i++) {
						if(data[i]['code'] === $scope.selected[0]['code']) {
							$scope.dataLevel2 = data[i].children;
						}
					}
					var dataLevel2 = $scope.dataLevel2;
					iLen = dataLevel2.length;
					for(var i = 0; i<iLen; i++) {
						if (dataLevel2[i].code === $scope.selected[1].code) {
							$scope.dataLevel3 = dataLevel2[i].children;

							options.tabs = [false, false, true];
						};
					}

				}, function(msg) {
					console.error('msg-->', msg);
				});
		};

		init();

		$scope.select = function(e, selectedLevel, item) {
			e.preventDefault();

			switch(selectedLevel) {
				case '1':
					$scope.selected = [item];
					$scope.dataLevel2 = item.children;
					$scope.dataLevel3 = null;

					options.tabs = [false, true, false];
					break;
				case '2':
					$scope.selected = [$scope.selected[0], item];
					$scope.dataLevel3 = item.children;

					options.tabs = [false, false, true];
					break;
				case '3':
					$scope.selected = [$scope.selected[0], $scope.selected[1], item];

					$scope.confirm();
			}

		};

		$scope.indexInArr = function(item, items) {
			var iLen = items.length;
			for(var i=0; i<iLen; i++) {
				// if(angular.equals(item, items[i])) {
				if(item.code === items[i].code) {
					return i;
				}
			}

			return -1;
		};

		$scope.confirm = function() {
			cascadeSelectService.setSelected($scope.selected);
			$conowModalInstance.close($scope.selected);
		};

	}
]);