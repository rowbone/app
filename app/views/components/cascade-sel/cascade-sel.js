'use strict';

app.service('cascadeSelService', ['$http', 
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

app.directive('cascadeSel', ['DataService', 'conowModals', 'cascadeSelService', '$interval', 
	function(DataService, conowModals, cascadeSelService, $interval) {
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

						elem.val(cascadeSelService.getOptionName(ctrl.$modelValue));
					}
				}, 100);

				elem.bind('click', function(e) {
					
					if(angular.equals(cascadeSelService.getSelected(), [])) {
						cascadeSelService.setSelected(scope.sel);
					}

					var modalInstance = conowModals.open({
						templateUrl: 'views/components/cascade-sel/tpls/cascade-sel.html',
						title: '选择',
						size: 'full',
						controller: 'cascadeSelCtrl',
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

app.controller('cascadeSelDemoCtrl', ['$scope', 'DataService', 'cascadeSelService', 
	function($scope, DataService, cascadeSelService) {
		$scope.titles = ['级别1', '级别2', '级别3'];

		var entity = $scope.entity = {
			sel: '6102'
		};

		var urlSelected = 'views/components/cascade-sel/data/selected.json';
		DataService.getData(urlSelected)
			.then(function(data) {
				$scope.sel = data;
			}, function(msg) {
				console.error('msg-->', msg);
			});
	}
]);

app.controller('cascadeSelCtrl', ['$scope', 'DataService', '$conowModalInstance', 'modalParams', 'cascadeSelService', 
	function($scope, DataService, $conowModalInstance, modalParams, cascadeSelService) {
		$scope.titles = modalParams.titles;
		$scope.selected = cascadeSelService.getSelected();

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
			cascadeSelService.setSelected($scope.selected);
			$conowModalInstance.close($scope.selected);
		};

	}
]);