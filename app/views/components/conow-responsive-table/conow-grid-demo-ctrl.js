'use strict';

app.controller('conowGridDemoCtrl', ['$scope', 'i18nService', '$filter', 'DataService', 'uiGridConstants', 
	function($scope, i18nService, $filter, DataService, uiGridConstants) {

		var vm = $scope.vm = {};

		// i18nService.setCurrentLang('zh-cn');

		$scope.myData = [
			{
				"firstName": "Cox",
				"lastName": "Carney",
				"company": "Enormo",
				"employed": true,
				"friends": ["friend0", "friend1", "friend2"],
				"address": {street:"301 Dove Ave", city:"Laurel", zip:"39565"},
				"getZip": function() { return this.address.zip; }
			}, {
				"firstName": "Lorraine",
				"lastName": "Wise",
				"company": "Comveyer",
				"employed": false,
				"friends": ["friend10", "friend11", "friend12"],
				"address": {street:"301 Dove Ave", city:"Guangzhou", zip:"12345"},
				"getZip": function() { return this.address.zip; }
			}, {
				"firstName": "Nancy",
				"lastName": "Waters",
				"company": "Fuelton",
				"employed": false,
				"friends": ["friend20", "friend21", "friend22"],
				"address": {street:"301 Dove Ave", city:"Beijing", zip:"abcde"},
				"getZip": function() { return this.address.zip; }
			}
		];

		$scope.gridOptions1 = {
			// singleFilter: false,	// true/false
			// pagination: false,	// true/false
			
			select: 'single',	// single/multiply/undefined
			url: 'views/components/conow-responsive-table/data/conow-grid-data.json',
			// url: 'views/components/conow-responsive-table/data/pagination1.json',
			showColumnFooter: true,
			selected: [
				{
					"firstName": "Cox11111111111111111111111111111",
					"lastName": "Carney",
					"company": "Enormo",
					"friends": ["friend0", "friend1", "friend2"]
				}, {
					"firstName": "Lorraine",
					"lastName": "Wise",
					"company": "Comveyer",
					"friends": ["friend10", "friend11", "friend12"]
				}
			],
			columnDefs: [
				{ name: 'firstName', field: 'firstName', width: 100}, 
				{ name: 'lastName', field: 'lastName', width: 300 }, 
				{ name: 'lastName2', field: 'lastName', width: 200 }, 
				{ name: 'Age', field: 'age', width: 50 }, 
				{ name: 'Min Age', field: 'age', width: 100, aggregationType: uiGridConstants.aggregationTypes.min }, 
				{ name: 'Max Age', field: 'age', width: 100, aggregationType: uiGridConstants.aggregationTypes.max }, 
				{ name: 'Sum Age', field: 'age', width: 100, aggregationType: uiGridConstants.aggregationTypes.sum }, 
				{ name: 'Average Age', field: 'age', width: 100, aggregationType: uiGridConstants.aggregationTypes.avg }, 
				{ name: 'company', field: 'company', width: 300 }, 
				{ name: 'firstFriend', field: 'friends[0]', width: 200 }, 
				{ name: 'secondFriend', field: 'friends[1]', width: 100 }, 
				{ name: 'thirdFriend', field: 'friends[2]', width: 100 }
			]
		};

		$scope.gridOptions2 = {
			singleFilter: true,	// true/false
			pagination: true,	// true/false
			select: 'single',	// single/multiply/undefined
			url: 'views/components/conow-responsive-table/data/pagination.json',
			columnDefs: [
			]
		};


	}
]);

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
		      		  {td: ['select', '单选/多选/没有checkbox选项', 'single/multiply/-', '-']},
		      		  {td: ['singleFilter', '是否显示搜索框', 'true/false/-', 'true']}
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
			      		  {td: ['width', '列的的宽度', '数字/百分数', '-', '-']},
			      		  {td: ['enableSorting', '允许排序', 'true/false', 'true', '-']},
			      		  {td: ['enableSorting', '是否显示搜索框', 'true/false/-', 'true', '-']},
			      		  {td: ['type', '数据类型', 'number', 'string', '可用于排序等。比如设置为number类型']},
			      		  {td: ['cellType', '列的类型', 'operation/-', '-', '当为operation时，会添加统一样式，并且该列不能排序']},
			      		  {td: ['cellTemplate', '该列的模板定义', '字符串参数', '-', '-']},
					 ]
				}
				
				
			};
	}
]);


