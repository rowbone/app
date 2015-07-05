'use strict';

angular.module('app.components', ['ui.router'])
	.run(['$rootScope', '$state', '$stateParams', 
		function($rootScope, $state, $stateParams) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
		}
	])
	.config(['$stateProvider', '$urlRouterProvider', 
		function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('app.components', {
					abstract: true, 
					url: '/components',
					template: '<div ui-view></div>'
				})
				.state('app.components.validator', {
					url: '/validator',
					templateUrl: 'views/components/conow-validator/validator-form.html'
				})
				.state('app.components.validateBeta', {
					url: '/validateBeta',
					templateUrl: 'views/components/conow-validator/validate-beta.html'
				})
				.state('app.components.dialog', {
					url: '/dialog',
					views: {
						'': {
							templateUrl: 'views/components/conow-dialog/dialog.html'
						}
					}
					,
					// resolve: {
					// 	deps: [ 'uiLoad', 
					// 		function(uiLoad) {
					// 			return uiLoad.load(['views/business/form/simpleForm.js']);
					// 		}
					// 	]
					// }
				})
				.state('app.components.area', {
					url: '/area',
					templateUrl: 'views/components/conow-area/area.html'
				})
				.state('app.components.datepicker', {
					url: '/datepicker',
					templateUrl: 'views/components/conow-datepicker/datepicker.html'
				})
				.state('app.components.tabs', {
					url: '/tabs',
					templateUrl: 'views/components/conow-tabs/tabs.html'
				})
				.state('app.components.footable', {
					url: '/footable',
					templateUrl: 'views/components/conow-footable/conow-footable-demo.html'
				})
				.state('app.components.cascadeSel', {
					url: '/cascadeSel',
					templateUrl: 'views/components/conow-cascade-select/cascade-select-demo.html'
				})
				.state('app.components.timeSelect', {
					url: '/timeSelect',
					templateUrl: 'views/components/conow-timeSelect/timeSelectDemo.html'
				})
				.state('app.components.delaySearch', {
					url: '/delaySearch',
					templateUrl: 'views/components/conow-delay-search/delay-search-demo.html'
				})
				.state('app.components.autocomplete', {
					url: '/autocomplete',
					templateUrl: 'views/components/conow-autocomplete/autocomplete-demo.html'
				})

	}]);