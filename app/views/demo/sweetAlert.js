'use strict';

app.controller('SweetAlertCtrl', ['$scope', 'SweetAlert', 
	function($scope, SweetAlert){
		$scope.showAlert = function() {
			SweetAlert.swal('alert msg');
		}
	}
])