'use strict';

app.controller('StaffInfoCtrl', ['$scope', '$stateParams', '$http', 
	function($scope, $stateParams, $http){
		console.log($stateParams);
		var entity = $scope.entity = {};
		entity.color = 'blue';
		var urlStaffInfo = 'data/bz/home/contactlist2/staffInfo-queryStaffInfoAndTotalnameAndJobs-ID-1422945768950299610293279.json';
		$http.get(urlStaffInfo)
			.success(function(data, status, headers, config) {
				console.log(data);
				$scope.entity = data.obj;
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + urlStaffInfo + ' wrong...');
			})

		// 返回
		$scope.goBack = function() {
			// history.back();
			// $scope.$apply();
		};
	}
]);