'use strict';

app.directive('conowListItems', ['DataService', 
	function(DataService) {
		return {
			restrict: 'EA',
			transclude: true,
			templateUrl: 'views/components/conow-list-items/tpls/list-items.html',
			link: function(scope, elem, attrs) {
				//
			}
		}
	}]);