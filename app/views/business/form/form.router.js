'use strict';

angular.module('app.form', ['ui.router'])
	.run(['$rootScope', '$state', '$stateParams', 
		function($rootScope, $state, $stateParams) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
		}
	])
	.config(['$stateProvider', '$urlRouterProvider', 
		function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('app.form', {
					abstract: true, 
					url: '/form',
					template: '<div ui-view></div>'
				})
				.state('app.form.simpleForm', {
					url: '/simpleForm',
					views: {
						'': {
							templateUrl: 'views/business/form/simpleForm.html'
						}
						/*,
						'formBtns@app.form.simpleForm': {
							templateUrl: 'views/business/form/formBtns.html'
						}*/
					},
					resolve: {
						deps: [ 'uiLoad', 
							function(uiLoad) {
								return uiLoad.load(['views/business/form/simpleForm.js']);
							}
						]
					}
				})
				.state('app.form.selectForm', {
					url: '/selectForm',
					templateUrl: 'views/business/form/selectForm.html'
					// ,
					// 'formBtns@app.form.selectForm': {
					// 	templateUrl: 'views/business/form/formBtns.html'
					// }
				})
				.state('app.form.commitEffectForm', {
					url: '/commitEffectForm',
					templateUrl: 'views/business/form/commitEffectForm.html',
					resolve: {
						deps: [ 'uiLoad',
							function(uiLoad) {
								return uiLoad.load([
									// 'plugins/sweetalert/sweet-alert.js', 
									// 'plugins/sweetalert/sweet-alert.css',
									'views/business/form/commitEffectForm.js'
								]);
							}
						]
					}
				})
				.state('app.form.formElems', {
					url: '/formElems',
					templateUrl: 'views/business/form/form_elems.html',
					resolve: {
						deps: ['uiLoad', 
							function(uiLoad) {
								return uiLoad.load([
									'js/controllers/form.js'
								]);
							}
						]
					}
				})
				.state('app.form.test', {
					// url: '/test/{id}',
					url: '/test/:id/:abc',
					templateUrl: 'views/business/form/test.html',
					controller: 'TestCtrl'
				})
				// .state('app.form.test', {
				// 	// url: '/test/{id}',
				// 	url: '/test/:id/:abc',
				// 	templateUrl: 'views/business/form/test.html',
				// 	controller: 'TestCtrl'
				// })
				.state('app.form.tripReq', {
					url: '/tripReq',
					templateUrl: 'views/business/form/tripReq.html'
				})

	}]);

app.controller('TestCtrl', ['$scope', '$stateParams',
	function($scope, $stateParams) {
		// 
		console.log($stateParams);
		console.log($stateParams.id);
	}
]);

app.controller('SelectFormCtrl', ['$scope', '$state',
	function($scope, $state) {
		$scope.test = function() {
			$state.go('app.form.test', {id:"abc", abc:"111"})
		};
	}
])