'use strict';

app.controller('contactListCtrl2', ['$scope', 
	function($scope) {
		$scope.collections = {
			person: [],
			org: []
		};
	}
])