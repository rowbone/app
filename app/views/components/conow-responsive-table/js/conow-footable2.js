'use strict';

app.directive('conowFootable2', ['ngTableParams', 
	function(ngTableParams) {
		return {
			restrict: 'A',
			templateUrl: 'views/components/conow-responsive-table/tpls/conow-footable2-tpl.html',
			scope: {
				bindClick: '&'
			},
			link: function(scope, elem, attrs, ctrl) {
				console.log('in linking...');

				// 
			}
		}
	}
]);