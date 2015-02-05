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
			.state('app', {
				abstract: true,
				templateUrl: 'views/business/app.html'
			})
		}
	);