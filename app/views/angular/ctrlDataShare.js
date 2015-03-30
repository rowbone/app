'use strict';

app.service('common', function() {
	this.obj = { number: 3 };
});

app.service('commonBasic', function() {
	this.number = 3;
});

app.controller('ACtrl', ['$scope', 'common', 
	function($scope, common) {
		//
		$scope.count = common.obj;
	}
]);

app.controller('BCtrl', ['$scope', 'common', 
	function($scope, common) {
		$scope.count = common.obj;

		$scope.changeCount = function() {
			common.obj.number = 4;
		};
	}
]);

app.controller('CCtrl', ['$scope', 'commonBasic', 
	function($scope, commonBasic) {
		$scope.count = commonBasic.number;

		// $scope.on('commonchange', function)
	}
])