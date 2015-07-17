'use strict';

app.controller('cascadeSelectDemoCtrl', ['$scope', 'DataService', 'cascadeSelectService', 
	function($scope, DataService, cascadeSelectService) {

		var vm = $scope.vm = {
			titles: ['级别1', '级别2', '级别3'],
			sel: '6102',
			// url: '/service/common!queryOptions?type=DICT_LEVEL&DICT_CODE=HR_RETIRED_ARMY_RANK'
			url: 'views/components/conow-cascade-select/data/service-common-queryOptions-type-DICT_OPTION_LEVEL&DICT_CODE-HR_RETIRED_ARMY_RANK2.json'
		};

		var urlSelected = 'views/components/conow-cascade-select/data/selected.json';
		DataService.getData(urlSelected)
			.then(function(data) {
				$scope.sel = data;
			}, function(msg) {
				console.error('msg-->', msg);
			});
			
	}
]);
