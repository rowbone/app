'use strct';

(function() {
	app.directive('conowPagination', [
		function() {
			return {
				restrict: 'AE',
				templateUrl: 'views/components/conow-pagination/tpls/conow-pagination-tpl.html',
				// templateUrl: 'js/directives/conow-pagination/tpls/conow-pagination-tpl.html',
				scope: {
					getConowPaginationOptions: '&conowPagination',
					currentPage: '='
				},
				controller: function($scope, $element, $attrs) {
					// 
				},
				link: function(scope, elem, attrs) {
					var defaultOptions = {
						currentPage: 1,
						pageSize: 10,
						directionLinks: true,			// Whether to display Previous / Next buttons.
						boundaryLinks: true,			// Whether to display First / Last buttons
						previousText: '<',
						nextText: '>',
						// templateUrl: 'template/pagination/conow-pagination.html'
						templateUrl: 'views/components/conow-pagination/tpls/conow-pagination.html',
						maxSize: 5
					}

					var conowPaginationOptions = scope.conowPaginationOptions = scope.getConowPaginationOptions(),
						options = scope.options = angular.extend({}, defaultOptions, conowPaginationOptions);					
					
					// 外部修改当前页(主要用于重置当前页码为首页 - 搜索时，等情况下)
					scope.$watch('conowPaginationOptions.currentPage', 
							function(newVal, oldVal) {
								options.currentPage = newVal;
							});
					
					// 设置数据总数，触发重新分页(主要用于后台数据加载完成时)
					scope.$watch('conowPaginationOptions.totalItems', 
						function(newVal, oldVal) {
							options.totalItems = newVal;
						});
				}
			}
		}
	]);
})();
