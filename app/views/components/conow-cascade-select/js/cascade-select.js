'use strict';

// 级联选择服务：持有已选择的级联项。用于选中待选项
app.service('cascadeSelectService', ['$q', 'DataService', 
	function($q, DataService) {
		// 
		var selected = [];

		var deferred = $q.defer();

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

		// 获取所有数据
		this.getDataAll = function(url) {
			if(!url) {
				console.error('Please provide the url param...');
				return;
			}

			DataService.getData(url)
				.then(function(data) {
					console.log(data);

					deferred.resolve(data);
				}, function(msg) {
					deferred.reject('Get url data wrong-->', msg);
				});

			return deferred.promise;
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
				sel: '=',
				selectLevel: '@'
			},
			link: function(scope, elem, attrs, ctrl) {

				var interval = $interval(function() {
					if(!angular.equals(ctrl.$modelValue, NaN)) {
						$interval.cancel(interval);

						elem.val(cascadeSelectService.getOptionName(ctrl.$modelValue));
					}
				}, 100);

				// click  to open select modal
				elem.bind('click.cascadeSelect', function(e) {
					e.preventDefault();
					
					elem.attr('disabled', true);
					
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
									url: scope.url,
									selectLevel: scope.selectLevel
								}
							}
						}
					});

					modalInstance.result.then(function(data) {
						// 返回值是一个对象数组，获取最后一个不是{}的对象（对于仅能显示），作为最终选中的值
						var iLen = data.length,
								value = {};				// to hold selected value which is not {}
						for(var i=iLen - 1; i>=0; i--) {
							console.log(angular.equals(data[i], {}));
							if(!angular.equals(data[i], {})) {
								value = data[i];
								break;
							}
						}

						elem.val(value.OPTION_NAME);
						ctrl.$setViewValue(value.OPTION_VALUE);

						// elem.val(value.name);
						// ctrl.$setViewValue(value.id);
						
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

// cascade select modal controller
app.controller('cascadeSelectCtrl', ['$scope', 'DataService', '$conowModalInstance', 'modalParams', 'cascadeSelectService', 
	function($scope, DataService, $conowModalInstance, modalParams, cascadeSelectService) {
		// $scope.titles = modalParams.titles;
		$scope.selected = cascadeSelectService.getSelected();

		var options = $scope.options = {
			titles: modalParams.titles,
			tabsLen: modalParams.titles.length,
			tabs: [],
			selectLevel: parseInt(modalParams.selectLevel)
		};

		var vm = $scope.vm = {
			dataCascade: [],
			selected: []
		};
		
		var init = function() {
			// data init
			for(var i=0; i<options.tabsLen; i++) {
				if(0 === i) {
					options.tabs[i] = true;
				}
				options.tabs[i] = false;
				
				vm.dataCascade.push([]);
				vm.selected.push({});
			}

			// todo: support json datasource
			var url = modalParams.url;
			// url = 'views/components/conow-cascade-select/data/service-common-queryOptions-type-DICT_OPTION_LEVEL&DICT_CODE-HR_RETIRED_ARMY_RANK2.json';
			DataService.getData(url)
				.then(function(data) {
					if(data.obj) {
						data = data.obj;
					}
					vm.dataAll = data;
					vm.dataCascade[0] = data;

					// $scope.dataLevel1 = data;
					// var iLen = data.length;
					// for(var i=0; i<iLen; i++) {
					// 	if(data[i].OPTION_VALUE === $scope.selected[0].OPTION_VALUE) {
					// 		$scope.dataLevel2 = data[i].children;
					// 		var dataLevel2 = $scope.dataLevel2;
					// 		iLen = dataLevel2.length;
					// 		for(var i = 0; i<iLen; i++) {
					// 			if (dataLevel2[i].OPTION_VALUE === $scope.selected[1].OPTION_VALUE) {
					// 				$scope.dataLevel3 = dataLevel2[i].children;

					// 				options.tabs = [false, false, true];
					// 			};
					// 		}
							
					// 	}
					// }

				}, function(msg) {
					console.error('msg-->', msg);
				});
		};

		init();

		// select operation
		$scope.select = function(e, item, parentIndex, index) {
			e.preventDefault();
console.log('parentIndex-->', parentIndex);
console.log('index-->', index);

			vm.selected[index] = item;
			vm.dataCascade[index + 1] = item.children;
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

		// 页签标题点击，更新当前操作的 contentIndex
		$scope.tabTitleClick = function(index) {

			options.contentIndex = index;
		};

		// 确定返回
		$scope.confirm = function() {
			// cascadeSelectService.setSelected($scope.selected);

			$conowModalInstance.close(vm.selected);
		};

	}
]);