'use strict';

app.controller('countrySelDemoCtrl', ['$scope', 
	function($scope) {
		// 
		var vm = $scope.vm = {
			titles: ['大洲', '国家'],
			url: 'views/components/conow-country-sel/data/IC_COUNTRY.json',
			sel: '103'
		};
	}
]);