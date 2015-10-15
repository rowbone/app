'use strict';

angular.module('app')
	.directive('conowGrid', ['conowGridClass', '$filter', 'DataService', '$compile', '$rootScope', 'i18nService', 
		function(conowGridClass, $filter, DataService, $compile, $rootScope, i18nService) {
			return {
				restrict: 'A',
				// template: '<div id="grid1" ui-grid="vm.gridOptions" class="grid"></div>',
//				templateUrl: 'views/components/conow-responsive-table/tpls/conow-grid-tpl.html',
				 templateUrl: 'js/directives/conow-grid/tpls/conow-grid-tpl.html',
				 scope: {
					 getGridUserOptions: '&conowGrid'
				 },
				compile: function(tElem, tAttrs) {
					return this.link;
				}, 
				controller: function($scope, $element, $attrs, $transclude) {
					var self = this,
						vm = $scope.vm = {}, 
						options = $scope.options = {
							isSingleFilter: true,
							isServerPage: true,
							isPagination: true, 
							isShowOperationBtns: true,
							isAllowSelection: true,
							dataLoadParams: {
								page: 1, 
								pagesize: 10
							}
						};

					// get pagination data
					this._getPageData = function(dataLoadParams) {
						var params = {},
							sortColumns = null,
							singleFilterText = null,
							adSearch = null,
							page = null,
							pagesize = null;
						
						dataLoadParams = angular.isUndefined(dataLoadParams) ? {} : dataLoadParams;
						
						if(options.isServerPage) {
							
							// advanced search
							adSearch = dataLoadParams.adSearch;
							if(angular.isDefined(adSearch)) {
								// todo:add adSearch toDB params to options.dataLoadParams
							}
							
							// singleFilter
							singleFilterText = dataLoadParams.singleFilterText;
							if(angular.isDefined(singleFilterText)) {
								options.dataLoadParams.keyword = singleFilterText;
							}
							
							// sortColumns
							sortColumns = dataLoadParams.sortColumns;
							if(angular.isDefined(sortColumns)) {								
								if(sortColumns.length == 1) {
									options.dataLoadParams.sortBy = sortColumns[0]['field'] + ',' + sortColumns[0]['sort']['direction'];
								} else {
									// todo:multiply columns for sorting
									// keywords: field sort direction priority
								}
							}
							
							// pagination
							page = dataLoadParams.page;
							pagesize = dataLoadParams.pagesize;
							if(angular.isDefined(page)) {
								options.dataLoadParams.page = dataLoadParams.page;
							}
							if(angular.isDefined(pagesize)) {
								options.dataLoadParams.pagesize = dataLoadParams.pagesize;
							}
							
							// others
						}
						
						// Don't use dataLoadParams for extending because of irrelevent params
						params = angular.extend({}, options.dataLoadParams);

						DataService.postData(options.gridUserOptions.url, params)
							.then(function(data) {
								var pageInfo = {
									count: 34,
									page: 1, 
									pagesize: 10
								};
								data.pageInfo = angular.isDefined(data.pageInfo) ? data.pageInfo : pageInfo;
								var gridData = angular.isDefined(data.obj) ? data.obj : data;

								options.gridOptions.totalItems = data.pageInfo.count;

								options.allData = gridData;
								options.gridOptions.data = gridData;
							}, function(msg) {
								console.error(msg);
							});
					};
					
					// todo:列操作方法
					this._cellOperation = function() {};

					// ui-grid-pagination ui-grid-selection
					this._init = function() {
						i18nService.setCurrentLang('zh-cn');
						
						var $grid = $element.find('.grid-instance'),
							options = $scope.options,
//								= {
//									isSingleFilter: true,
//									pagination: true,
//									isAllowSelection: true,
//									isShowOperationBtns: true,
//								},
							vm = $scope.vm;

						options.allData = [];

						// gridUserOptions for 'user config options'
						options.gridUserOptions = $scope.getGridUserOptions();
						// conowGridClass instance to hold default class and some public methods
						options.conowGridInstance = new conowGridClass();
						options.gridDefaultOptions = options.conowGridInstance.getDefaultOptions();
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
						
						// cell operation
						var columnDefs = options.gridUserOptions.columnDefs,
							columnDef = null;
						for(var i=0, iLen=columnDefs.length;  i<iLen; i++) {
							columnDef = columnDefs[i];
							if(angular.isDefined(columnDef.cellType) && columnDef.cellType === 'operation') {								
								columnDef.cellClass = angular.isUndefined(columnDef.cellClass) ? 'conow-grid-operation-cell' : columnDef.cellClass + ' conow-grid-operation-cell';
								columnDef.enableSorting = false;
							}
						}

						// single filter
						var singleFilter = options.gridUserOptions.singleFilter;
						if(angular.isDefined(singleFilter) && singleFilter === false) {
							options.isSingleFilter = false;
						}
						var pagination = options.gridUserOptions.pagination;
						if(angular.isDefined(pagination) && pagination === false) {
							options.pagination = false;
						}
						// todo:动态编译指令 'ui-grid-pagination' 和 'ui-grid-selection'
						// if(options.pagination) {
						// 	$grid.attr('ui-grid-pagination', '').attr('ui-grid-selection', '');

						// 	$compile($grid)($scope);
						// }
						
						// selection
						var tmpOptions = {};
						var select = options.gridUserOptions.select;
						if(angular.isUndefined(select)) {
							tmpOptions = { 
								enableRowSelection: false, 
								enableRowHeaderSelection: false
							};
							// options.isAllowSelection = false;
						} else if(select === 'single') {
							tmpOptions = { 
								enableRowSelection: true, 
								multiSelect: false, 
								enableSelectAll: false 
							};
						} else {
							tmpOptions = { 
								enableRowSelection: true, 
								multiSelect: true, 
								enableSelectAll: true
							};
						}
						angular.extend(options.gridInitOptions, tmpOptions);

						// footer
						var showColumnFooter = options.gridUserOptions.showColumnFooter;
						if(angular.isDefined(showColumnFooter) && showColumnFooter !== false) {
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
								if(sortColumns.length == 0) {
//									options.gridPaginationOptions.sort = null;
									options.gridPaginationOptions.sortColumns = null;
								} else {
//									options.gridPaginationOptions.sort = sortColumns[0].sort.direction;
									options.gridPaginationOptions.sortColumns = sortColumns;
								}
								
								options.gridApi.pagination.seek(1);
								
								self._getPageData({ 'sortColumns': options.gridPaginationOptions.sortColumns, page: 1 });
							});
							// 切换页码触发事件
							gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
								options.gridPaginationOptions.pageNumber = newPage;
								options.gridPaginationOptions.pageSize = pageSize;
								
								self._getPageData({ page: newPage, pagesize: pageSize});
							});
							// cellNav navigate 触发事件
//							gridApi.cellNav.on.navigate($scope, function(newRowCol, oldRowCol) {
//								console.log('in cellNav navigation...')
//								console.log(newRowCol);
//								console.log(oldRowCol);
//							})
						};

						if(angular.isDefined(options.gridUserOptions.url)) {
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

					var vm = scope.vm;
					var options = scope.options;


					// watch for single-filter
					// todo: 暂时是过滤所有数据中的所有字段，需要修改为过滤页面显示字段或者指定字段
					if(options.isSingleFilter) {
						scope.$watch('vm.singleFilterText', 
							function(newVal) {
								if(!options.isServerPage) {
									var firstRow = (options.gridPaginationOptions.pageNumber - 1) * options.gridPaginationOptions.pageSize;
									options.gridOptions.data = options.allData.slice(firstRow, firstRow + options.gridPaginationOptions.pageSize);
									options.gridOptions.data = $filter('filter')(options.allData, vm.singleFilterText).slice(firstRow, firstRow + options.gridPaginationOptions.pageSize);
								} else {
									options.gridApi.pagination.seek(1);
									
									scope.reload({ singleFilterText: vm.singleFilterText, page: 1 });
								}								
							});
					}
					
					// watch for advanced search
					if(options.gridUserOptions && options.gridUserOptions.filterOptions) {
						scope.$watch('options.gridUserOptions.filterOptions.adSearch', 
							function(newVal, oldVal) {
								options.gridApi.pagination.seek(1);
								
								scope.reload({ adSearch: options.gridUserOptions.filterOptions, page: 1 });
							}, true);	
					}					
					
					//
					scope.getSelectedRows = function() {
						var selectedRows = options.gridApi.selection.getSelectedRows();
						// alert(JSON.stringify(selectedRows));
						alert(selectedRows.length)
					};
					
					// bind userOptions functions on grid 
					angular.forEach(options.gridUserOptions, function(value, key) {
						if(angular.isFunction(value)) {
							scope[key] = value;
						}
					});
					
					scope.getCurrentCell = function() {
						var rowCol = options.gridApi.cellNav.getFocusedCell();
						var currentSelection = options.gridApi.cellNav.getCurrentSelection();
						if(rowCol.row.entity) {
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
				selectionRowHeaderWidth: 35, 
				// pagination
//				paginationPageSizes: [10, 25, 50, 75],
				paginationPageSizes: [],
				paginationPageSize: 10,
				// selection
				// enableRowSelection: true,
				// enableSelectAll: true,
				// multiSelect: true,
				// enableRowHeaderSelection: true,
			};
			
			/**
			 * default options setting goes here
			 * */
			this.getDefaultOptions = function() {
				return defaultOptions;
			};
			
			this.reload = function() {
				// 
			};
		};

		return conowGridClass;
	}
]);