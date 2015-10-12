'use strict';

angular.module('demoApp')
	.directive('conowGrid', ['conowGridClass', '$filter', 'DataService', '$compile', '$rootScope', 
		function(conowGridClass, $filter, DataService, $compile, $rootScope) {
			return {
				restrict: 'A',
				// template: '<div id="grid1" ui-grid="vm.gridOptions" class="grid"></div>',
				templateUrl: 'views/components/conow-responsive-table/tpls/conow-grid-tpl.html',
				compile: function(tElem, tAttrs) {
					return this.link;
				}, 
				controller: function($scope, $element, $attrs, $transclude) {
					var vm = $scope.vm = {}, 
							options = $scope.options = {
								isSingleFilter: true,
								isPagination: true, 
								isShowOperationBtns: true
							};

					// ui-grid-pagination ui-grid-selection
					var _init = function() {
						var $grid = $element.find('.grid-instance'),
								options = $scope.options = {
									isSingleFilter: true,
									pagination: true,
									isAllowSelection: true,
									isShowOperationBtns: true
								},
								vm = $scope.vm;

						options.allData = [];

						// gridUserOptions for 'user config options'
						options.gridUserOptions = $scope.$eval($attrs.conowGrid);
						// conowGridClass instance to hold default class and some public methods
						options.conowGridInstance = new conowGridClass();
						options.gridDefaultOptions = options.conowGridInstance.getDefaultOptions();
						// gridInitOptions for 'get config options in initialization'
						options.gridInitOptions = {
							filteredData: null,
							singleFilterText: ''
						};

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

						// All grid options
						options.gridOptions = angular.extend({}, 
							options.gridDefaultOptions, options.gridUserOptions, options.gridInitOptions);

						options.gridOptions.onRegisterApi = function(gridApi) {
							options.gridApi = gridApi;
						};

						if(angular.isDefined(options.gridUserOptions.url)) {
							DataService.getData(options.gridUserOptions.url)
								.then(function(data) {
									options.allData = data;
									options.gridOptions.data = data;
								}, function(msg) {
									console.error(msg);
								});
						}
					};

					this.init = function() {
						_init();
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
								options.gridOptions.data = $filter('filter')(options.allData, vm.singleFilterText);
							});
					}

					scope.getSelectedRows = function() {
						var selectedRows = options.gridApi.selection.getSelectedRows();
						// alert(JSON.stringify(selectedRows));
						alert(selectedRows.length)
					};

				}
			}
		}
	]);

app.factory('conowGridClass', [
	function() {
		function conowGridClass() {
			var defaultOptions = {
				selectionRowHeaderWidth: 35, 
				// pagination
				paginationPageSizes: [10, 25, 50, 75],
				paginationPageSize: 10,
				// selection
				// enableRowSelection: true,
				// enableSelectAll: true,
				// multiSelect: true,
				// enableRowHeaderSelection: true,
			};

			this.getDefaultOptions = function() {
				return defaultOptions;
			};
		};

		return conowGridClass;
	}
]);