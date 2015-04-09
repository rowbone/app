'use strict';

app.controller('ModalParentCtrl', ['$scope', '$modal', function($scope, $modal) {

	// $scope.entity = {
	// 	'username': 'staff1'
	// };

}]);

app.directive('conowBtnSave', ['$modal', '$timeout', '$http', '$state',  
	function($modal, $timeout, $http, $state) {
		return {
			restrict: 'AE',
			template: '<button type="button" class="btn btn-success">保存</button>',
			link: function(scope, elem, attrs) {
				elem.on('click', function(e) {
					e.preventDefault();

					var size = '';

					var modalInstance = $modal.open({
						templateUrl: 'views/business/form/saveTpl.html',
						controller: 'SaveModalCtrl',
						backdrop: false,
						resolve: {
							params: function() {
								var objParams = {
									url: attrs.url,
									data: scope.$eval(attrs.data),
									title: attrs.title,
									message: '保存中...'
								};

								return objParams;
							}
						}
					});

					var modalInstance2 = {};
					modalInstance.result.then(function(rtnVal) {
						modalInstance2 = $modal.open({
							templateUrl: 'views/business/form/saveResultTpl.html',
							backdrop: false,
							controller: 'SaveResultCtrl',
							resolve: {
								params: function() {
									return rtnVal;
								}
							}
						});

						$timeout(function() {
							modalInstance2.close();
						}, 1000);

						if(attrs.redirectUrl) {
							$timeout(function() {
								$state.go(attrs.redirectUrl);
							}, 1000);
						}

					}, function() {
						console.log('save data canceled');
					});

				});
			}
		}
	}
]);

app.controller('SaveModalCtrl', ['$scope', '$modalInstance', '$http', 'params', '$timeout',
	function($scope, $modalInstance, $http, params, $timeout) {
		$scope.params = params;
		$http.post(params.url, {'data': params.data})
			.success(function(data, status, headers, config) {
				$timeout(function() {
					console.log(data);
					$modalInstance.close(data);
				}, 1000);
			})
			.error(function(data, status, headers, config) {
				$timeout(function() {
					$modalInstance.close(data);
				}, 1000);
			});
	}
]);

app.controller('SaveResultCtrl', ['$scope', 'params',
	function($scope, params) {
		$scope.params = params;
	}
]);

app.directive('conowBtnSubmit', ['$modal', '$timeout', '$http', '$state',  
	function($modal, $timeout, $http, $state) {
		return {
			restrict: 'AE',
			template: '<button type="button" class="btn btn-primary">提交</button>',
			link: function(scope, elem, attrs) {
				elem.on('click', function(e) {
					e.preventDefault();

					var size = '';

					var modalInstance = $modal.open({
						templateUrl: 'views/business/form/submitTpl.html',
						controller: 'SubmitModalCtrl',
						backdrop: false,
						resolve: {
							params: function() {
								var objParams = {
									url: attrs.url,
									data: scope.$eval(attrs.data),
									title: attrs.title,
									message: '提交中...'
								};

								return objParams;
							}
						}
					});

					var modalInstance2 = {};
					modalInstance.result.then(function(rtnVal) {
						modalInstance2 = $modal.open({
							templateUrl: 'views/business/form/submitResultTpl.html',
							backdrop: false,
							controller: 'SubmitResultCtrl',
							resolve: {
								params: function() {
									return rtnVal;
								}
							}
						});

						$timeout(function() {
							modalInstance2.close();
						}, 1000);

						if(attrs.redirectUrl) {
							$timeout(function() {
								$state.go(attrs.redirectUrl);
							}, 1000);
						}

					}, function() {
						console.log('submit data canceled');
					});

				});
			}
		}
	}
]);

app.controller('SubmitModalCtrl', ['$scope', '$modalInstance', '$http', 'params', '$timeout',
	function($scope, $modalInstance, $http, params, $timeout) {
		$scope.params = params;
		$http.post(params.url, {'data': params.data})
			.success(function(data, status, headers, config) {
				$timeout(function() {
					console.log(data);
					$modalInstance.close(data);
				}, 1000);
			})
			.error(function(data, status, headers, config) {
				$timeout(function() {
					$modalInstance.close(data);
				}, 1000);
			});
	}
]);

app.controller('SubmitResultCtrl', ['$scope', 'params',
	function($scope, params) {
		$scope.params = params;
	}
]);

