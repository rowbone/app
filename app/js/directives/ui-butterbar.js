angular.module('demoApp')
	.directive('uiButterbar', ['$rootScope', '$anchorScroll', function($rootScope, $anchorScroll) {
		return {
			restrict: 'AC',
			template: '<span class="bar"></span>',
			link: function(scope, el, attrs) {
				el.addClass('butterbar hide');
				scope.$on('$stateChangeStart', function(event) {
					$anchorScroll();
					el.removeClass('hide').addClass('active');
				});

				scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
					event.targetScope.$watch('$viewContentLoaded', function() {
						el.addClass('hide').removeClass('active');
					})
				});

			}
		};
	}])
	.directive('titleBar', function() {
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			templateUrl: 'views/base/titlebar.html',
			link: function(scope, el, attrs) {console.log(attrs.name);
				scope.titile = attrs.name;

				scope.goBack = function goBack() {
					history.back();
					scope.$apply();
				}
			}
		}
	});