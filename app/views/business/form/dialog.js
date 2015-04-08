'use strict';

app.controller('ModalParentCtrl', ['$scope', '$modal', function($scope, $modal) {

	// $scope.entity = {
	// 	'username': 'staff1'
	// };

}]);

app.directive('conowBtnSave', ['$modal', '$timeout', 
	function($modal, $timeout) {
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
						backdrop
					})
				});
			}
		}
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
						templateUrl: 'views/business/form/delTpls.html',
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
							templateUrl: 'views/business/form/delResultTpls.html',
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

		$scope.confirm = function() {
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