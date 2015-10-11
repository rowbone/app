
angular.module('demoApp')
	.directive('conowGrid', ['conowGridClass', '$filter', 'DataService', 
		function(conowGridClass, $filter, DataService) {
			return {
				restrict: 'A',
				// template: '<div id="grid1" ui-grid="vm.gridOptions" class="grid"></div>',
				templateUrl: 'views/components/conow-responsive-table/tpls/conow-grid-tpl.html',
				link: function(scope, elem, attrs) {
					var vm = scope.vm = {};
					var options = scope.options = {
						isSingleFilter: true
					};

					var conowGridService = new conowGridClass();

					var initOptions = {
						filteredData: null
					};
					var userOptions = scope.$eval(attrs.conowGrid);

					if(userOptions.singleFilter) {
						initOptions.filterOptions = scope.filterOptions;
					}

					vm.gridOptions = angular.extend({}, 
						conowGridService.getDefaultOptions(), userOptions, initOptions);

					if(angular.isDefined(vm.gridOptions.paginationPageSizes) 
						|| angular.isDefined(vm.gridOptions.paginationPageSize)) {
						options.pagination = true;
					}

					scope.filterOptions = {
						filterText: ''
					};

					var _init = function() {
						if(angular.isDefined(userOptions.url)) {
							DataService.getData(userOptions.url)
								.then(function(data) {
									vm.allData = data;
									vm.gridOptions.data = data;
								}, function(msg) {
									console.error(msg);
								});
						}
					};

					// params or data initiation
					_init();

					// watch for single-filter
					scope.$watch('filterOptions.filterText', 
						function(newVal) {
							vm.gridOptions.data = $filter('filter')(vm.allData, scope.filterOptions.filterText);
						});

				}
			}
		}
	]);

app.factory('conowGridClass', [
	function() {
		function conowGridClass() {
			var defaultOptions = {
				selectionRowHeaderWidth: 35, 
				paginationPageSizes: [10, 25, 50, 75],
				paginationPageSize: 10
			};

			this.getDefaultOptions = function() {
				return defaultOptions;
			};
		};

		return conowGridClass;
	}
]);