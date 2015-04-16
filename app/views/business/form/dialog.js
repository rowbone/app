'use strict';

app.controller('ModalParentCtrl', ['$scope', '$modal', '$rootScope', '$http', 
	function($scope, $modal, $rootScope, $http) {

		$scope.entity = {
			userName: 'abc',
			email: 'abc@email.com'
		}

		$http.get('data/bz/listTpl.json')
			.success(function(data, status) {
				$scope.items = data;
			})
			.error(function(data, status) {
				console.log('error.............')
				$scope.items = [];
			});

			$scope.selectedItems = [{
					"id": "003",
					"firstName": "Larry",
					"lastName": "the Bird",
					"userName": "@twitter"
				}, {
					"id": "008",
					"firstName": "Larry",
					"lastName": "the Bird",
					"userName": "@twitter"
			}];

		$rootScope.options = {
			isPC: true
		};

		$scope.changeAgent = function(e) {
			$rootScope.options.isPC = !$rootScope.options.isPC;

			return;
		};

		$scope.beforeSave = function() {
			// 
			var entity = {
				abc: 'abc'
			}
			if(!$scope.entity) {
				$scope.entity = {};
			}
			angular.extend($scope.entity, entity);
			console.log('before save.............')
			return true;
		};

		$scope.afterSave = function() {
			console.log('after save...............')
			return true;
		};

	}
]);

