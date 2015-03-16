'use strict';

app.directive('conowBtnSel', ['$modal', 
	function($modal) {
		return {
			//
			restrict: 'AE',
			template: '<button type="button" class="btn btn-primary">选择</button>'
		}
	}
]);

app.directive('conowBtnPrompt', ['$modal', 
	function($modal) {
		return {
			restrict: 'AE',
			template: '<button type="button" class="btn btn-primary">提示</button>',
			link: function(scope, elem, attrs) {

				elem.on('click', function(e) {
					e.preventDefault();

					var modalInstance = $modal.open({
						// templateUrl: 'views/business/form/prompt-tpls.html',
						templateUrl: 'views/business/form/list-tpls.html',
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
		console.log('PromptModalCtrl');
		console.log(params);	

		// $scope.params = params;
		$scope.entity = params.data;

		$scope.confirm = function() {
			// 
			$modalInstance.close($scope.entity);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel...');
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
						templateUrl: 'views/business/form/del-tpls.html',
						controller: 'DelModalCtrl',
						size: size,
						backdrop: 'static',
						resolve: {
							params: function() {
								var objParams = {
									url: attrs.url,
									data: scope.$eval(attrs.data),
									confirmMsg: attrs.confirmMsg
								};
								return objParams;
							}
						}
					});

					var modalInstance2 = {};
					modalInstance.result.then(function(rtnVal) {
						modalInstance2 = $modal.open({
							templateUrl: 'views/business/form/del-result.html',
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
						}, 2000);

					}, function() {
						console.log('Delete cancel.......');
					})
				})
			}
		}
	}
]);

app.controller('DelModalResultCtrl', ['$scope', '$modalInstance', 'params', 
	function($scope, $modalInstance, params) {

		$scope.result = params;
	}
]);

app.controller('DelModalCtrl', ['$scope', '$modalInstance', 'params', '$http', 
	function($scope, $modalInstance, params, $http) {
		$scope.params = params;

		$scope.params.confirmMsg = $scope.params.confirmMsg || '是否确认删除？';

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

app.controller('ModalParentCtrl', ['$scope', '$modal', function($scope, $modal) {

	$scope.entity = {
		'username': 'staff1'
	};

}]);