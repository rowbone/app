'use strict';

app.directive('myDirect', ['$filter', 
	function($filter) {
		return {
			templateUrl: 'views/demo/test/tpls/my-direct.html',
			link: function(scope, elem, attrs) {
				console.log('in my-direct linking...');
			}
		}
	}
]);

// app.directive('MyDirect', ['$filter', 
// 	function($filter) {
// 		// Runs during compile
// 		return {
// 			// name: '',
// 			// priority: 1,
// 			// terminal: true,
// 			// scope: {}, // {} = isolate, true = child, false/undefined = no change
// 			// controller: function($scope, $element, $attrs, $transclude) {},
// 			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
// 			// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
// 			// template: '',
// 			// templateUrl: '',
// 			// replace: true,
// 			// transclude: true,
// 			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
// 			link: function($scope, iElm, iAttrs, controller) {
				
// 			}
// 		};
// 	}
// ]);
