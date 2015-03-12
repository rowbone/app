'use strict';

app.controller('SigninFormCtrl', ['$scope', '$http', '$state', '$rootScope',
	function($scope, $http, $state, $rootScope){
		$scope.user = {};

		$scope.login = function(user) {
			console.log('login');
			console.log(user)

			// get data from server
			$http.post('users/signin', { 'data': user})
				.success(function(data) {
					// 
					console.log(data);
					if(data.status == 1) {
						console.log('登录成功！');
						var objData = data.data;
						var cookie = {
							'userName': objData.userName,
							'password': objData.password
						}
						document.cookie = JSON.stringify(cookie);
						$rootScope.currentUserInfo = objData;
						$state.go('app.home');
					}
				})
				.error(function(data) {
					// 
					console.log('error');
				});
				
			/* 
			// get local data
			$http.get('data/base/login/signin.json')
				.success(function(data) {
					// 
					console.log(data);
					var iLen = data.length ? data.length : 0;
					if(iLen < 0) {
						console.log('还没有保存用户信息！');
					}
					for(var i=0; i<iLen; i++) {
						if(data[i].userName == user['userName'] && data[i].password == user.password) {
							console.log('验证通过！');
							break;
						} else {
							console.log('验证失败!')
						}
					}
				})
				.error(function(data) {
					// 
					console.log('获取用户信息出错！');
				});
				*/
		};
	}])