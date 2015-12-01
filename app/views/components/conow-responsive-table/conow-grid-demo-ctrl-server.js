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

app.controller('conowGridDemoCtrl2', ['$scope', 'conowModals', 
	function($scope, conowModals) {
		var vm = $scope.vm = {},
			options = $scope.options = {};
		
		$scope.operGetSelected = function() {
			console.log('已选项：', $scope.gridOptions.conowGridInstance.getSelectedItems());
		}
		
		$scope.filterOptions = {
	            contentUrl: 'other/demo/conow-responsive-table/conow-grid-filter-demo.html',
	            adSearch: null,
	            criteriaData: {
	            	'DATA_ENABLE': [
	            	  {
	            		  'label': '启用',
	            		  'value': 'ACT'
	            	  }, {
	            		  'label': '封存/停用',
	            		  'value': 'NA'
	            	  }
	            	],
			        'expenseStatus': [ {
			            label: '审批中',
			            value: 'INAPPROVAL'
			        }, {
			            label: '已报销',
			            value: 'APPROVED'
			        }, {
			            label: '四个字儿',
			            value: 'APPROVED1'
			        }, {
			            label: '五五个字儿',
			            value: 'APPROVED2'
			        }, {
			            label: '六六六个字儿',
			            value: 'APPROVED3'
			        }, {
			            label: '超过六个字儿好多好多',
			            value: 'APPROVED4'
			        } 
			    ],
	            },
	            defaultParams: {
	               
	            }
			};

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
				
				$scope.gridOptions.conowGridInstance.reload();
			}, function(msg) {
				console.log(msg);
			});
		};

		$scope.gridOptions = {//queryJobsListByParams
			url: '/service/jobsOrg!queryJobsOrgAndStaffCountByOrgId?ORG_UNIT_ID=1421924106089631410343354',
			isPagination: false,
//			isServerPage: false,
			// select: 'single',
			columnDefs: [
			    { name: '序号', cellType: 'sequence' }, 
				{ name: '岗位名称', field: 'JOBS_INFO_ID_HR_JOBS_INFO' }, 
				{ name: '在岗人数', field: 'STAFFCOUNT', width: 150, type: 'number' }, 
				{ name: '计划人数', field: 'PLAN_COUNT', width: 150, type: 'number' }, 
				{ name: '操作', field: '', enableSorting: false, cellType: 'operation', 
					cellTemplate: '<div>' + 
						'<a class="" ng-click="grid.appScope.view(row)"><i class="ci-seen"></i></a>' + 
						'<a class="" ng-click="grid.appScope.setting(row)"><i class="ci-set"></i></a>' + 
						'<a class="" ng-click="grid.appScope.del(row)"><i class="ci-delete"></i></a></div>' }
			],
			quickSearchKey: 'JOBS_INFO_ID_HR_JOBS_INFO',
			filterOptions: $scope.filterOptions,
			view: $scope.view
		}
	}
]);

/**
 * conow-grid-demo controller
 * */
