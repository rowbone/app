'use strict';

app.directive('conowBtnDel', ['ngDialog', '$http', function(ngDialog, $http) {
	return {
		restrict: 'AE',
		template: '<button type="button" class="btn btn-primary">删除</button>',
		scope: {
			//
			ngClick: '&ngClick',
			url: '=',
			doModal: '=',
			param: '='
		},
		link: function(scope, elem, attrs) {
			// 当且仅当doModal为false或者"false"时，为非模态框。（即默认为模态框）
			var originalFunc = scope.ngClick,
					url = scope.url,
					param = scope.param,
					doModal = scope.doModal,
					modalDialog = (doModal === false) ? false : true;

			elem.on('click', function(e) {
				e.preventDefault();

				// var defaults = ngDialog.getDefaults();
				// console.log(defaults);

				ngDialog.open({
					// 
					template: 'views/business/form/del-tpls.html',
					closeByDocument: modalDialog,
					controller: 'DeleteCtrl',
					data: {
						'url': url,
						'param': param
					}
				});
			});
		}
	}
}]);

app.directive('conowBtnPrompt', ['ngDialog', '$parse', function(ngDialog, $parse) {
	// 
	return {
		restrict: 'AE',
		template: '<button type="button" class="btn btn-info">确定</button>',
		scope: {
			defaultValue: '='
		},
		link: function(scope, elem, attrs) {

			scope.$on('PromptCtrlChange', function(event, msg) {
				console.log('111111111111111111111111')
				console.log('conowBtnPrompt', msg);
				// scope.$broadcast
			})

			var defaultValue = scope.defaultValue,
					textTitle = attrs.textTitle;

			var funcCallback = function(name) {
				return name;
			};

			var obj = {
				'name': 'abc',
				'callback': funcCallback(name)
			}

			// add event
			elem.on('click', function(e) {
				e.preventDefault();

				ngDialog.open({
					template: 'views/business/form/prompt-tpls.html',
					controller: 'PromptCtrl',
					data: {
						'defaultValue': defaultValue,
						'textTitle': textTitle,
						'obj': obj
					}
				});
			});
		}
	}
}]);

app.controller('PromptCtrl', ['$scope', 'ngDialog', '$rootScope', function($scope, ngDialog, $rootScope) {

	// $scope.entity.item = $scope.ngDialogData.defaultValue;
console.log('in', 'PromptCtrl');
console.log($scope.ngDialogData.obj)
console.log('111111111')
	$scope.change = function(name) {
		console.log('PromptCtrl', name);
		$scope.$emit('PromptCtrlChange', name);
	};

	$scope.entity = {
		'item': $scope.ngDialogData.defaultValue,
		'title': $scope.ngDialogData.textTitle,
		'callback': $scope.ngDialogData.callback
	};



	$scope.confirm = function() {
		console.log('你输入了：' + $scope.entity.item);
		// ngDialog.close();
	};

	$scope.cancel = function(itemVal) {
		//
		console.log(itemVal)
		console.log('cancel..........');
		console.log('PromptCtrl', itemVal);
		$scope.$emit('PromptCtrlChange', itemVal);
		// ngDialog.close();
	};

}])

app.controller('DeleteCtrl', ['$scope', '$timeout', 'ngDialog', '$http', function($scope, $timeout, ngDialog, $http) {

	$scope.confirm = function() {
		ngDialog.close();
		// console.log($scope.ngDialogData);

		$http.post($scope.ngDialogData.url, {
			'data': $scope.ngDialogData.param
		})
		.success(function(data, status) {
			console.log(data);
			if(data.success) {
				ngDialog.open({
					template: '<div class="text-success has-success"><span class="glyphicon glyphicon-ok"></span>删除成功</div>',
					// closeByDocument: false,
					// closeByEscape: false,
					plain: true,
					overlay: false
				});
			} else {
				ngDialog.open({
					template: '<div class="text-danger has-error"><span class="glyphicon glyphicon-remove"></span>删除失败</div>',
					// closeByDocument: false,
					// closeByEscape: false,
					plain: true,
					overlay: false
				});
			}
		})
		.error(function(data, status) {
			console.log(status);
			console.log(data);
		});

		$timeout(function() {
			ngDialog.close();
		}, 1000);
	};

	$scope.cancel = function() {
		console.log('cancel.........');
		ngDialog.close();
	};

}]);

app.controller('DialogDemoCtrl', ['$scope', '$rootScope', 'ngDialog', 
	function($scope, $rootScope, ngDialog) {
		//
		console.log('DialogDemoCtrl...........');

		$scope.entity = {
			username: 'username1',
			item: '111111111'
		};

		$scope.open = function() {
		    ngDialog.open({
		        template: 'views/business/form/tpls.html',
		        // template: '<div>This is template param in plain.</div>',
		        // plain: true,
		        controller: 'DeleteCtrl',
		        data: {
		            foo: 'some data'
		        },
		        closeByDocument: false,
		        showClose: false
		    });
		};

		// $scope.test = function() {
		// 	console.log('11111111111');
		// 	// toaster.pop('success', 'Test title', 'Test text');
		// };

	}

]);