app.directive('conowBtnSave', ['$modal', '$timeout', '$http', '$state', '$parse', 
	function($modal, $timeout, $http, $state, $parse) {
		return {
			// restrict: 'AE',
			// template: '<button type="button" class="btn btn-success">保存</button>',
			link: function(scope, elem, attrs) {
				// beforeFunc: 点击前调用的方法，由具有业务提供。保存操作前执行
				// flag: 标志位，默认为 true。用于判断是否进行下一步操作，保存 beforeFunc/afterFunc 的返回值
				// afterFunc：点击后调用的方法，由具体业务提供。保存完成后，跳转前执行
				var beforeFunc = $parse(attrs.beforeFunc),
						afterFunc = $parse(attrs.afterFunc),
						flag = true,
						redirectUrl = attrs.redirectUrl;

				elem.on('click', function(e) {
					e.preventDefault();console.log(beforeFunc)
					if(attrs.beforeFunc && angular.isFunction(beforeFunc)) {
						scope.$apply(function () {
					    flag = beforeFunc(scope);
						});
					}
					if(!flag) {
						return;
					}

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

							if(attrs.afterFunc && angular.isFunction(afterFunc)) {
								scope.$apply(function() {
									flag = afterFunc(scope);
								});
								if(!flag) {
									return;
								}
							}
							

							if(redirectUrl) {
								$state.go(redirectUrl);
							}

						}, 1000);
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
			// restrict: 'AE',
			// template: '<button type="button" class="btn btn-primary">提交</button>',
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
			// restrict: 'AE',
			// template: '<button type="button" class="btn btn-danger">删除</button>',
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
			// restrict: 'AE',
			// template: '<button type="button" class="btn btn-info">提示</button>',
			link: function(scope, elem, attrs) {

				elem.on('click', function(e) {
					e.preventDefault();

					var modalInstance = $modal.open({
						templateUrl: 'views/business/form/promptTpl.html',
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
			// restrict: 'AE',
			// template: '<button type="button" class="btn btn-primary">选择</button>',
			link: function(scope, elem, attrs) {
				elem.on('click', function(e) {
					e.preventDefault();

					var modalInstance = $modal.open({
						templateUrl: 'views/business/form/listTpl.html',
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

app.controller('SelModalCtrl', ['$scope', '$modalInstance', 'params', '$rootScope', '$http',  
	function($scope, $modalInstance, params, $rootScope, $http) {
		$scope.params = params;	
		$scope.params.title = params.title || '请选择';

		$http.get('data/bz/listTpl.json')
			.success(function(data, status) {
				$scope.items = data;
			})
			.error(function(data, status) {
				console.log('error.............')
				$scope.items = [];
			});

		$scope.options = {
			isPC: $rootScope.options.isPC
		};

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

app.directive('responsiveModal', ['$modal', 
	function($modal) {
		return {
			'restrict': 'AE',
			// templateUrl: 'views/business/form/modalTpl.html',
			// transclude: true,
			// replace: true,
			// scope: {
			// 	items: '@',
			// 	selectedItems: '@'
			// },
			link: function(scope, elem, attrs) {
				var cols = attrs.cols;
				console.log(cols)
				var colsArr = cols.split(';');
				var colArr = [];
				var colsMap = {};
				for(var i=0; i<colsArr.length; i++) {
					colArr = colsArr[i].split(':');
					colsMap[colArr[0]] = colArr[1];
				}

				elem.on('click', function(e) {
					e.preventDefault();

					var $modalInstance = $modal.open({
						templateUrl: 'views/business/form/modalTpl.html',
						controller: 'ResponsiveModalCtrl',
						resolve: {
							params: function() {
								var objParams = {
									innerUrl: 'views/business/form/listTpl2.html',
									title: '请选择',
									items: scope.$eval(attrs.items),
									selectedItems: scope.$eval(attrs.selectedItems),
									colsMap: colsMap
								};
								return objParams;
							}
						}
					});

					$modalInstance.result.then(function(rtnVal) {
						scope.selectedItems = rtnVal;
					}, function(rtnVal) {
						console.log(rtnVal);
					});
				})
			}
		}
	}
]);

app.directive('responsiveModal2', ['$modal', 
	function($modal) {
		return {
			'restrict': 'AE',
			link: function(scope, elem, attrs) {

				elem.on('click', function(e) {
					e.preventDefault();

					var $modalInstance = $modal.open({
						templateUrl: 'views/business/form/modalTpl.html',
						controller: 'ResponsiveModalCtrl',
						resolve: {
							params: function() {
								var objParams = {
									innerUrl: 'views/business/form/listTpl3.html',
									title: '请选择',
									items: scope.$eval(attrs.items),
									selectedItems: scope.$eval(attrs.selectedItems)
								};
								return objParams;
							}
						}
					});

					$modalInstance.result.then(function(rtnVal) {
						scope.selectedItems = rtnVal;
					}, function(rtnVal) {
						console.log(rtnVal);
					});
				})
			}
		}
	}
]);

app.controller('ResponsiveModalCtrl', ['$scope', '$modalInstance', '$rootScope', 'params', 
	function($scope, $modalInstance, $rootScope, params) {

		var colsMap = params.colsMap;
		var colsKey = Object.keys(colsMap);
		var colsValue = [];console.log(colsMap)
		for(var i=0; i<colsKey.length; i++) {
			colsValue.push(colsMap[colsKey[i]]);
		}

		$scope.colsKey = colsKey;
		$scope.colsValue = colsValue;

		$scope.params = params;

		var arrSelected = $scope.arrSelected = params.selectedItems,
				items = params.items;

		if(angular.equals(arrSelected, items)) {
			$scope.isAllSelected = true;
		} else {
			$scope.isAllSelected = false;
		}

		$scope.isSelectedAll = function() {
			if(angular.equals(params.items, $scope.arrSelected)) {
				return true;
			} else {
				return false;
			}
		};

		$scope.allChange = function() {
			$scope.isAllSelected = !$scope.isAllSelected;
			if(!$scope.isAllSelected) {
				$scope.arrSelected.length = 0;
			} else {
				$scope.arrSelected = params.items.concat();
			}
		};

		var indexInArr = function(arr, obj) {
			if(!angular.isArray(arr)) {
				if(angular.equals(arr, obj)) {
					return 0;
				} else {
					return -1;
				}
			}
			for(var i=0; i<arr.length; i ++) {
				if(angular.equals(arr[i], obj)) {
					return i;
				}
			}

			return -1;
		};

		$scope.inArr = function(arr, obj) {
			if(indexInArr(arr, obj) > -1) {
				return true;
			} else {
				return false;
			}
		};

		$scope.oneClick = function(index) {
			var item = params.items[index];
			index = indexInArr(arrSelected, item);

			if(index > -1) {
				arrSelected.splice(index, 1);
			} else {
				arrSelected.push(item);
			}
		};

		$scope.confirm = function() {
			$modalInstance.close($scope.arrSelected);
		};

		$scope.close = function() {
			$modalInstance.dismiss('close..........');
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel...');
		};

	}
]);