app.directive('conowBtnDel', ['$modal', '$timeout',
	function($modal, $timeout) {
		return {
			restrict: 'AE',
			template: '<button type="button" class="btn btn-danger">删除</button>',
			link: function(scope, elem, attrs) {

				elem.on('click', function(e) {
					e.preventDefault();

					var size = '';
					var modalInstance = $modal.open({
						templateUrl: 'views/business/form/delTpl.html',
						controller: 'DelModalCtrl',
						size: size,
						backdrop: 'static',
						resolve: {
							params: function() {
								var objParams = {
									url: attrs.url,
									data: scope.$eval(attrs.data),
									title: attrs.title,
									confirmMsg: attrs.confirmMsg
								};

								return objParams;
							}
						}
					});

					var modalInstance2 = {};
					modalInstance.result.then(function(rtnVal) {
						modalInstance2 = $modal.open({
							templateUrl: 'views/business/form/delResultTpl.html',
							controller: 'DelModalResultCtrl',
							backdrop: false,
							resolve: {
								params: function() {
									return rtnVal;
								}
							}
						});

						$timeout(function() {
							modalInstance2.close();
						}, 1000);

					}, function() {
						console.log('Delete cancel.......');
					})
				})
			}
		}
	}
]);

app.controller('DelModalCtrl', ['$scope', '$modalInstance', 'params', '$http', 
	function($scope, $modalInstance, params, $http) {
		$scope.params = params;

		$scope.params.confirmMsg = $scope.params.confirmMsg || '是否确认删除？';
		$scope.params.title = $scope.params.title || '确认删除';
console.log(params)
		$scope.confirm = function() {
			console.log('DelModalCtrl -> params.data');
			console.log(params.data)
			$http.post(params.url, {'data': params.data})
				.success(function(data, status) {
					// console.log(data);
					$modalInstance.close(data);
				})
				.error(function(data, status) {
					console.log('error.status:' + status);
					$modalInstance.close(data);
				});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.close = function() {
			$modalInstance.dismiss('close');
		}
	}
]);

app.controller('DelModalResultCtrl', ['$scope', '$modalInstance', 'params', 
	function($scope, $modalInstance, params) {

		$scope.params = params;
	}
]);

app.directive('conowBtnPrompt', ['$modal', 
	function($modal) {
		return {
			restrict: 'AE',
			template: '<button type="button" class="btn btn-info">提示</button>',
			link: function(scope, elem, attrs) {

				elem.on('click', function(e) {
					e.preventDefault();

					var modalInstance = $modal.open({
						templateUrl: 'views/business/form/promptTpls.html',
						controller: 'PromptModalCtrl',
						backdrop: 'static',
						resolve: {
							params: function() {
								var objParams = {
									title: attrs.title,
									data: scope.$eval(attrs.data)
								};

								return objParams;
							}
						}
					});

					modalInstance.result.then(function(rtnVal) {
						console.log('rtnVal...');
						console.log(rtnVal);
						scope.entity = rtnVal;
					}, function(rtnVal) {
						console.log(rtnVal)
						console.log('Prompt cancel.....');
					})
				})
			}
		}
	}
]);

app.controller('PromptModalCtrl', ['$scope', '$modalInstance', 'params', 
	function($scope, $modalInstance, params) {
		$scope.params = params;
		$scope.params.title = params.title || '提示标题';
		$scope.entity = params.data;

		$scope.confirm = function() {
			$modalInstance.close($scope.entity);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel...');
		};

		$scope.close = function() {
			$modalInstance.dismiss('closing');
		}
	}
]);

app.directive('conowBtnSel', ['$modal', 
	function($modal) {
		return {
			restrict: 'AE',
			template: '<button type="button" class="btn btn-primary">选择</button>',
			link: function(scope, elem, attrs) {
				elem.on('click', function(e) {
					e.preventDefault();

					var modalInstance = $modal.open({
						templateUrl: 'views/business/form/listTpls.html',
						controller: 'SelModalCtrl',
						backdrop: true,
						resolve: {
							params: function() {
								var objParams = {
									title: attrs.title,
									data: scope.$eval(attrs.data)
								};

								return objParams;
							}
						}
					});

					modalInstance.result.then(function(rtnVal) {
						console.log('confirm...............')
						console.log(rtnVal);
					}, function(rtnVal) {
						console.log('dismiss:' + rtnVal);
					})
				});
			}
		}
	}
]);

app.controller('SelModalCtrl', ['$scope', '$modalInstance', 'params',
	function($scope, $modalInstance, params) {
		$scope.params = params;	
		$scope.params.title = params.title || '请选择';

		$scope.confirm = function() {
			// 
			$modalInstance.close($scope.entity);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel...');
		};

		$scope.close = function() {
			$modalInstance.dismiss('closing.....');
		};

	}
]);