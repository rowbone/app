
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
									'plugins/sweetalert/sweet-alert.css',
									'views/business/form/commitEffectForm.js'
								]);
							}
						]
					}
				})
				.state('app.form.validatorForm', {
					url: '/validatorForm',
					templateUrl: 'views/business/form/validatorForm.html',
					resolve: {
						deps: [ 'uiLoad', 
							function(uiLoad) {
								return uiLoad.load([
									'views/business/form/validatorForm.js',
									'views/business/form/validateForm.css'
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
				.state('app.form.dialog', {
					url: '/dialog',
					templateUrl: 'views/business/form/dialog.html',
					resolve: {
						deps: ['uiLoad', 
							function(uiLoad) {
								return uiLoad.load([
									'vendor/ngDialog/css/ngDialog.css',
									'vendor/ngDialog/css/ngDialog-theme-default.css',
									'vendor/ngDialog/css/ngDialog-theme-plain.css',
									'vendor/ngDialog/js/ngDialog.js',
									'views/business/form/dialog.js',
								]);
							}
						]
					}
				})
	}])