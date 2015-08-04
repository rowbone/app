'use strict';

app.controller('DemoDirectiveCtrl', ['$scope', 
	function($scope) {
		$scope.user = {
			name: 'Naomi',
			address: '1600 Amphitheatre'
		};
	}
]);

app.controller('nestDirectCtrl', ['$scope', 
	function($scope){
		// 
	}
]);

/**
 * Outer Directive
 */
app.directive('outerDirect', ['DataService', 
	function(DataService) {
		return {
			transclude: true,
			scope: {},
			template: '<div><textarea ng-model="vm.opinion"></textarea><div ng-transclude></div></div>',
			link: function(scope, elem, attrs) {
				console.log('outerDirect link...');
				var vm = scope.vm = {};
			}
		}
	}
]);

/**
 * Inner Directive
 */
app.directive('innerDirect', ['DataService', 
	function(DataService) {
		return {
			template: '<button type="button" class="btn btn-primary" ng-click="confirm11()">111</button>',
			require: 'outerDirect',
			scope: {

			},
			link: function(scope, elem, attrs, outerDirectCtrl) {
				console.log('innerDirect linking...');
				
				scope.confirm11 = function() {
					console.log('confirm');
				};
			}
		}
	}
]);

/**
 * from: http://www.csdn123.com/html/topnews201408/92/6292.htm
 * http://www.angularjs.cn/A0b8
 */
app.directive('myGrid', function() {
	return {
		restrict: 'A',
		scope: {
			height: '@height',
			width: '@width'
		},
		link: function(scope, elem, attrs) {
			//
		}
	};
});

app.directive('myGridRow', function() {
	// 
});