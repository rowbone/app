'use strict';

(function() {
	app.controller('conowPaginationDemoCtrl', ['$scope', 
		function($scope) {
			var options = $scope.options = { 
				totalItems: 192,
				onChangeFn: function() {
					console.log('in onChangeFn')
				}
			};

		}
	])
})();