
angular.module('demoApp')
	.directive('conowGrid', ['conowGridClass', '$filter', 
		function(conowGridClass, $filter) {
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
					} else {
						options.isSingleFilter = false;
					}

					vm.gridOptions = angular.extend({}, 
						conowGridService.getDefaultOptions(), userOptions, initOptions);

					scope.filterOptions = {
						filterText: ''
					};

					// watch for single-filter
					scope.$watch('filterOptions.filterText', 
						function(newVal) {
							initOptions.data = $filter('filter')(userOptions.data, scope.filterOptions.filterText);

							vm.gridOptions = angular.extend({}, 
								conowGridService.getDefaultOptions(), userOptions, initOptions);
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
				paginationPageSizes: [25, 50, 75],
				paginationPageSize: 25
			};

			this.getDefaultOptions = function() {
				return defaultOptions;
			};
		};

		return conowGridClass;
	}
]);