/*

'use strict';

app.controller('conowGridDemoCtrl', ['$scope', 'DataService', 'conowModals', 
	function($scope, DataService, conowModals) {

		var vm = $scope.vm = {};
		var options = $scope.options = {
			isShowAdvancedFilter: false
		};
		
		$scope.filterOptions = {
			adSearch: null,
            defaultParams: {
                "EXPENSE_TYPE": {
                    "label": "报销类别",
                    "modelValue": "id",
                    "modelLabel": "OPTION_NAME",
                    "model": {
                        "OPTION_NAME": "item4",
                        "id": "xx04"
                    }
                },
                "EXPENSE_TIME": {
                    "label": "时间范围",
                    "searchType": "range",
                    "model": {
                        "min": "2015-09-10",
                        "max": "2015-09-18"
                    }
                },
                "EXPENSE_STAFF": {
                    "label": "报销人",
                    "modelValue": "ID",
                    "modelLabel": "NAME",
                    "model": {
                        "NAME": "王必劲",
                        "ORG_UNIT_ID": "1421924950435942510293354",
                        "CORP_ORG_ID": "1421924106089631410343354",
                        "JOBS_ID": "1421981877685502310333279",
                        "PHOTO": null,
                        "ICON_COLOR": "bg-info",
                        "MOBILE": "15915891586",
                        "MAIL": "821248964@qq.com",
                        "IS_ON_JOB": "TRUE",
                        "STAFF_CODE": "8575585",
                        "USER_INFO_ID": "1422945220097361510253279",
                        "ID": "1422945220097361510253279",
                        "totalName": "中科院/广州分院/科南/二组",
                        "ORG_UNIT_ID_HR_ORG_UNIT": "二组",
                        "CORP_ORG_ID_HR_ORG_UNIT": "科南",
                        "JOBS_ID_HR_JOBS_INFO": "java工程师"
                    }
                },
                "EXPENSE_ORG": {
                    "label": "所属部门",
                    "modelValue": "ID",
                    "modelLabel": "totalName",
                    "model": {
                        "ID": "1421924950435942510293354",
                        "ORG_UNIT_SHORT_NAME": "二组",
                        "CORP_ORG_ID": "1421924106089631410343354",
                        "ORG_UNIT_CODE": "CN0002000002",
                        "totalName": "中科院/广州分院/科南/二组"
                    }
                },
                "EXPENSE_AMOUNT": {
                    "label": "报销金额",
                    "searchType": "range",
                    "model": {
                        "min": "1000",
                        "max": "2000"
                    }
                },
                "EXPENSE_STATUS": {
                    "label": "报销状态",
                    "modelValue": "value",
                    "modelLabel": "label",
                    "model": {
                        "label": "四个字儿",
                        "value": "APPROVED1"
                    }
                },
                "EXPENSE_STATUS_CHECK": {
                    "label": "报销状态复选",
                    "modelValue": "value",
                    "modelLabel": "label",
                    "model": [{
                        "label": "审批中",
                        "value": "INAPPROVAL"
                    }, {
                        "label": "已报销",
                        "value": "APPROVED"
                    }]
                }
            }
		};
		
		$scope.view = function(row) {
			alert('in view-->' + JSON.stringify(row.entity));
			
			conowModals.open({
				templateUrl: 'other/demo/conow-responsive-table/conow-grid-modal.html',
				controller: 'conowGridModalCtrl',
				title: 'conowGrid弹窗演示',
				size: 'md',
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
		};
		
		$scope.setting = function(row) {
			alert('in setting-->' + JSON.stringify(row.entity));
		};
		
		$scope.del = function(row) {
			alert('in del-->', JSON.stringify(row.entity));
		};
		
		$scope.gridOptions1 = {
//			singleFilter: true,	// true/false
//			pagination: true,	// true/false
//			select: 'single',	// single/multiply/undefined
			url: '/service/jobsInfo!queryJobsListByOrgUintId?ORG_UNIT_ID=1421924106089631410343354',
//			url: 'other/demo/conow-responsive-table/data/conow-grid-data.json',
//			showColumnFooter: true,
			sizesLabel: '11111111111',
			selected: [
				{
					"firstName": "Cox11111111111111111111111111111",
					"lastName": "Carney",
					"company": "Enormo",
					"friends": ["friend0", "friend1", "friend2"]
				}, {
					"firstName": "Lorraine",
					"lastName": "Wise",
					"company": "Comveyer",
					"friends": ["friend10", "friend11", "friend12"]
				}
			],
			columnDefs: [
				{ name: '名称', field: 'JOBS_NAME', width: 100 }, 
				{ name: 'id', field: 'ID', width: 200, enableSorting: false }, 
				{ name: '编码', field: 'JOBS_CODE', width: 100 }, 
				{ name: '描述', field: 'JOBS_DESC', width: 300 }, 
				{ name: '类型', field: 'JOBS_TYPE_HR_JOBS_TYPE', width: 200 }, 
				{ name: '是否启用', field: 'DATA_ENABLE', width: 50 }, 
				{ name: '是否启用', field: 'DATA_ENABLE_SYSTEM_DATA_ENABLE', width: 100 }, 
				{ name: '备注', field: 'MEMO', width: 100 }, 
				{ name: '排序号', field: 'SEQ_NO', width: 100, type: 'number' },
				{ name: '操作', field: '', width: 200, enableSorting: false, cellType: 'operation', 
					cellTemplate: '<div>' + 
						'<a class="" ng-click="grid.appScope.view(row)"><i class="ci-seen"></i></a>' + 
						'<a class="" ng-click="grid.appScope.setting(row)"><i class="ci-set"></i></a>' + 
						'<a class="" ng-click="grid.appScope.del(row)"><i class="ci-delete"></i></a></div>' }
			],
			view: $scope.view,
			setting: $scope.setting,
			del: $scope.del,
			filterOptions: $scope.filterOptions
		};
		
		$scope.advancedSearchClick = function() {
			console.log('in advancedSearchClick');
		};
		
		$scope.clearAdvancedSearchClick = function() {
			console.log('in clearAdvancedSearchClick');
		};
		
		$scope.toggleAdSearchShow = function() {
			options.isShowAdvancedFilter = !options.isShowAdvancedFilter;
		}

		$scope.gridOptions2 = {
			singleFilter: true,	// true/false
			pagination: true,	// true/false
			select: 'single',	// single/multiply/undefined
			url: 'views/components/conow-responsive-table/data/pagination.json',
			columnDefs: [
			]
		};


	}
]);

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
		      		  {td: ['select', '单选/多选/没有checkbox选项', 'single/multiply/-', '-']},
		      		  {td: ['singleFilter', '是否显示搜索框', 'true/false/-', 'true']}
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
			      		  {td: ['width', '列的的宽度', '数字/百分数', '-', '-']},
			      		  {td: ['enableSorting', '允许排序', 'true/false', 'true', '-']},
			      		  {td: ['enableSorting', '是否显示搜索框', 'true/false/-', 'true', '-']},
			      		  {td: ['type', '数据类型', 'number', 'string', '可用于排序等。比如设置为number类型']},
			      		  {td: ['cellType', '列的类型', 'operation/-', '-', '当为operation时，会添加统一样式，并且该列不能排序']},
			      		  {td: ['cellTemplate', '该列的模板定义', '字符串参数', '-', '-']},
					 ]
				}
				
				
			};
	}
]);



 */