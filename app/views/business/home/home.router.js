'use strict';

angular.module('app.home', ['ui.router'])
	.run(['$rootScope', '$state', '$stateParams', 
		function($rootScope, $state, $stateParams) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
		}
	])
	.config(['$stateProvider', '$urlRouterProvider', 
		function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('app.home', {
					abstract: true, 
					url: '/home',
					template: '<div ui-view></div>'
				})
				.state('app.home.contactlist', {
					url: '/contactlist',
					templateUrl: 'views/business/home/contactlist/contact_list_phone.html',
					resolve: {
						deps: [ 'uiLoad', 
							function(uiLoad) {
								return uiLoad.load(['views/business/form/simpleForm.js']);
							}
						]
					}
				})

	}]);