'use strict';

// 级联选择服务：持有已选择的级联项。用于选中待选项
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
			var optionName = '二级警督(技术)';

			return optionName;
		};

	}
]);

// 级联选择指令实现
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
					e.preventDefault();
					
					elem.attr('disabled', true);
					
					if(angular.equals(cascadeSelectService.getSelected(), [])) {
						cascadeSelectService.setSelected(scope.sel);
					}
console.log('before open');
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

					modalInstance.result.then(function(data) {console.log('result-->', data);
						var value = data[data.length - 1];
						elem.val(value.OPTION_NAME);
						ctrl.$setViewValue(value.OPTION_VALUE);
						
						elem.attr('disabled', false);
					}, function(msg) {
						console.log('dismiss msg-->', msg);
						
						elem.attr('disabled', false);
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
console.log('in cascadeSelectCtrl')
		var options = $scope.options = {
			tabs: [true, false, false]
		};
		
		var init = function() {
			var url = modalParams.url;
			url = 'views/components/conow-cascade-select/data/service-common-queryOptions-type-DICT_OPTION_LEVEL&DICT_CODE-HR_RETIRED_ARMY_RANK2.json';
			DataService.getData(url)
				.then(function(data) {
					if(data.obj) {
						data = data.obj;
					}
					$scope.dataLevel1 = data;console.log('dataLevel1-->', $scope.dataLevel1);
					var iLen = data.length;
					for(var i=0; i<iLen; i++) {
						if(data[i].OPTION_VALUE === $scope.selected[0].OPTION_VALUE) {
							$scope.dataLevel2 = data[i].children;
							var dataLevel2 = $scope.dataLevel2;
							iLen = dataLevel2.length;
							for(var i = 0; i<iLen; i++) {
								if (dataLevel2[i].OPTION_VALUE === $scope.selected[1].OPTION_VALUE) {
									$scope.dataLevel3 = dataLevel2[i].children;

									options.tabs = [false, false, true];
								};
							}
							
						}
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
				if(item.OPTION_Value === items[i].OPTION_Value) {
					return i;
				}
			}

			return -1;
		};

		// 确定返回
		$scope.confirm = function() {
			cascadeSelectService.setSelected($scope.selected);
			$conowModalInstance.close($scope.selected);
		};

	}
]);