'use strict';

app.controller('DemoDirectiveCtrl', ['$scope', 
	function($scope) {
		$scope.user = {
			name: 'Naomi',
			address: '1600 Amphitheatre'
		};
	}
]);