// 'use strict';

angular.module('uiRouterSample', [
		'uiRouterSample.contacts',
		// 'uiRouterSample.contacts.service',
		// 'uiRouterSample.utils.service',
		'ui.router',
		'ngAnimate'
	])
	.run(['$rootScope', '$state', '$stateParam',
		function($rootScope, $state, $stateParam) {
			$rootScope.$state = $state;
			$rootScope.$stateParam = $stateParam;
		}]);
	.config(['$stateProvider', '$urlRouterProvider', 
		function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider
				.when('/c?id', '/contacts/:id')
				.when('/user/:id', '/contacts/:id')
				.otherwise('/');

			$stateProvider
				.state('home', {
					url: '/',
					template: '<p class="lead">Welcome to the UI-Router Demo</p>' + 
						'<p>use the menu above to navigate.' + 
						'Pay attention to the <code>$state</code> and <code>$stateParam</code> values below.</p>' + 
						'<p>Click these links-<a href="#/c?id=1">Alice</a> or ' + 
						'<a href="#/user/42">Bob</a>-to see a url redirect in action.</p>'
				})
				.state('about', {
					url: '/about',
					templateProvider: ['timeout', function($timeout) {
						return $timeout(function() {
							return '<p class="lead">UI-Router Resource</p><ul>' + 
								'<li><a href="http://github.com/angular-ui/ui-router/tree/master/sample">Source for this sample</a></li>' +  
								'<li><a href="http://github.com/angular-ui/ui-router">Github Main Page</a></li>' +  
								'<li><a href="http://github.com/angular-ui/ui-router#quick-start">Quick Start</a></li>' +  
								'<li><a href="http://github.com/angular-ui/ui-router/wiki">In-Depth Guide</a></li>' +  
								'<li><a href="http://github.com/angular-ui/ui-router/wiki/Quick-Reference">API Reference</a></li>' +  
								'</ul>';
						}, 100);
					}]
				})
		}]);