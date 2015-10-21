'use strct';

(function() {
	app.directive('conowPagination', [
		function() {
			return {
				restrict: 'AE',
				templateUrl: 'views/components/conow-pagination/tpls/conow-pagination-tpl.html',
				scope: {
					getConowPaginationOptions: '&conowPagination'
				},
				controller: function($scope, $element, $attrs) {
					// 
				},
				link: function(scope, elem, attrs) {
					var defaultOptions = {
						currentPage: 1,
						pageSize: 10,
						directionLinks: true,			// Whether to display Previous / Next buttons.
						boundaryLinks: false,			// Whether to display First / Last buttons
						previousText: '< 上一页',
						nextText: '下一页 >',
						// templateUrl: 'template/pagination/conow-pagination.html'
						templateUrl: 'views/components/conow-pagination/tpls/conow-pagination.html',
						maxSize: 7
					}

					var conowPaginationOptions = scope.$eval(attrs.conowPagination);

					var options = scope.options = scope.getConowPaginationOptions();

					angular.extend(options, defaultOptions);
				}
			}
		}
	]);
})();
