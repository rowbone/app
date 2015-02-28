'use strict';

app.controller('SimpleFormCtrl', ['$scope', function($scope) {
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
}])