'use strict';

app.controller('SimpleFormCtrl', ['$scope', 'ClickService', function($scope, ClickService) {
	// 
	$scope.save = function() {
		console.log('SimpleFormCtrl save');
	};

	$scope.submit = function() {
		console.log('SimpleFormCtrl submit');
	};

	$scope.userNameCheck = function() {
		console.log('checking...');
	};

	$scope.showServiceInfo = function() {
		console.log(ClickService.properties)
	};
}])