(function() {
	'use strict';

	/**
	 * todo:
	 * 1.隐藏列：现在通过设置cellClass,headerCellClass可以做到隐藏，但是table大小不会改变需要做一个resize		@徐金奖
	 * 2.筛选地区选择的问题。选择的时候页面需要显示名称，发送到后台需要地区的code		@周生伟
	 * 3.加载数据时显示正在加载中
	 * */
	var app = angular.module('conowGrid', []);

	app.directive('conowGrid', ['conowGridClass', '$filter', 'DataService', '$http', '$compile', '$rootScope', 'i18nService', '$timeout', 
		function(conowGridClass, $filter, DataService, $http, $compile, $rootScope, i18nService, $timeout) {
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
									if(angular.isDefined(options.gridApi.selection)) {

										// 清除初始化时的已选项
										options.gridUserOptions.selectedItems = [];

										// 清除 grid 的选中项
										options.gridApi.selection.clearSelectedRows();

										// 清除 conowGridInstance 保存的已选项
										options.conowGridInstance.clearSelectedItems();
									}
									
									self._getPageData(pageInfo);
								}
							},
							// 用于保存各个参数加载数据的 loadFlag，格式为 { 'advancedSearch', true/false }
							loadFlags: {}
						};

					// 前端处理 搜索/排序 参数
					var paramsManager = function(dataSrc, params) {
						var filterParams = {};

						angular.forEach(params, function(value, key) {
							
							switch(key) {
								case 'page':
									break;
								case 'pagesize':
									break;
								case 'forceReload':
									break;
								case '$':
									break;
								case 'sortBy':
									dataSrc = sortByManagerFn(dataSrc, value);
									break;
								default: 
									// todo:这里仅对单个字段模糊搜索进行处理，涉及到 range/object/array 类型的数据，没有进行处理
									// @20151127
									filterParams = $scope.$eval('{"' + key + '": "' + value + '"}');
									dataSrc = $filter('filter')(dataSrc, filterParams);
									break;
							}
						});

						return dataSrc;
					};

					var sortByManagerFn = function(dataSrc, sortByParams) {
						// default asc
						// arr 预留了第三个属性：fieldType。用于数字等的排序	@20151127
						var arr = sortByParams.split(' '),
							isReverse = false;

						if(arr.length === 2 || arr.length === 3) {
							if(angular.equals(arr[1], 'desc')) {
								isReverse = true;
							}
							return $filter('orderBy')(dataSrc, arr[0], isReverse);
						} else {
							return dataSrc;
						}
					}

					this._getAllDataLoadParams = function(dataLoadParams) {
						var params = {},
							tmpParams = {},
							sortColumns = null,
							sortColumn = null,
							singleFilterText = null,
							adSearch = null,
							page = null,
							pagesize = null,
							forceReload = false,
							urlParams = null;

						dataLoadParams = angular.isUndefined(dataLoadParams) ? {} : dataLoadParams;

						// advanced search
						adSearch = dataLoadParams.adSearch;
						if (angular.isDefined(adSearch)) {
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
								sortColumn = sortColumns[0];

								if(options.isServerPage) {
									tmpParams.sortBy = sortColumn['field'] + ' ' + sortColumn['sort']['direction'];
								} else {
									tmpParams.sortBy = sortColumn['field'] + ' ' + sortColumn['sort']['direction'] + ' ' + sortColumn['colDef']['type'];
								}
							} else {
								// todo:multiply columns for sorting
								// keywords: field sort direction priority
							}
						} else if (options.dataLoadParams.sortColumns) {
							sortColumns = options.dataLoadParams.sortColumns;
							sortColumn = sortColumns[0];

							if(options.isServerPage) {
								tmpParams.sortBy = sortColumn['field'] + ' ' + sortColumn['sort']['direction'];
							} else {
								tmpParams.sortBy = sortColumn['field'] + ' ' + sortColumn['sort']['direction'] + ' ' + sortColumn['colDef']['type'];
							}
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

						// urlParams
						urlParams = options.gridUserOptions.urlParams;
						if(angular.isDefined(urlParams)) {
							angular.extend(tmpParams, urlParams);
						}

						// forceReload
						forceReload = dataLoadParams.forceReload;
						tmpParams.forceReload = angular.isDefined(forceReload) ? forceReload : false;

						// others params

						// Don't use dataLoadParams for extending because of irrelevent params
						params = angular.extend({}, options.dataLoadDefaultParams, tmpParams);

						return params;
					};

					// 发送后台请求前，去掉多余的参数
					var removeNeedlessParams = function() {
						var params = Array.prototype.slice.call(arguments),
							backendParams = params[0],
							needlessParams = params.slice(1),
							defaultNeedlessParams = ['forceReload'];

						needlessParams = defaultNeedlessParams.concat(needlessParams);

						angular.forEach(needlessParams, function(value) {
							if(angular.isDefined(backendParams[value])) {
								delete backendParams[value];
							}
						});

						return backendParams;
					};

					// 因为当前页的数据会在加载后添加 'sequence'等属性，所以这里通过 'compareKey' 字段进行比较，相同则返回对应项用于选中
					var getSelectedItem = function(item, pageData) {
						var i = 0,
							iLen = pageData.length,
							compareKey = options.gridUserOptions.compareKey || 'ID';

						for(; i<iLen; i++) {
							if(angular.equals(item[compareKey], pageData[i][compareKey])) {
								return pageData[i];
							}
						}

						return null;
					};

					// 用于在加载数据之后进行一些处理：选中/取消选中/设置不能选择/设置可选中项 .etc.
					var fnAfterGetPageData = function(pageData) {
						var gridApi = options.gridApi,
							selectedItems = options.gridUserOptions.selectedItems,
							selectedItem = null;
						if(angular.isDefined(gridApi.selection) && angular.isDefined(selectedItems)) {
							$timeout(function() {
								for(var i=0, iLen=selectedItems.length; i<iLen; i++) {
									selectedItem = getSelectedItem(selectedItems[i], pageData);
									if(!angular.equals(selectedItem, null)) {
										gridApi.selection.selectRow(selectedItem);
									}
								}
							})
						}
					};

					this._getPageDataByParams = function(params) {
						var page = null,
							pagesize = null;
						
						// options.isPagination === true
						if (options.isPagination) {

							// options.isServerPage === true
							if(options.isServerPage) {
								params = removeNeedlessParams(params);							

								DataService.postData(options.gridUserOptions.url, { 'type': 'advSearch', 'params': params })
									.then(function(data) {
										if(data) {
											var pageInfo = {
													count: 0,
													page: 1, 
													pagesize: 10
												},
												gridData = angular.isDefined(data.obj) ? data.obj : data;

											options.allData = gridData;
											options.pageData = gridData;

											data.pageInfo = angular.isDefined(data.pageInfo) ? data.pageInfo : pageInfo;											
											options.paginationOptions.totalItems = data.pageInfo.count;

											// add sequence for every piece of pageData
											options.pageData.forEach(function(row, index) {
												row.sequence = ((data.pageInfo.page - 1) * data.pageInfo.pagesize) + (index + 1);
											});

											options.gridOptions.data = options.pageData;

											fnAfterGetPageData(options.pageData);
										}
									}, function(msg) {
										console.error(msg);
									});

							} else {

								// options.isServerPage === false
								var spliceStart = 0;
								if(params.forceReload || options.allData.length === 0) {
									params = removeNeedlessParams(params, 'page', 'pagesize');

									DataService.postData(options.gridUserOptions.url, { 'type': 'advSearch', 'params': params })
										.then(function(data) {
											if(data) {
												var pageInfo = {
														count: 0,
														page: 1, 
														pagesize: 10
													},
													gridData = angular.isDefined(data.obj) ? data.obj : data;

												options.allData = gridData;

												page = params.page || options.dataLoadDefaultParams.page;
												pagesize = params.pagesize || options.dataLoadDefaultParams.pagesize;
												if(page > 1) {
													spliceStart = (page - 1) * pagesize;
												}
												options.pageData = gridData.slice(spliceStart, spliceStart + pagesize);
												// data.pageInfo = (angular.isDefined(data.pageInfo) && !angular.equals(data.pageInfo, null)) ? data.pageInfo : pageInfo;											

												// add sequence for every piece of pageData
												options.pageData.forEach(function(row, index) {
													row.sequence = ((page - 1) * pagesize) + (index + 1);
												});

												options.paginationOptions.totalItems = gridData.length;

												options.gridOptions.data = options.pageData;

												fnAfterGetPageData(options.pageData);
											}
										}, function(msg) {
											console.error(msg);
										});										
								} else {
									page = params.page || options.dataLoadDefaultParams.page;
									pagesize = params.pagesize || options.dataLoadDefaultParams.pagesize;
									options.pageData = angular.copy(options.allData);

									options.pageData = paramsManager(options.pageData, params);
									if(page > 1) {
										spliceStart = (page - 1) * pagesize;
									}
									options.pageData = options.pageData.slice(spliceStart, spliceStart + pagesize);

									// add sequence for every piece of pageData
									options.pageData.forEach(function(row, index) {
										row.sequence = ((page - 1) * pagesize) + (index + 1);
									});

									options.gridOptions.data = options.pageData;

									options.paginationOptions.currentPage = page;
									options.paginationOptions.totalItems = options.allData.length;

									fnAfterGetPageData(options.pageData);
								}
							}

						} else {
							// options.isPagination === false
							if(params.forceReload || options.allData.length === 0) {
								params = removeNeedlessParams(params, 'page', 'pagesize');

								DataService.postData(options.gridUserOptions.url, { 'type': 'advSearch', 'params': params })
									.then(function(data) {
										if(data) {
											var gridData = angular.isDefined(data.obj) ? data.obj : data;
											options.allData = gridData;

											options.pageData = angular.copy(options.allData);
											options.pageData = paramsManager(options.pageData, params);

											// add sequence for every piece of data
											options.pageData.forEach(function(row, index) {
												row.sequence = index + 1;
											});

											options.gridOptions.data = options.pageData;

											fnAfterGetPageData(options.pageData);
										}
									}, function(msg) {
										console.error(msg);
									});
							} else {
								options.pageData = angular.copy(options.allData);
								options.pageData = paramsManager(options.pageData, params);

								// add sequence for every piece of data
								options.pageData.forEach(function(row, index) {
									row.sequence = index + 1;
								});

								options.gridOptions.data = options.pageData;

								fnAfterGetPageData(options.pageData);
							}
						}		
					}

					/**
					 * _getPageData：获取显示数据的方法
					 * 逻辑说明：加载参数作为形参传入，进行逻辑判断后，原始参数暂存在 "options.dataLoadParams"(下一次可以直接使用),
					 * 			需要进行加载的参数暂存在 "tmpParams"，
					 * 			最后通过 params = angular.extend({}, options.dataLoadDefaultParams, tmpParams) 获取所有加载参数
					 * 			
					 * @param:dataLoadParams - 每次进行相应操作会触发的加载参数，包括 "adSearch", "sortColumns", "page & pagesize", ...					 * 
					 */
					this._getPageData = function(dataLoadParams) {
						var params = self._getAllDataLoadParams(dataLoadParams),
							loadFlag = true;

						angular.forEach(options.loadFlags, function(value, key) {
							if(value === false) {
								loadFlag = false;
							}
						})
						if(loadFlag) {
							self._getPageDataByParams(params);
						}
					};

					// todo:列操作方法
					this._cellOperation = function() {};

					// 初始化方法
					this._init = function() {
						// 设置语言类型，分页功能的文字有影响。
						i18nService.setCurrentLang('zh-cn');

						var $grid = $element.find('.grid-instance'),
							options = $scope.options,
							vm = $scope.vm;
						// options.allData 保存后台接口返回的所有数据(对于前台分页和不分页的数据，不用再每次发送请求)
						options.allData = [];

						// gridUserOptions for 'user config options'
						options.gridUserOptions = $scope.getGridUserOptions();

						// conowGridClass instance to hold default class and some public methods
						options.conowGridInstance = new conowGridClass();
						// 业务controller的配置参数中也持有当前 conowGridInstance，以提供操作的方法	@20151110
						options.gridUserOptions.conowGridInstance = options.conowGridInstance;
						$scope.conowGridInstance = options.conowGridInstance;
						// conowGrid Service 实例中持有当前 $scope
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
							// enablePaginationControls: false
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
										// page: 1
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

							if(angular.isObject(advancedSearchOptions.defaultParams) && !angular.equals(advancedSearchOptions.defaultParams, {})) {
								options.loadFlags['advancedSearch'] = false;
							}

							$scope.filterOptions.onConfirm = function(queryToDB) {
								if(options.loadFlags['advancedSearch'] === false) {
									options.loadFlags['advancedSearch'] = true;
								}

								self._getPageData({
									adSearch: queryToDB,
									// page: 1
								});
							};
						}
						// ----- advanced search ends -----

						// ----- cell type starts -----
						var columnDefs = options.gridUserOptions.columnDefs,
							columnDef = null,
							columnDefTmp = null,
							cellType = '';
						for (var i = 0, iLen = columnDefs.length; i < iLen; i++) {
							columnDef = columnDefs[i];
							if(angular.isDefined(columnDef.cellType)) {
								cellType = columnDef.cellType;
								// 操作列
								if(cellType === 'operation') {
									columnDefTmp = {
										cellClass: angular.isUndefined(columnDef.cellClass) ? 'conow-grid-operation-cell' : columnDef.cellClass + ' conow-grid-operation-cell',
										enableSorting: false,
										width: angular.isDefined(columnDef.width) ? columnDef.width : 100
									};
								// 序号列
								} else if(cellType === 'sequence') {
									columnDefTmp = {
										cellClass: angular.isUndefined(columnDef.cellClass) ? 'conow-grid-sequence-cell' : columnDef.cellClass + ' conow-grid-sequence-cell',
										enableSorting: false,
										field: 'sequence',
										width: 100,
									};
								}

								angular.extend(columnDef, columnDefTmp);
							} else {
								// do nothing
							}
						}
						// ----- cell type ends -----
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
							selectMode = options.gridUserOptions.selectMode;

						options.selectMode = selectMode;

						if (angular.isUndefined(selectMode)) {
							tmpOptions = {
								enableRowSelection: false,
								enableRowHeaderSelection: false
							};
							options.isAllowSelection = false;
						} else if (selectMode === 'single') {
							options.isAllowSelection = true;
							tmpOptions = {
								enableRowSelection: true,
								enableRowHeaderSelection: false,
								multiSelect: false,
								enableSelectAll: false
							};
						} else {
							options.isAllowSelection = true;
							tmpOptions = {
								enableFullRowSelection: false,
								enableRowHeaderSelection: true,
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
									// page: 1
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
							if(gridApi.selection) {
								// row select 触发方法
								var gridInstance = options.conowGridInstance,
									selectMode = options.selectMode,
									selectedGridRows = [],
									selectedRows = [],
									unSelectedGridRows = [],
									unSelectedRows = [];

								gridApi.selection.on.rowSelectionChanged($scope, function(gridRows) {
									selectedRows = [];
									unSelectedRows = [];
									// selectedRows = options.gridApi.selection.getSelectedRows();
									 
									// selectedGridRows = gridRows.filter(function(item) {
									// 	return item.isSelected === true;
									// });
									// selectedRow = [];
									// unSelectedGridRows = gridRows.filter(function(item) {
									// 	return item.isSelected === false;
									// });
									// unSelectedRows = [];

									// angular.forEach(unSelectedGridRows, function(value, index) {
									// 	if(value.entity) {
									// 		unSelectedRows.push(value.entity);
									// 	}
									// });

									// selectedRows = angular.forEach(selectedGridRows, function(value, index) {
									// 	if(value.entity) {
									// 		selectedRows.push(value.entity);
									// 	}
									// });
									
									if(gridRows.isSelected) {
										selectedRows.push(gridRows.entity);
									} else {
										unSelectedRows.push(gridRows.entity);
									}

									if(angular.equals(selectMode, 'single')) {
										gridInstance.setSelectedItems(selectedRows);
									} else if(angular.equals(selectMode, 'multiply')) {
										// gridInstance.addSelectedItems(selectedRows);
										if(selectedRows.length > 0) {
											gridInstance.addSelectedItems(selectedRows);
										}
										if(unSelectedRows.length > 0) {
											gridInstance.removeSelectedItems(unSelectedRows);
										}
									} else {
										// other mode 
									}
								});

								// all select 触发方法
								gridApi.selection.on.rowSelectionChangedBatch($scope, function(gridRows) {
									// angular.forEach(gridRows, function(value, index) {
									// 	if(value.entity) {
									// 		selectedRows.push(value.entity);
									// 	}
									// });
									selectedGridRows = gridRows.filter(function(item) {
										return item.isSelected === true;
									});
									selectedRows = [];
									unSelectedGridRows = gridRows.filter(function(item) {
										return item.isSelected === false;
									});
									unSelectedRows = [];

									angular.forEach(unSelectedGridRows, function(value, index) {
										if(value.entity) {
											unSelectedRows.push(value.entity);
										}
									});

									// selectedRows = options.gridApi.selection.getSelectedRows();
									angular.forEach(selectedGridRows, function(value, index) {
										if(value.entity) {
											selectedRows.push(value.entity);
										}
									});

									if(selectedRows.length > 0) {
										gridInstance.addSelectedItems(selectedRows);
									}
									if(unSelectedRows.length > 0) {
										gridInstance.removeSelectedItems(unSelectedRows);
									}
								});
							}
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
	app.factory('conowGridClass', [
		function() {
			function conowGridClass() {
				var defaultOptions = {
						selectionRowHeaderWidth: 50,
						// rowHeight: 50,
						// pagination
						// paginationPageSizes: [10, 25, 50, 75],
						paginationPageSizes: [],
						paginationPageSize: 10,
						// selection
						enableFullRowSelection: true,
						enableRowHeaderSelection: true,
						enableRowSelection: true,
						enableSelectAll: true,
						multiSelect: true
					},
					selectedRows = [],
					self = this,
					scope = null;

				var indexInArr = function(obj, arr) {
					var i = 0,
						iLen = arr.length,
						index = -1;

					for(; i<iLen; i++) {
						if(angular.equals(obj, arr[i])) {
							index = i;
							break;
						}
					}

					return index;
				};

				/**
				 * default options setting goes here
				 * */
				this.getDefaultOptions = function() {
					return defaultOptions;
				};

				/**
				 * hold $scope
				 */
				this.setScope = function(_scope) {
					self.scope = _scope;
				};

				/**
				 * reload table page data
				 */
				this.reload = function(reloadParams) {
					var params = angular.extend({ 'forceReload': true }, reloadParams);

					self.scope.reload(params);
				};

				/**
				 * set table selected items
				 */
				this.setSelectedItems = function(_selectedRows) {
					selectedRows = _selectedRows;
				};

				/**
				 * add table selected items
				 */
				this.addSelectedItems = function(_selectedRows) {
					var index = -1;
					for(var i=0, iLen=_selectedRows.length; i<iLen; i++) {
						index = indexInArr(_selectedRows[i], selectedRows);

						if(indexInArr(_selectedRows[i], selectedRows) === -1) {
							selectedRows.push(_selectedRows[i]);
						}
					}
				};

				/**
				 * remove selected items from table
				 */
				this.removeSelectedItems = function(_unSelectedRows) {
					var index = -1;
					for(var i=0, iLen=_unSelectedRows.length; i<iLen; i++) {
						index = indexInArr(_unSelectedRows[i], selectedRows);

						if(index > -1) {
							selectedRows.splice(index, 1);
						}
					}
				};

				/**
				 * clear table selected items
				 */
				this.clearSelectedItems = function() {
					selectedRows = [];
				};

				/**
				 * get table selected items
				 */
				this.getSelectedItems = function() {
					return selectedRows;
				};

			};

			return conowGridClass;
		}
	]);

})();
