'use strict';

app.controller('delaySearchCtrl', ['$scope', '$timeout', 
	function($scope, $timeout) {
		//
		var searchDelay = null;

		$scope.requery = function(searchKey) {
			console.log('searchKey-->', searchKey);
		};

		$scope.updateSearch = function() {
			console.log('in updateSearch');
			if(searchDelay) {
				$timeout.cancel(searchDelay);
			}

			searchDelay = $timeout(function() {
				$scope.requery($scope.search);
			}, 300)
		};

		// 
		$scope.delayedSearch = function(search) {
			console.log('search in directive-->', search);
		}

		$scope.changeTest = function() {
			console.log('str-->', $scope.searchStr);
		};

	}
])