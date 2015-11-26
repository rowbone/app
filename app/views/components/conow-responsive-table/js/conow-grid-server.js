(function() {
	'use strict';

	/**
	 * todo:
	 * 1.隐藏列：现在通过设置cellClass,headerCellClass可以做到隐藏，但是table大小不会改变需要做一个resize		@徐金奖
	 * 2.筛选地区选择的问题。选择的时候页面需要显示名称，发送到后台需要地区的code		@周生伟
	 * 3.筛选，需要区分'只有快速搜索'，'只有筛选条件'，'快速搜索和筛选条件'三种情况
	 * 4.某些条件下不需要分页		@胡一峰。目前用 options.isServerPage 来判断是否后台分页
	 * */
	angular.module('conowGrid', [])
		.directive('conowGrid', ['conowGridClass', '$filter', 'DataService', '$http', '$compile', '$rootScope', 'i18nService',
			function(conowGridClass, $filter, DataService, $http, $compile, $rootScope, i18nService) {
				return {
					restrict: 'A',
					// template: '<div id="grid1" ui-grid="vm.gridOptions" class="grid"></div>',
					// templateUrl: 'views/components/conow-responsive-table/tpls/conow-grid-tpl.html',
					templateUrl: 'js/directives/conow-grid/tpls/conow-grid-tpl.html',
					scope: {
						getGridUserOptions: '&conowGrid'
					},
					transclude: true,
					compile: function(tElem, tAttrs) {
						return this.link;
					},
					controller: function($scope, $element, $attrs, $transclude) {
						var self = this,
							vm = $scope.vm = {},
							options = $scope.options = {
								isServerPage: true,
								isPagination: true,
								isAllowSelection: true,
								isShowQuickSearch: true,
								isShowAdvancedSearch: true,
								dataLoadDefaultParams: {
									page: 1,
									pagesize: 10
								},
								// 保存加载时的所有参数[转换成提交到后台的参数对象之前的参数]
								dataLoadParams: {},
								paginationOptions: {
									totalItems: 0,
									onChangeFn: function(pageInfo) {
										self._getPageData(pageInfo);
									}
								}
							};

						// get pagination data
						this._getPageData = function(dataLoadParams) {
							var params = {},
								tmpParams = {},
								sortColumns = null,
								singleFilterText = null,
								adSearch = null,
								page = null,
								pagesize = null;

							dataLoadParams = angular.isUndefined(dataLoadParams) ? {} : dataLoadParams;

							// advanced search
							adSearch = dataLoadParams.adSearch;
							if (angular.isDefined(adSearch)) {
								// todo:add adSearch toDB params to options.dataLoadParams
								options.dataLoadParams.adSearch = adSearch;
								angular.extend(tmpParams, adSearch);
							} else if (options.dataLoadParams.adSearch) {
								adSearch = options.dataLoadParams.adSearch;
								angular.extend(tmpParams, adSearch);
							}

							// sortColumns
							sortColumns = dataLoadParams.sortColumns;
							if (angular.isDefined(sortColumns) && !angular.equals(sortColumns, null)) {
								if (sortColumns.length == 1) {
									options.dataLoadParams.sortColumns = sortColumns;
									tmpParams.sortBy = sortColumns[0]['field'] + ',' + sortColumns[0]['sort']['direction'];
								} else {
									// todo:multiply columns for sorting
									// keywords: field sort direction priority
								}
							} else if (options.dataLoadParams.sortColumns) {
								sortColumns = options.dataLoadParams.sortColumns;
								tmpParams.sortBy = sortColumns[0]['field'] + ',' + sortColumns[0]['sort']['direction'];
							}

							// pagination
							page = dataLoadParams.page;
							pagesize = dataLoadParams.pagesize;
							if (angular.isDefined(page)) {
								options.dataLoadParams.page = page;
								tmpParams.page = page;
							} else if (options.dataLoadParams.page) {
								page = options.dataLoadParams.page;
								tmpParams.page = page;
							}
							if (angular.isDefined(pagesize)) {
								tmpParams.pagesize = pagesize;
								options.dataLoadParams.pagesize = pagesize;
								tmpParams.pagesize = pagesize;
							} else if (options.dataLoadParams.pagesize) {
								pagesize = options.dataLoadParams.pagesize;
								tmpParams.pagesize = pagesize;
							}

							// others params

							// Don't use dataLoadParams for extending because of irrelevent params
							params = angular.extend({}, options.dataLoadDefaultParams, tmpParams);
							
							if (options.isPagination) {
								// options.isServerPage === true

								if(options.isServerPage) {
																		
									DataService.postData(options.gridUserOptions.url, { 'type': 'advSearch', 'params': params })
										.then(function(data) {
											if(data) {
												var pageInfo = {
													count: 0,
													page: 1, 
													pagesize: 10
												},
													gridData = angular.isDefined(data.obj) ? data.obj : data;

												data.pageInfo = angular.isDefined(data.pageInfo) ? data.pageInfo : pageInfo;											
												options.paginationOptions.totalItems = data.pageInfo.count;

												options.allData = gridData;
												options.gridOptions.data = gridData;
											}
										}, function(msg) {
											console.error(msg);
										});

								} else {
									// options.isServerPage === false
									var spliceStart = 0;
									if(options.allData.length === 0) {
										DataService.postData(options.gridUserOptions.url, { 'type': 'advSearch', 'params': params })
											.then(function(data) {
												if(data) {
													var pageInfo = {
														count: 0,
														page: 1, 
														pagesize: 10
													},
														gridData = angular.isDefined(data.obj) ? data.obj : data;

													data.pageInfo = (angular.isDefined(data.pageInfo) && !angular.equals(data.pageInfo, null)) ? data.pageInfo : pageInfo;											
													options.paginationOptions.totalItems = gridData.length;

													options.allData = gridData;
													options.pageData = angular.copy(gridData);

													page = params.page || options.dataLoadDefaultParams.page;
													pagesize = params.pagesize || options.dataLoadDefaultParams.pagesize;

													if(page > 1) {
														spliceStart = (page - 1) * pagesize;
													}
													options.gridOptions.data = options.pageData.splice(spliceStart, pagesize);
												}
											}, function(msg) {
												console.error(msg);
											});										
									} else {
										page = params.page || options.dataLoadDefaultParams.page;
										pagesize = params.pagesize || options.dataLoadDefaultParams.pagesize;
										options.pageData = angular.copy(options.allData);

										if(page > 1) {
											spliceStart = (page - 1) * pagesize;
										}
										options.gridOptions.data = options.pageData.splice(spliceStart, pagesize);
									}
								}

							} else {
								// 	isPagination === false
								DataService.postData(options.gridUserOptions.url, { 'type': 'advSearch', 'params': params })
									.then(function(data) {
										if(data) {
											var gridData = angular.isDefined(data.obj) ? data.obj : data;

											options.allData = gridData;
											options.gridOptions.data = gridData;
										}
									}, function(msg) {
										console.error(msg);
									});
							}

							/*
							$http.post(options.gridUserOptions.url, {
								'type': 'advSearch',
								'params': params
							}).
							success(function(data, status, headers, config) {
								var pageInfo = {
									count: 0,
									page: 1,
									pagesize: 10
								};
								data.pageInfo = angular.isDefined(data.pageInfo) ? data.pageInfo : pageInfo;
								var gridData = angular.isDefined(data.obj) ? data.obj : data;

								options.paginationOptions.totalItems = data.pageInfo.count;
								options.paginationOptions.currentPage = data.pageInfo.page;

								options.allData = gridData;
								options.gridOptions.data = gridData;
							}).
							error(function(data, status, headers, config) {
								console.error('Error occured when searching data...');
							});
							*/
							
							

						};

						// todo:列操作方法
						this._cellOperation = function() {};

						// 初始化方法
						this._init = function() {
							// 设置语言类型，分页功能的文字有影响。
							i18nService.setCurrentLang('zh-cn');

							var $grid = $element.find('.grid-instance'),
								options = $scope.options,
								// = {
								// 	isSingleFilter: true,
								// 	pagination: true,
								// 	isAllowSelection: true,
								// },
								vm = $scope.vm;

							options.allData = [];

							// gridUserOptions for 'user config options'
							options.gridUserOptions = $scope.getGridUserOptions();

							// conowGridClass instance to hold default class and some public methods
							options.conowGridInstance = new conowGridClass();
							// 业务controller的配置参数中也持有当前 conowGridInstance，以提供操作的方法	@20151110
							options.gridUserOptions.conowGridInstance = options.conowGridInstance;
							$scope.conowGridInstance = options.conowGridInstance;
							options.conowGridInstance.setScope($scope);

							options.gridDefaultOptions = options.conowGridInstance.getDefaultOptions();

							// ----- isPagination & isServerPage starts -----
							var isPagination = options.gridUserOptions.isPagination,
								isServerPage = options.gridUserOptions.isServerPage;

							if(angular.isDefined(isPagination) && angular.equals(isPagination, false)) {
								options.isPagination = false;
								options.isServerPage = false;
							} else if(angular.isDefined(isServerPage) && angular.equals(isServerPage, false)) {
								options.isServerPage = false;
							}
							// ----- isPagination & isServerPage ends -----

							// gridInitOptions for 'get config options in initialization'
							options.gridInitOptions = {
								filteredData: null,
								singleFilterText: ''
							};

							// gridPaginationOptions for server-side pagination
							options.gridPaginationOptions = {
								pageNumber: 1,
								pageSize: 10,
								sort: null
							};
							angular.extend(options.gridInitOptions, {
								useExternalPagination: true,
								useExternalSorting: true,
								//						    enablePaginationControls: false
							});

							// ----- advanced search starts -----
							var userOptions = options.gridUserOptions,
								quickSearchKey = userOptions.quickSearchKey || userOptions.searchKey,
								quickSearchTip = userOptions.quickSearchTip || userOptions.searchTip || '请输入关键字',
								advancedSearchOptions = userOptions.filterOptions;
							// init filterOptions
							$scope.filterOptions = {};

							// quick search
							if (angular.isUndefined(quickSearchKey)) {
								options.isShowQuickSearch = false;
							} else {
								options.isShowQuickSearch = true;

								options.quickSearchKey = quickSearchKey;
								options.quickSearchTip = quickSearchTip;

								$scope.filterOptions = {
									onConfirm: function(queryToDB) {
										self._getPageData({
											adSearch: queryToDB,
											page: 1
										});
									}									
								}
							}
							// advancedsearch
							if (angular.isUndefined(advancedSearchOptions) || angular.equals(advancedSearchOptions, null)) {
								options.isShowAdvancedSearch = false;
							} else {
								options.isShowAdvancedSearch = true;
								angular.extend($scope.filterOptions, advancedSearchOptions);

								$scope.filterOptions.onConfirm = function(queryToDB) {

									self._getPageData({
										adSearch: queryToDB,
										page: 1
									});
								};
							}
							// ----- advanced search ends -----

							// ----- cell operation starts -----
							var columnDefs = options.gridUserOptions.columnDefs,
								columnDef = null;
							for (var i = 0, iLen = columnDefs.length; i < iLen; i++) {
								columnDef = columnDefs[i];
								if (angular.isDefined(columnDef.cellType) && columnDef.cellType === 'operation') {
									columnDef.cellClass = angular.isUndefined(columnDef.cellClass) ? 'conow-grid-operation-cell' : columnDef.cellClass + ' conow-grid-operation-cell';
									columnDef.enableSorting = false;
								}
							}
							// ----- cell operation ends -----
							/*
							// ----- single filter starts -----
							var singleFilter = options.gridUserOptions.singleFilter;
							if (angular.isDefined(singleFilter) && singleFilter === false) {
								options.isSingleFilter = false;
							}
							var pagination = options.gridUserOptions.pagination;
							if (angular.isDefined(pagination) && pagination === false) {
								options.pagination = false;
							}
							// ----- single filter ends -----
							*/
							// todo:动态编译指令 'ui-grid-pagination' 和 'ui-grid-selection'
							// if(options.pagination) {
							// 	$grid.attr('ui-grid-pagination', '').attr('ui-grid-selection', '');

							// 	$compile($grid)($scope);
							// }

							// selection
							var tmpOptions = {},
								select = options.gridUserOptions.select;

							if (angular.isUndefined(select)) {
								tmpOptions = {
									enableRowSelection: false,
									enableRowHeaderSelection: false
								};
								options.isAllowSelection = false;
							} else if (select === 'single') {options.isAllowSelection = true;
								tmpOptions = {
									enableRowSelection: true,
									enableRowHeaderSelection: false,
									multiSelect: false,
									enableSelectAll: false
								};
							} else {options.isAllowSelection = true;
								tmpOptions = {
									enableRowSelection: true,
									multiSelect: true,
									enableSelectAll: true
								};
							}
							angular.extend(options.gridInitOptions, tmpOptions);

							// footer
							var showColumnFooter = options.gridUserOptions.showColumnFooter;
							if (angular.isDefined(showColumnFooter) && showColumnFooter !== false) {
								$element.find('.grid').addClass('grid-with-footer');
							}

							// All grid options
							options.gridOptions = angular.extend({},
								options.gridDefaultOptions, options.gridUserOptions, options.gridInitOptions);
							// at this

							// gridApi for public functions
							options.gridOptions.onRegisterApi = function(gridApi) {
								options.gridApi = gridApi;
								// 排序触发事件
								gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
									if (sortColumns.length == 0) {
										// options.gridPaginationOptions.sort = null;
										options.gridPaginationOptions.sortColumns = null;
									} else {
										// options.gridPaginationOptions.sort = sortColumns[0].sort.direction;
										options.gridPaginationOptions.sortColumns = sortColumns;
									}

									// options.gridApi.pagination.seek(1);

									self._getPageData({
										'sortColumns': options.gridPaginationOptions.sortColumns,
										page: 1
									});
								});
								// 切换页码触发事件
								//							gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
								//								options.gridPaginationOptions.pageNumber = newPage;
								//								options.gridPaginationOptions.pageSize = pageSize;
								//								
								//								self._getPageData({ page: newPage, pagesize: pageSize});
								//							});
								// cellNav navigate 触发事件
								//							gridApi.cellNav.on.navigate($scope, function(newRowCol, oldRowCol) {
								//								console.log('in cellNav navigation...')
								//								console.log(newRowCol);
								//								console.log(oldRowCol);
								//							});
								// row selection 触发事件
								gridApi.selection.on.rowSelectionChanged($scope, function(row) {
									console.log('selected row', row);

									options.conowGridInstance.setSelectedItems(options.gridApi.selection.getSelectedRows());
								});
							};

							if (angular.isDefined(options.gridUserOptions.url)) {
								self._getPageData();
							}

						};

						this.init = function() {
							self._init();
						};

						// reload function binding on $scope for using in link function
						$scope.reload = function(dataLoadParams) {
							self._getPageData(dataLoadParams);
						};

					},
					link: function postLink(scope, elem, attrs, ctrl) {
						ctrl.init();

						var vm = scope.vm,
							options = scope.options;

						//
						scope.getSelectedRows = function() {
							var selectedRows = options.gridApi.selection.getSelectedRows();
							// alert(JSON.stringify(selectedRows));
							alert(selectedRows.length)
						};

						// bind userOptions functions on grid 
						angular.forEach(options.gridUserOptions, function(value, key) {
							if (angular.isFunction(value)) {
								scope[key] = value;
							}
						});

						scope.getCurrentCell = function() {
							var rowCol = options.gridApi.cellNav.getFocusedCell();
							var currentSelection = options.gridApi.cellNav.getCurrentSelection();
							if (rowCol.row.entity) {
								alert(JSON.stringify(rowCol.row.entity));
							}
						};

					}
				}
			}
		]);

	/**
	 * conowGridClass:hold public functions for conowGrid operations
	 * */
	angular.module('conowGrid')
		.factory('conowGridClass', [
			function() {
				function conowGridClass() {
					var defaultOptions = {
							selectionRowHeaderWidth: 35,
							// pagination
							// paginationPageSizes: [10, 25, 50, 75],
							paginationPageSizes: [],
							paginationPageSize: 10,
							// selection
							// enableRowSelection: true,
							// enableSelectAll: true,
							// multiSelect: true,
							// enableRowHeaderSelection: true,
						},
						selectedRows = null,
						self = this,
						scope = null;

					/**
					 * default options setting goes here
					 * */
					this.getDefaultOptions = function() {
						return defaultOptions;
					};

					this.setScope = function(_scope) {
						self.scope = _scope;
					};

					this.reload = function() {
						self.scope.reload();
					};

					this.setSelectedItems = function(selectedRows) {
						self.selectedRows = selectedRows;
					};

					this.getSelectedItems = function() {
						return self.selectedRows;
					};

				};

				return conowGridClass;
			}
		]);

})();
