'use strict';

angular.module('demoApp')
	.run(['$rootScope', '$state', '$stateParams', 
		function($rootScope, $state, $stateParams) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
		}
	])
	.config(function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider
			.otherwise('/access/signin');
		$stateProvider
			// .state('login', {
			// 	url: '/login',
			// 	templateUrl: 'views/base/login/login.html',
			// 	resolve: {

			// 	}
			// })
			.state('access', {
				url: '/access',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('access.signin', {
				url: '/signin',
				templateUrl: 'views/base/login/signin.html'
				// 这里加上resolve方法页面模板不加载，原因待查！
				// 2015年2月5日17:56:10
				// ,
				// resolve: {
				// 	deps: ['uiLoad', 
				// 		function(uiLoad) {
				// 			return uiLoad.load(['views/base/login/signin.js']);
				// 		}
				// 	]
				// }
			})
			.state('access.login', {
				url: '/login',
				templateUrl: 'views/base/login/login.html',
				resolve: {
					deps: ['uiLoad', 
						function(uiLoad) {
							return uiLoad.load(['views/base/login/login.js']);
						}
					]
				}
			})
			.state('app', {
				abstract: true,
				url: '/app',
				templateUrl: 'views/business/app.html'
				// $ocLazyLoad 的用法
				// ,
				// resolve: {
				// 	deps: ['$ocLazyLoad', 'uiLoad', 
				// 	function($ocLazyLoad, uiLoad) {
				// 		return uiLoad.load(
				// 				['...']
				// 			).then(function() {
				// 							return $ocLazyLoad.load(['']);
				// 						}
				// 			)
				// 	}]
				// }
			})
			// .state('app.home', {
			// 	url: 'home',
			// 	temp
			// })
		}
	);