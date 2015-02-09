'use strict';

app.controller('CommitEffectFormCtrl', ['$scope', 'SweetAlert', '$http', 
	function($scope, SweetAlert, $http) {
		// 

		var func = function() {
			var user = {
			  "userName" : "hr1",
			  "password" : "hr1"
			}
			$http.post('users/signin', { 'data': $scope.entity})
				.success(function(data) {
					//
					if(data.status === 1) {
						SweetAlert.swal({
							title:"提交结果", 
							text: "提交成功", 
							type: "success", 
							timer: 2000
						});
					} else {
						SweetAlert.swal({
							title:"提交结果", 
							text: "提交失败", 
							type: "error", 
							timer: 2000
						});
					}
				})
				.error(function(data) {
					console.log('error');
					SweetAlert.swal({
						title:"提交结果", 
						text: "提交失败", 
						type: "error", 
						timer: 2000
					});
				})
		}

		$scope.submit = function() {
			// SweetAlert.swal('alert msg');
			// SweetAlert.info('操作提示', '提交中');

			SweetAlert.swal({
				title:"Hello", 
				text: "Just testing", 
				type: "info", 
				timer: 5000
			});
			func();
			// SweetAlert.success('操作提示', '提交中', func);
/*
			SweetAlert.swal({
				title:"Hello", 
				text: "Just testing", 
				type: "info"
				// , 
				// timer: 2000
			}, function(isConfirm) {
				SweetAlert.info('操作提示', '提交中');
			});
			*/
		}
	}
])