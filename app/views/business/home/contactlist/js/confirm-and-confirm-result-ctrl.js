'use strict';

app.controller('ConfirmCtrl', ['$scope', '$modalInstance', 'modalParams', '$modal', '$timeout', 
	function($scope, $modalInstance, modalParams, $modal, $timeout) {
		$scope.entity = modalParams.user;
		var options = $scope.options = {
			strType: modalParams.strType
		};
		$scope.confirm = function() {
			$modalInstance.close('confirm');
		};

		$scope.cancel = function() {
			$modalInstance.close('cancel');
		};

		$scope.close = function() {
			$modalInstance.close('close');
		};
	}
]);

app.controller('ConfirmResultCtrl', ['$scope', '$modalInstance', 'modalParams',
	function($scope, $modalInstance, modalParams){
		$scope.entity = modalParams.user;
		$scope.strType = modalParams.strType;
	}
]);