'use strict';

angular.module('app.demo', ['ui.router'])
	.run(['$rootScope', '$state', '$stateParams', 
		function($rootScope, $state, $stateParams) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
		}
	])
	.config(['$stateProvider', '$urlRouterProvider', 
		function($stateProvider, $urlRouterProvider) {
			//
			$stateProvider
				.state('app.demo', {
					// 
					abstract: true,
					url: '/demo',
					template: '<div ui-view class="fade-in-up"></div>'
				})
				.state('app.demo.bootstrap', {
					url: '/bootstrap',
					templateUrl: 'views/demo/bootstrap.html'
				})
				.state('app.demo.sweetAlert', {
					url: '/sweetAlert',
					templateUrl: 'views/demo/sweetAlert.html'
				})
		}
	])