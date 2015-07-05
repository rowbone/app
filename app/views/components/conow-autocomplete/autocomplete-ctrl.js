'use strict';

app.controller('autocompleteCtrl', ['$scope', 'DataService', 
	function ($scope, DataService) {
		//
		var options = $scope.options = {
			listItemsShow: false
		};

		$scope.listItems = [];

		$scope.showOptions = function() {
			var url = 'views/components/conow-autocomplete/data/list-items.json';
			DataService.getData(url)
				.then(function(data) {
					console.log(data);

					$scope.listItems = data;
					options.listItemsShow = true;
				}, function(msg) {
					console.error('msg-->', msg);
				});
		};

	}
]);