'use strict';

app.controller('cascadeSelectDemoCtrl', ['$scope', 'DataService', 'cascadeSelectService', 
	function($scope, DataService, cascadeSelectService) {
		$scope.titles = ['级别1', '级别2', '级别3'];

		var entity = $scope.entity = {
			sel: '6102'
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
