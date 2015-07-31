'use strict';

app.controller('countryCascadeSelDemoCtrl', ['$scope', '$stateParams',
	function($scope, $stateParams) {
		// 
		// console.log('$stateParams-->', $stateParams);

		var vm = $scope.vm = {
			sel: '208'
		};
	}
]);

app.controller('countrySelDemoCtrl', ['$scope', 
	function($scope) {
		// 
		var vm = $scope.vm = {
			sel: ''
		};
	}
]);