app.controller('conowGridDemoCtrl', ['$scope', 'DataService', 'conowModals', 
	function($scope, DataService, conowModals) {

		var vm = $scope.vm = {};
		var options = $scope.options = {
			isShowAdvancedFilter: false
		};
		
		$scope.filterOptions = {
            contentUrl: 'other/demo/conow-responsive-table/conow-grid-filter-demo.html',
            adSearch: null,
            criteriaData: {
            	'DATA_ENABLE': [
            	  {
            		  'label': '启用',
            		  'value': 'ACT'
            	  }, {
            		  'label': '封存/停用',
            		  'value': 'NA'
            	  }
            	]/*,
		        'expenseStatus': [ {
		            label: '审批中',
		            value: 'INAPPROVAL'
		        }, {
		            label: '已报销',
		            value: 'APPROVED'
		        }, {
		            label: '四个字儿',
		            value: 'APPROVED1'
		        }, {
		            label: '五五个字儿',
		            value: 'APPROVED2'
		        }, {
		            label: '六六六个字儿',
		            value: 'APPROVED3'
		        }, {
		            label: '超过六个字儿好多好多',
		            value: 'APPROVED4'
		        } 
		    ],*/
            }
		};
		
		$scope.filterOptions.defaultParams = {
				'DATA_ENABLE':[{
            		  'label': '启用',
            		  'value': 'ACT'
            	  }]
		};
		
		$scope.operGetSelected = function() {
			console.log('已选项：', $scope.gridOptions1.conowGridInstance.getSelectedItems());
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
				
				$scope.gridOptions1.conowGridInstance.reload();
			}, function(msg) {
				console.log(msg);
			});
		};
		
		$scope.setting = function(row) {
			alert('in setting-->' + JSON.stringify(row.entity));
		};
		
		$scope.del = function(row) {
			alert('in del-->', JSON.stringify(row.entity));
		};

		$scope.operAdd = function() {
			console.log('addddddddddddddddddd');
			$scope.gridOptions1.conowGridInstance.reload();
		};

		$scope.operImport = function() {
			console.log('Import');
		};

		$scope.operExport = function() {
			console.log('export');
		};
		
		$scope.gridOptions1 = {
			select: 'single',	// single/multiply/undefined
//			select: 'single',	// single/multiply/undefined///queryJobsListByOrgUintId?ORG_UNIT_ID=1421924106089631410343354
			url: '/service/jobsInfo!queryJobsListByParams',
			quickSearchKey: 'JOBS_NAME',
			quickSearchTip: '请输入岗位名称',
			filterOptions: $scope.filterOptions,
			columnDefs: [
			    { name: '序号', cellType: 'sequence' }, 
				{ name: '排序号', field: '', width: 100, type: 'number', cellTemplate: '<div>' + 
				'{{grid.appScope.seqNo(row)}}</div>', enableSorting: false},
				{ name: '编码', field: 'JOBS_CODE', width: 100 }, 
				{ name: '名称', field: 'JOBS_NAME', width: 160 }, 
				{ name: '类型', field: 'JOBS_TYPE_HR_JOBS_TYPE', width: 200, enableSorting: false}, 
				/*{ name: 'id', field: 'ID', width: 280, enableSorting: true, cellClass: 'hidden-sm', headerCellClass: 'hidden-sm' }, */
				{ name: '在岗人数', field: '', width: 100, type: 'number', cellTemplate: '<div>' + 
					'{{grid.appScope.staffCount(row)}}</div>', enableSorting: false},
				{ name: '岗位职责', field: 'JOBS_DESC', width: 300, cellTooltip: function(row, col) {
					return row.entity.JOBS_DESC;
				} }, 
				{ name: '岗位描述', field: 'MEMO', width: 300 }, 
				/*{ name: '是否启用1', field: 'DATA_ENABLE', width: 150, cellFilter: 'filterInCell' }, */
				{ name: '岗位状态', field: 'DATA_ENABLE_SYSTEM_DATA_ENABLE', width: 150 }, 
				{ name: '操作', field: '', width: 90, enableSorting: false, enableSorting: false, cellType: 'operation', 
					cellTemplate: '<div>' + 
						'<a ng-disabled="true" ng-class="grid.appScope.getClass(row)" ng-click="grid.appScope.view(row)"><i class="ci-seen"></i></a>' + 
						'<a class="" ng-click="grid.appScope.setting(row)"><i class="ci-set"></i></a>' + 
						'<a class="" ng-click="grid.appScope.del(row)"><i class="ci-delete"></i></a></div>' }
			],
			view: $scope.view,
			setting: $scope.setting,
			del: $scope.del,
			seqNo: function (row) {
				return row.entity.SEQ_NO;
			},
			staffCount: function(row) {
				return row.entity.staffCount;
			},
			getClass: function(row) {
				return 'disabled';
			}
		};

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
			    	 th: ['参数名称', '参数说明', '可选项', '默认值']
			     }
			},
			tbody: {
				tr: [
				    {td: ['url', '后台数据接口', '-', '-']},
		      		{td: ['columnDefs', '列定义', '-', '-']},
		      		{td: ['quickSearchKey', '搜索框请求参数', '自定义', 'keyword']},
		      		{td: ['quickSearchTip', '搜索框提示文字', '自定义', '请输入关键字']},
		      		{td: ['isPagination', '是否包含分页', 'true/false/-', 'true']},
		      		{td: ['filterOptions', '筛选配置项', '-', '-']},
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