'use strict';

angular.module('app.directives', ['ui.router'])
	.run(['$rootScope', '$state', '$stateParams', 
		function($rootScope, $state, $stateParams) {
			//
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
		}])
	.config(['$urlRouterProvider', '$stateProvider', 
		function($urlRouterProvider, $stateProvider) {
			// 
			$stateProvider
				.state('app.directives', {
					abstract: true,
					url: '/directives',
					template: '<div ui-view></div>'
				})
				.state('app.directives.btnsGroup', {
					url: '/btnsGroup',
					templateUrl: 'views/demo/directives/btnsGroup.html',
					resolve: {
						deps: ['uiLoad', 
							function(uiLoad) {
								return uiLoad.load(['views/demo/directives/btnsGroup.js']);
							}
						]
					}
				})
				.state('app.directives.customDirectives', {
					url: '/customDirectives',
					templateUrl: 'views/demo/directives/customDirectives.html',
					resolve: {
						deps: ['uiLoad', 
							function(uiLoad) {
								return uiLoad.load(['views/demo/directives/customDirectives.js',
									'views/demo/directives/customDirectives.css']);
							}
						]
					}
				})
		}
	])