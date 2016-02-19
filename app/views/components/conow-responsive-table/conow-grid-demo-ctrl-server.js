(function(app) {
	'use strict';

	app.filter('filterInCell', [
	    function() {
	    	var filterFn = function(input) {
	    		if(angular.equals(input, 'ACT')) {
	        		return '启用';
	        	} else {
	        		return '停用';
	        	}
	    	}
	    	
	    	return filterFn;
	    }
	]);

	/**
	 * conow-grid-demo controller
	 * */
	app.controller('conowGridDemoCtrl', ['$scope', 'DataService', 'conowModals', 'OperationService', '$state', '$rootScope', 'uiGridConstants', 
		function($scope, DataService, conowModals, OperationService, $state, $rootScope, uiGridConstants) {

			var vm = $scope.vm = {},
				options = $scope.options = {
					isShowAdvancedFilter: false
				};

			init();
			
			$scope.clickFn = function() {
				console.log('clicked');
//				$rootScope.$broadcast('tabClick.conowGrid');
			}

			$scope.getData = function() {
				getData();
			};
			
			$scope.combination = function(grid, row, col) {
				return '字典类名称:' + row.entity['DICT_NAME'] + ',code:' + row.entity['DICT_CODE'];
			}
			
			function init() {
				getData();

				$scope.filterOptions = {
		            contentUrl: 'other/demo/conow-responsive-table/conow-grid-filter-demo.html',
		            adSearch: null,
		            criteriaData: {
		            	
		            },
		            defaultParams: {
		               'DICT_CODE': 'HR_STAFF'
		            }
				};
				
				$scope.otherData = [
				    {
				    	'name': 'abc',
				    	'age': 7
				    }, {
				    	'name': 'xyz',
				    	'age': 77
				    }
				];
				
				$scope.getData2 = function(row, e) {
					console.log(row);
					console.log(e);
					console.log($scope.otherData);
				}
				
				$scope.check = function(row, evt) {
					evt.preventDefault();
					
					OperationService.alertAction('确认通过？');
					
					evt.stopPropagation();
				};
				
				$scope.disable = function(row, evt) {
					evt.preventDefault();
					
					OperationService.alertAction('确认禁用？');
					
					evt.stopPropagation();					
				}
				
				$scope.download = function(row, evt) {
					evt.preventDefault();
					
					OperationService.alertAction('正在跳转到下载页...');
					
					evt.stopPropagation();					
				}
				
				$scope.deleteRow = function(row, evt) {
					evt.preventDefault();
					
					OperationService.alertAction('确认删除？');
					
					evt.stopPropagation();					
				}
				
				$scope.footerTplFn = function(grid, row, col) {
					console.log(grid);
					return '123';
				}
				
				$scope.rowFormatter = function(row) {
					return row.entity.isBold;
				}
			
				$scope.gridOptions1 = {
					// url: '/service/dict!queryDictListByType',
					// urlParams: { 'TYPE': 'DICT_OPTION'}, 
					json: vm.dictList,
//					url: 'other/demo/conow-responsive-table/data/queryDictListByType.json',
					isPagination: true,
					isServerPage: false,
//					enableSorting: false,
					selectMode: 'multiple',
					rowClassFn: function(row) {
//						return row.entity.className;
						if(row.entity['DICT_NAME'].indexOf('类型') > -1) {
							return 'font-bold text-danger';
						} else {
							return '';
						}
					},
					columnDefs: [
					    { name: '序号', cellType: 'sequence' },
						{ name: '字典类名称', field: 'DICT_NAME', minWidth: '100', cellTooltip: function(row, col) {
								return row.entity.name;
							}, aggregationType: uiGridConstants.aggregationTypes.sum
					    }, 
						{ name: '字典类编码', field: 'DICT_CODE', width: '200', cellTooltip: function(row, col) {
								return row.entity.workKey;
							} 
					    }, 
//						{ name: '字典类说明', field: '', cellClass: 'hidden-sm', headerCellClass: 'hidden-sm', width: 300, enableSorting: false, cellTemplate: '<div>{{grid.appScope.combination(grid, row, col)}}</div>' }, 
						{ name: '字典类规则', field: 'DICT_TYPE', width: '100', enableSorting: false }, 
						{ name: '操作', field: '', enableSorting: false, cellType: 'operation', 
							cellTemplate: '<div>' +  
								'<a class="conow-grid-operator" ng-click="grid.appScope.showFlowChart(row, $event)" title= "查看"><i class="ci-seen"></i></a>' + 
								'<a class="conow-grid-operator" ng-click="grid.appScope.edit(row, $event)" title="编辑"><i class="ci-edit"></i></a>' + 
								'<a class="conow-grid-operator" ng-click="grid.appScope.check(row, $event)" title="通过"><i class="ci-check"></i></a>' + 
								'<a class="conow-grid-operator" ng-click="grid.appScope.disable(row, $event)" title="禁用"><i class="ci-disable"></i></a>' + 
								'<a class="conow-grid-operator" ng-click="grid.appScope.download(row, $event)" title="下载"><i class="ci-download"></i></a>' + 
								'<a class="conow-grid-operator" ng-click="grid.appScope.deleteRow(row, $event)" title="删除"><i class="ci-delete"></i></a>' + 
								'</div>' }
					],
					quickSearchKey: 'DICT_NAME',
					quickSearchTip: '请输入字典类名称',
					// 这里也可以不用传入操作绑定的方法
	//				showFlowChart: $scope.showFlowChart,
	//				go: $scope.go,
					filterOptions: $scope.filterOptions,
					isRowSelectable: function(row) {
						if(row.entity['DICT_NAME'].indexOf('状态') > -1) {
							return true;
						} else {
							return false;
						}
					},
					rowSelectFn: function(row) {
						var modalInstance = conowModals.open({
							templateUrl: 'other/demo/conow-responsive-table/conow-grid-modal.html',
							controller: 'conowGridModalCtrl',
							title: 'conowGrid弹窗演示',
							size: 'lg',
							isFull: true,
							adaptive: true,
							isModalBox: true,
							resolve: {
								modalParams: function() {
									return {
										data: row
									}
								},
								deps: ['uiLoad', function(uiLoad) {
									return uiLoad.load(['other/demo/conow-responsive-table/conow-grid-modal-ctrl.js']);
								}]
							}
						});
					}
				}
			}
			
			$scope.view = function(row) {			
				var modalInstance = conowModals.open({
					templateUrl: 'other/demo/conow-responsive-table/conow-grid-modal.html',
					controller: 'conowGridModalCtrl',
					title: 'conowGrid弹窗演示',
					size: 'lg',
					isFull: true,
					adaptive: true,
					isModalBox: true,
					resolve: {
						modalParams: function() {
							return {
								options: $scope.gridOptions1
							}
						},
						deps: ['uiLoad', function(uiLoad) {
							return uiLoad.load(['other/demo/conow-responsive-table/conow-grid-modal-ctrl.js']);
						}]
					}
				});
				
				modalInstance.result.then(function(data) {
					console.log(data);
					
					$scope.gridOptions1.selectedItems = data;
					
					$scope.gridOptions1.conowGridInstance.reload();
				}, function(msg) {
					console.log(msg);
				});
			};
			
			$scope.setting = function(row) {
				alert('in setting-->' + JSON.stringify(row.entity));
			};

			$scope.operAdd = function() {
				vm.dictList.unshift(vm.dictList.slice(2, 1));
				$scope.gridOptions1.conowGridInstance.reload();
			};

			$scope.operImport = function() {
				console.log('Import');
			};

			$scope.operExport = function() {
				console.log('export');
			};
			
			// 重新加载
			$scope.gridReload = function() {
				$scope.gridOptions1.json = vm.dictList.slice(2, 10);
				$scope.gridOptions1.conowGridInstance.reload();
			}
			
			$scope.operGetSelected = function() {
				console.log('已选项：', $scope.gridOptions1.conowGridInstance.getSelectedItems());
			}
			
			// 查看流程图
	        $scope.showFlowChart = function (row, e){
	        	 e.stopPropagation();
	        	
	        	 var modalInstance = conowModals.open({
	                 templateUrl: 'other/demo/conow-responsive-table/conow-grid-modal.html',
	                 controller:'conowGridModalCtrl',
	                 title:"弹出层示例",
	                 size: 'full',
	                 isFull:'true',
					 adaptive:'true',
	                 resolve: {
	                     modalParams: function () {
	                         return {
	                         	options: $scope.gridOptions1
	                         };
	                     },
	                     deps: ['uiLoad', function (uiLoad) {
	                         return uiLoad.load(['other/demo/conow-responsive-table/conow-grid-modal-ctrl.js']);
	                     }]
	                 }
	             });
	             modalInstance.result.then(function (selectedItem) {
	                 //$scope.selected = selectedItem;
	             });
	        }
	        
	        // 页面跳转
	        $scope.go = function(row, e) {
	       	 	e.stopPropagation();
	       	 	
	        	$state.go('app.common.conowArea');
	        }
	        
	        $scope.edit = function(row, e) {
	        	e.stopPropagation();
	        	
	        	alert(JSON.stringify(row.entity));
	        }
	        
	        function getData() {
	        	DataService.getData('other/demo/conow-responsive-table/data/queryDictListByType.json')
	        		.then(function(data) {
	        			vm.dictList = data.obj;
	        			$scope.gridOptions1.json = data.obj;
	        		}, function(msg) {
	        			console.error(msg);
	        		});
	        }

		}
	]);

	/**
	 * 使用说明 controller
	 * */
	app.controller('conowGridDemoInsCtrl', ['$scope', 
	    function($scope){
			var vm = $scope.vm = {};
			
			vm.paramsList = {
				thead: {
				     tr: {
				    	 th: ['参数名称', '参数说明', '可选项', '默认值', '补充说明']
				     }
				},
				tbody: {
					tr: [
					    { td: ['url', '后台数据接口', '-', '-', '-'] },
					    { td: ['urlParams', '发送到后台接口的参数对象', '-', '-', '-'] },
					    { td: ['json', '待显示的 json 数据源', '-', '-', '与 url 互斥'] },
			      		{ td: ['isPagination', '是否包含分页', 'true/false/-', 'true', '-'] },
			      		{ td: ['isServerPage', '是否后台分页', 'true/false/-', 'true', '数据源为 json 时，此参数不生效'] },
			      		{ td: ['columnDefs', '列定义', '-', '-', '详细说明见下表'] },
			      		{ td: ['quickSearchKey', '搜索框请求参数', '自定义', '-', '快速搜索对应的字段，不提供此参数时，不显示搜索框'] },
			      		{ td: ['quickSearchTip', '搜索框提示文字', '自定义', '请输入关键字', '-'] },
			      		{ td: ['filterOptions', '筛选配置项', '-', '-', '不提供时，不显示高级搜索过滤条件'] },
			      		{ td: ['selectMode', '选择模式', 'single/multiply/-', '-', '-'] },
			      		{ td: ['selectedItems', '初始化时的选中值', '自定义(对象数组)', '-', '根据 ID 字段判断对应数据是否选中'] },
			      		{ td: ['isRowSelectable', '对应的行是否可选择', '', '-', '对应的方法可传入当前 row,row.entity 可获取到对应行的所有数据,方法返回 true 时为可选择，false为不可选择']},
			      		{ td: ['rowSelectFn', '点击行触发方法', '自定义', '-', '点击行响应方法，可以使用 行对应的数据参数'] },
			      		{ td: ['rowClassFn', '给对应行添加class', '自定义', '-', '此方法返回需要添加的class name'] },
					]
				}
				
				
			};
			
			vm.columnsDefs = {
				thead: {
				     tr: {
				    	 th: ['参数名称', '参数说明', '可选项', '默认值', '使用说明']
				     }
				},
				tbody: {
					 tr: [
					      {td: ['name', '表头显示名称', '-', '-', '-']},
			      		  {td: ['field', '对应返回数据的字段名', '-', '-', '-']},
			      		  {td: ['width', '列的的宽度', '数字/百分数', '-', '百分数时需要加引号']},
			      		  {td: ['enableSorting', '允许排序', 'true/false', 'true', '-']},
			      		  {td: ['cellTooltip', '列鼠标hover时候的效果', '-', '-', '一般用于文字超过给定长度的提示信息']},
			      		  {td: ['type', '数据类型', 'number', 'string', '可用于排序等。比如设置为number类型']},
			      		  {td: ['cellType', '列的类型', 'operation/sequence/-', '-', '一些固定的列类型定义']},
			      		  {td: ['cellTemplate', '该列的模板定义', '字符串参数', '-', '-']},
			      		  {td: ['cellFilter', '该列的数据过滤filter名称', '字符串参数', '-', '使用业务filter对数据进行处理']},
			      		  {td: ['cellClass', '列样式类', '自定义', '-', '-']},
			      		  {td: ['headerCellClass', '列标题样式类', '自定义', '-', '-']}
					 ]
				}
				
				
			};
			
			vm.cellTypes = {
				thead: {
					tr: {
						th: ['类型名称', '类型说明', '详细功能说明']
					}
				},
				tbody: {
					tr: [
					    { td: [ 'sequence', '提供行的排序号', '显示该行的序号，此序号为虚拟排序号，跟具体字段没关系，不需要配置 "field",后台不用返回对应的数据，并且生成的列不能排序' ]},
					    { td: [ 'operation', '提供操作按钮', '当为operation时，会添加统一样式，并且该列不能排序' ]} 
					]
				}
			};
		}
	]);
})(angular.module('app'));