'use strict';
/*
	resource:
	http://stackoverflow.com/questions/21121460/angular-directive-encapsulating-a-delay-for-ng-change
	https://github.com/brentvatne/angular-delay
	http://stackoverflow.com/questions/15304562/how-to-put-a-delay-on-angularjs-instant-search
	https://github.com/angular-ui/bootstrap/issues/1680
	http://stackoverflow.com/questions/1909441/jquery-keyup-delay
*/

// app.directive('conowDelaySearch', ['$timeout', 
// 	function($timeout) {
// 		return {
// 			restrict: 'AE',
// 			replace: true,
// 			template: '<input type="text" ng-model="search" ng-change="modelChanged($event)">',
// 			scope: {
// 				delayedMethod: '&delayedSearch'
// 			},
// 			link: function($scope, elem, attrs) {
// 				$scope.modelChanged = function() {
// 					$timeout(function() {
// 						if($scope.lastSearch != $scope.search) {
// 							if($scope.delayedMethod) {
// 								$scope.lastSearch = $scope.search;

// 								$scope.delayedMethod({ search: $scope.search });
// 							}
// 						}
// 					}, 300);

// 				};

// 			}
// 		}
// 	}
// ]);

app.directive('conowDelaySearch', ['$timeout', 
	function ($timeout) {
		return {
			restrict: 'A',
			template: '<input type="text" ng-model="ngModel">',
			scope: {
				ngModel: '=',
				delayedMethod: '&delayedSearch'
			},
			link: function (scope, iElement, iAttrs) {
				var timer = false;

				scope.$watch('ngModel', function(newVal, oldVal) {
					if(timer) {
						$timeout.cancel(timer);
					}

					timer = $timeout(function() {
						var $input = iElement.find('input');
						if(scope.lastSearch != $input.val()) {
							if(angular.isFunction(scope.delayedMethod)) {
								scope.lastSearch = $input.val();

								scope.delayedMethod({ 'search': $input.val()});
							}
						}
						
					}, 500);
				});

			}
		};
	}
])