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

		this.getAllSelected = function(optionCode, optionsType, selectedLevel) {
			var url = 'views/components/conow-cascade-select/data/selected.json';

			DataService.getData(url, optionsType)
				.then(function(data) {
					console.log(data);
					deferred.resolve(data);
				}, function(msg) {
					deferred.reject(msg);
				});
			

			// if(selectedLevel) {
			// 	return arr.slice(0, selectedLevel);
			// }

			return deferred.promise;
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

		var getSelected = function(keyCode, dataAll, codeName) {
			var iLen = dataAll.length;
			for(var i=0; i<iLen; i++) {
				if(dataAll[i][codeName] == keyCode) {
					return dataAll[i];
				}
			}

			return null;
		}

		var getAllSelected = function(keyCode, dataAll, codeName, selected) {
			var iLen = dataAll.length;
			var tmp = null;

			tmp = getSelected(keyCode, dataAll, codeName);

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

		/**
		 * @param  keyCode:已选择项的code
		 * @param  dataAll:待查找项数据对象数组
		 * @param  codeName:比对的字段名称
		 * @param  [selected]:暂时没用
		 * @return 如果查找到对应项则返回，否则返回 null
		 */
		this.getOneSelected = function(keyCode, dataAll, codeName, selected) {
			var iLen = dataAll.length;
			for(var i=0; i<iLen; i++) {
				if(dataAll[i][codeName] == keyCode) {
					return dataAll[i];
				}
			}

			return null;
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
				// url: '/service/common!queryOptions?type=DICT_LEVEL&DICT_CODE=HR_RETIRED_ARMY_RANK'
				var index = -1;
				var optionsType = '';
				if((index = scope.url.indexOf('DICT_CODE=')) > -1) {
					optionsType = scope.url.substring(index);
					console.log('optionsType-->', optionsType)
				}

				var interval = $interval(function() {
					if(!angular.equals(ctrl.$modelValue, NaN)) {
						$interval.cancel(interval);

						var getSelectedPromise = cascadeSelectService.getAllSelected(ctrl.$modelValue, optionsType, scope.selectLevel);
						getSelectedPromise.then(function(data) {
							scope.allSelected = data;

							elem.val(scope.allSelected[scope.allSelected.length - 1]['OPTION_NAME']);
						}, function(msg) {
							console.log('msg-->', msg);
						});
					}
				}, 100);

				// click  to open select modal
				elem.bind('click.cascadeSelect', function(e) {
					e.preventDefault();
					
					elem.attr('disabled', true);

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
									selectLevel: scope.selectLevel,
									allSelected: scope.allSelected
								}
							}
						}
					});

					modalInstance.result.then(function(data) {
						scope.allSelected = data;

						// 返回值是一个对象数组，获取最后一个不是{}的对象（对于仅能显示），作为最终选中的值
						var iLen = data.length,
								value = {};				// to hold selected value which is not {}
						for(var i=iLen - 1; i>=0; i--) {
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

		var options = $scope.options = {
			titles: modalParams.titles,
			tabsLen: modalParams.titles.length,
			tabs: [],
			selectLevel: parseInt(modalParams.selectLevel)
		};

		var vm = $scope.vm = {
			dataCascade: [],
			selected: modalParams.allSelected
		};
		
		var init = function() {
			// data init
			for(var i=0; i<options.selectLevel; i++) {
				if(0 === i) {
					options.tabs[i] = true;
				}
				options.tabs[i] = false;
				
				vm.dataCascade.push([]);
				// vm.selected.push({});
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

					if(vm.selected.length > 0) {
						for(var i=0; i<vm.selected.length - 1; i++) {
							var objTmp = vm.selected[i];
							if(!angular.equals(objTmp, {})) {
								vm.dataCascade[i + 1] = cascadeSelectService.getOneSelected(objTmp['OPTION_VALUE'], vm.dataCascade[i], 'OPTION_VALUE').children;
							}
						}
					}

					// 		
					for(var i=0; i<options.selectLevel; i++) {
						// if(vm.selected)
						if(i == options.selectLevel - 1) {
							options.tabs[i] = true;
						} else {
							options.tabs[i] = false;
						}
					}

				}, function(msg) {
					console.error('msg-->', msg);
				});
		};

		init();

		// select operation
		$scope.select = function(e, item, paramIndex) {
			e.preventDefault();

			if(paramIndex > 0) {
				vm.selected = vm.selected.substring(0, paramIndex);
			}

			vm.selected[paramIndex] = item;

			// for(var i=0; i<options.selectLevel; i++) {
			// 	if(i > paramIndex) {
			// 		vm.selected[i] = {};
			// 	}
			// }

			// 当前选择的层级是可选择的最大层级时，直接返回
			if(paramIndex + 1 == options.selectLevel) {
				$scope.confirm(e);
			} else {			// 初始化下一层级数据
				vm.dataCascade[paramIndex + 1] = item.children;
				// 清空隔一级的数据待选项[直接下一级的数据还没有选择]
				if(paramIndex + 2 <= options.selectLevel) {
					vm.dataCascade[paramIndex + 2] = [];
				}
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

		$scope.isInSelected = function(item, parentIndex) {
			if(item['OPTION_VALUE'] == vm.selected[parentIndex]['OPTION_VALUE']) {
				return true;
			}

			return false;
		}

		// 确定返回
		$scope.confirm = function(e) {
			// cascadeSelectService.setSelected($scope.selected);
			e.preventDefault();

console.log('selected-->', vm.selected);
			$conowModalInstance.close(vm.selected);
		};

	}
]);