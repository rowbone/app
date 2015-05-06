'use strict';

angular.module('app.hr', ['ui.router'])
	.run(['$rootScope', '$state', '$stateParams', 
		function($rootScope, $state, $stateParams) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
		}
	])
	.config(['$stateProvider', '$urlRouterProvider', 
		function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('app.hr', {
					abstract: true, 
					url: '/hr',
					template: '<div ui-view></div>'
				})
				.state('app.hr.orgInfo', {
					url: '/orgInfo/{orgId:[0-9]{0,30}}',
					templateUrl: 'views/business/hr/org/orgInfo.html',
					resolve: {
						deps: [ 'uiLoad', 
							function(uiLoad) {
								return uiLoad.load(['views/business/form/simpleForm.js']);
							}
						]
					}
				})
				.state('app.hr.staffInfo', {
					url: '/staffInfo/{staffId:[0-9]{0,30}}',
					templateUrl: 'views/business/hr/staff/staffInfo.html'
				})

	}]);