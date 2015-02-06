'use strict';

app.controller('loginFormCtrl', ['$scope', '$http', '$state', '$rootScope',
	function($scope, $http, $state, $rootScope) {
		console.log($scope.user)

		$scope.login = function(user) {
			console.log(user);
		}
	}
]);