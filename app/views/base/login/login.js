'use strict';

app.controller('loginFormCtrl', ['$scope', '$http', '$state', '$rootScope',
	function($scope, $http, $state, $rootScope) {
		$scope.entity = {};

		$scope.login = function(user) {
			console.log(user);
			$post('/')
		}
	}
]);