/**
 * conow-ng-table
 * @description: conow responsive table
 */

(function() {
	/**
	 * module: ngTable
	 */
	angular.module('ngTable', []);
})();

(function() {
	angular.module('ngTable')
		.factory('ngTableParams', [function(){
			var ngTableParams = {};

			return ngTableParams;
		}])
})();

(function() {
	angular.module('ngTable')
		.directive('ngTable', ['$compile', 
			function($compile) {
				return {
					restrict: 'A',
					templateUrl: 'views/components/conow-responsive-table/tpls/common.html',
					controller: 'ngTableCtrl',
					controllerAs: 'ctrl',
					scope: {
						params: '=ngTable'
					},
					compile: function(tElement, tAttrs) {
						// 
						return function(scope, element, attrs, ctrl, transclude) {
							console.log('111111');

							ctrl.init();
						}
					}
				}
			}
		]);
})();

(function() {
	angular.module('ngTable')
		.controller('ngTableCtrl', ['$scope', '$element', '$attrs', '$compile', 
			function($scope, $element, $attrs, $compile) {
				
				this.init = function() {
					console.log('111');
					console.log($element);
					console.log($attrs);
				};
			}
		]);
})();