'use strict';

angular.module('app.angular', ['ui.router'])
	.run(['$rootScope', '$state', '$stateParams', 
		function($rootScope, $state, $stateParams) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
		}
	])
	.config(['$stateProvider', '$urlRouterProvider', 
		function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('app.angular', {
					abstract: true,
					url: '/angular',
					template: '<div ui-view></div>'
				})
				.state('app.angular.ctrlDataShare', {
					url: '/ctrlDataShare',
					templateUrl: 'views/angular/ctrlDataShare.html',
					resolve: {
						deps: [ 'uiLoad', 
							function(uiLoad) {
								return uiLoad.load(['views/angular/ctrlDataShare.js']);
							}
						]
					}
				})
		}
	])