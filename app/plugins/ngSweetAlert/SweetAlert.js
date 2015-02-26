'use strict';

angular.module('app.ngSweetAlert', [])
	.factory('FormOperation', ['$timeout', '$http', '$state', '$location', '$window',
		function($timeout, $http, $state, $location, $window) {
			var swal = window.swal;

			// 页面重定向方法
			// 注意$location 与 $window.location的使用
			var funcRedirect = function(redirect) {
				if(typeof redirect == 'undefined') {
					return;
				}
				if(typeof redirect == 'string') {
					$window.location.href = $location.path(redirect).absUrl();
				} else {
					if(redirect.state) {
						$state.go(redirect.state);
					} else if(redirect.url) {
						$window.location.href = $location.path(redirect).absUrl();
					} else {
						console.log('Redirect params error...');
					}
				}
			};

			// public methods
			var self = {
				swal: function(arg1, arg2, arg3) {
					$timeout(function() {
						if(typeof(arg2) === 'function') {
							swal(arg1, function(isConfirm) {
								$timeout(function() {
									arg2(isConfirm);
								});
							}, arg3);
						} else {
							swal(arg1, arg2, arg3);
						}
					}, 200);
				},
				success: function(title, message, func) {
					$timeout(function() {
						swal(title, message, 'success');
					}, 200);
				},
				error: function(title, message, func) {
					$timeout(function() {
						swal(title, message, 'error');
					}, 200);
				},
				warning: function(title, message) {
					$timeout(function() {
						swal(title, message, 'warning');
					}, 200);
				},
				info: function(title, message) {
					$timeout(function() {
						swal(title, message, 'info');
					}, 200);
				},
				/*
				 * add by wlj		-- 2015-2-10 15:02:18
				 * params:
				 * actionType: GET/POST
				 * actionUrl: 服务器拦截地址
				 * actionData[optional]：需要提交的数据
				 * redirect[optional]：操作成功的跳转地址。可以为string类型或者{state:'', url:''}的object类型
				 *					 string类型时为相对地址；object类型时先读取state提供的参数。
				 */
				save: function(actionType, actionUrl, actionData, redirect) {
					// this.info('操作提示', '保存中');
console.log('actionType=' + actionType);					
					var objActionType = /^post$/i;
					actionData = actionData || {};
					// method type: post
					if(objActionType.test(actionType)) {
						$http.post(actionUrl, { 'data': actionData })
							.success(function(data) {
								if(data.success) {
									// 
									$timeout(function() {
										swal({ title: "操作结果", text: "保存成功", type: "success", triggerAfterClose: true }, 
											function() {
												funcRedirect(redirect);
											});
									})
								} else {
									$timeout(function() {
										swal({ title: "操作结果", text: data.message, type: "error", timer: 2000 });
									})
								}
							})
							.error(function(data) {
								$timeout(function() {
									swal({ title: "操作结果", text: data.message, type: "error", timer: 2000 });
								});
							});
					// method type: other
					} else {
						// 
						console.log('other type');
					}
				},
				submit: function(actionType, actionUrl, actionData, redirect) {
					// this.info('操作提示', '提交中');
					
					var objActionType = /^post$/i;
					actionData = actionData || {};
					// method type: post
					if(objActionType.test(actionType)) {
						$http.post(actionUrl, { 'data': actionData })
							.success(function(data) {
								if(data.success) {
									// 
									$timeout(function() {
										swal({ title: "操作结果", text: "提交成功", type: "success", triggerAfterClose: true }, 
											function() {
												funcRedirect(redirect);
											}
										);
									})
								} else {
									$timeout(function() {
										swal({ title: "操作结果", text: data.message, type: "error", timer: 2000 });
									})
								}
							})
							.error(function(data) {
								$timeout(function() {
									swal({ title: "操作结果", text: data.message, type: "error", timer: 2000 });
								});
							});
					// method type: other
					} else {
						// 
						console.log('other type');
					}
					
				}
			}

			return self;
		}
	])