'use strict';

app.directive('conowDelaySearch', ['$filter', 
	function($filter) {
		restrict: 'AE',
		template: '<input type="text" ng-model="searchText" ng-keyup="inputKeyUp()" ng-keydown="inputKeyDown()">',
		compile: function()
	}
]);