'use strict';

app.directive('btnsgroup', ['FormOperation', function(FormOperation) {
	return {
		restrict: 'AE',
		templateUrl: './views/demo/directives/tpls.html',
		link: function(scope, elem, attrs) {
			scope.save = function() {
				var paramsSave = attrs.paramsSave,
						objParams = {};
				if(!paramsSave) {
					console.log('Get save params wrong, exit');
					return;
				}
				// remove blanks in params string
				paramsSave = paramsSave.replace(/\ /g, '');
				if(paramsSave.indexOf('{') > -1) {
					// stringified object
					paramsSave = paramsSave.replace(/'/g, '"');
					objParams = JSON.parse(paramsSave);
				} else {
					console.log('in save');
					console.log(paramsSave);
					// string
					var arrParams = paramsSave.split(',');
					objParams.actionUrl = arrParams[0];
					objParams.redirectUrl = arrParams[1];
				}
				// form data to save
				objParams.actionData = scope.entity;
				// FormOperation.save('pOst', 'users/signin', scope.entity, 'app/form/selectForm');
				FormOperation.save(objParams);
			};

			scope.submit = function() {
				console.log('submit in link');
				var paramsSubmit = attrs.paramsSubmit,
						objParams = {};
				if(!paramsSubmit) {
					console.log('Get submit params wrong, exit');
					return;
				}
				// remove blanks in params string
				paramsSubmit = paramsSubmit.replace(/\ /g, '');
				if(paramsSubmit.indexOf('{') > -1) {console.log(paramsSubmit);
					// stringified object
					paramsSubmit = paramsSubmit.replace(/'/g, '"');
					paramsSubmit = JSON.parse(paramsSubmit);
					if(paramsSubmit.type) {
						objParams.actionType = paramsSubmit.type;
					}
					if(paramsSubmit.url) {
						objParams.actionUrl = paramsSubmit.url;
					}
					if(paramsSubmit.redirectUrl) {
						objParams.redirectUrl = paramsSubmit.redirectUrl;
					}
				} else {
					// string
					var arrParams = paramsSubmit.split(',');
					objParams.actionUrl = arrParams[0];
					objParams.redirectUrl = arrParams[1];
				}
				// form data to submit
				objParams.actionData = scope.entity;
				// FormOperation.save('pOst', 'users/signin', scope.entity, 'app/form/selectForm');
				FormOperation.submit(objParams);
			};

		}
	}
}]).directive('btnSave', ['FormOperation', function(FormOperation) {
	return {
		restrict: 'AE',
		link: function(scope, elem, attrs) {
			// 
			// attrs.$attr -- 获取所有属性以及对应的原始名称（object）
			var funcBeforeSave = scope.save;

			scope.save = function() {
				var actionData;
				if(angular.isFunction(funcBeforeSave) {
					actionData = funcBeforeSave();
				}

				var actionType = attrs.actionType,
						url = attrs.url,
						redirectUrl = attrs.redirectUrl,
						objParams = {};
				if(angular.isUndefined(url)) {
					console.log('Get param url wrong, exit.');
					return false;
				}
				objParams.actionType = actionType || 'post';
				objParams.actionUrl = url;
				objParams.redirectUrl = redirectUrl || '';
				// form data to save
				objParams.actionData = actionData || scope.entity;
				console.log(objParams);
				FormOperation.save(objParams);
			}
		}
	}
}]).directive('btnSubmit', ['FormOperation', function(FormOperation) {
	// 
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			var funcBeforeSubmit = scope.submit;

			scope.submit = function() {
				// 
				var actionData;
				if(angular.isFunction(funcBeforeSubmit)) {
					actionData = funcBeforeSubmit();
				}

				var actionType = attrs.actionType,
						url = attrs.url,
						redirectUrl = attrs.redirectUrl,
						objParams = {};
				if(angular.isUndefined(url)) {
					console.log('Get param url wrong, exit');
					return false;
				}
				objParams.actionType = actionType || '';
				objParams.actionUrl = url;
				objParams.redirectUrl = redirectUrl || '';
				objParams.actionData = actionData || scope.entity;

				FormOperation.submit(objParams);
			}
		}
	}
}])
// app.directive('userinfo', function() {
// 	return {
// 		restrict: 'AE',
// 		// scope: { user: '=user'},
// 		// template: 'User: <b>{{ user.firstName }}</b> +  <b>{{ user.lastName }}</b>'
// 		templateUrl: './views/demo/directives/tpls.html',
// 		compile: function(elem, attrs) {
// 			elem.css('border', '1px solid #cccccc');

// 			return function($scope, elem, attrs) {
// 				// bind element to data in $scope
// 				elem.html('This is the new content: ' + $scope.firstName);
// 				elem.css('background-color', '#ffff00');
// 			}
// 		}
// 	}
// })
// 	.directive('mytransclude', function() {
// 		return {
// 			restrict: 'E',
// 			transclude: true,
// 			template: '<div class="myTransclude" ng-transclude></div>'
// 		}
// 	})
	// 单独使用时的 expander directive
	// .directive('expander', function() {
	// 	return {
	// 		restrict: 'EA',
	// 		replace: true,
	// 		transclude: true,
	// 		scope: {
	// 			title: '=expanderTitle'
	// 		},
	// 		template: '<div>' + 
	// 			'<div class="title" ng-click="toggle();">{{ title }} </div>' + 
	// 			'<div class="body" ng-show="showMe" ng-transclude></div>' + 
	// 			'</div>',
	// 		link: function(scope, elem, attrs) {
	// 			scope.showMe = false;

	// 			scope.toggle = function(toggle) {
	// 				scope.showMe = ! scope.showMe;
	// 			}
	// 		}
	// 	}
	// })

// app.directive('accordion', function() {
// 		return {
// 			restrict: 'AE',
// 			replace: true,
// 			transclude: true,
// 			template: '<div ng-transclude></div>',
// 			controller: function() {
// 				var expanders = [];

// 				this.getOpened = function(selectedExpander) {
// 					angular.forEach(expanders, function(expander) {
// 						if(selectedExpander != expander) {
// 							expander.showMe = false;
// 						}
// 					});
// 				}

// 				this.addExpander = function(expander) {
// 					expanders.push(expander);
// 				}

// 			}
// 		}
// 	})
// app.directive('expander', function() {
// 		return {
// 			restrict: 'AE',
// 			replace: true,
// 			transclude: true,
// 			require: '^?accordion',
// 			scope: { title: '=expanderTitle' },
// 			template: '<div>' + 
// 				'<div class="title" ng-click="toggle();">{{title}} </div>' + 
// 				'<div class="body" ng-show="showMe" ng-transclude></div>' + 
// 				'</div>',
// 			link: function(scope, elem, attrs, accordionController) {
// 				scope.showMe = false;
// 				accordionController.addExpander(scope);

// 				scope.toggle = function toggle() {
// 					scope.showMe = !scope.showMe;

// 					accordionController.getOpened(scope);
// 				}
// 			}
// 		}
// 	});

// app.controller('customDirectivesCtrl', ['$scope', 
// 	function($scope) {
// 		// $scope.jakob = {};
// 		// $scope.jakob.firstName = 'Jakob';
// 		// $scope.jakob.lastName = 'Jenkov';

// 		// $scope.john = {};
// 		// $scope.john.firstName = "John";
// 		// $scope.john.lastName = "Doe";

// 		$scope.cssClass = 'notificationDiv';
// 		$scope.firstName = 'Jakob';

// 		$scope.doClick = function() {
// 			console.log('doClick() called');
// 		}
// 	}
// ])
// 	.controller('transcludeCtrl', ['$scope', 
// 		function($scope){
// 			//
// 			$scope.firstName = 'Jakob';
// 		}
// 	])
// 	.controller('expanderCtrl', ['$scope', 
// 		function($scope) {
// 			$scope.title = '点击展开';
// 			$scope.text = '这里是内部内容';
// 		}
// 	])

// app.controller('accordionCtrl', ['$scope', 
// 		function($scope){
// 			//
// 			$scope.expanders = [{
// 				title: 'Click me to expand',
// 				text: 'Hi there forks, I am the content that was hidden but is now shown'
// 			}, {
// 				title: 'Click this',
// 				text: 'I am even better text than you have been previously.'
// 			}, {
// 				title: 'Test',
// 				text: 'test'
// 			}]
// 		}
// 	]);