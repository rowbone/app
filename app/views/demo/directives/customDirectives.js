'use strict';

app.directive('btnsgroup', ['FormOperation', function(FormOperation) {
	return {
		restrict: 'AE',
		templateUrl: './views/demo/directives/tpls.html',
		// controller: function() {
		// 	//
		// 	this.save = function() {
		// 		console.log('saving...');
		// 	}

		// 	this.submit = function() {
		// 		console.log('submit...');
		// 	}
		// },
		link: function(scope, elem, attrs) {

			console.log(attrs);
			// 
			scope.save = function() {
				console.log('save in link');
				var paramsSave = attrs.paramsSave;
				if(!paramsSave) {
					console.log('Get save params wrong, exit');
					return;
				}
				paramsSave = paramsSave.replace(/'/g, '"').replace(/\ /g, '');
				console.log(typeof paramsSave);
				paramsSave = JSON.parse(paramsSave);
				console.log(paramsSave);
				console.log('222' + typeof paramsSave);
				// FormOperation.save('pOst', 'users/signin', scope.entity, 'app/form/selectForm');
				FormOperation.save(paramsSave);
			};

			scope.submit = function() {
				console.log('submit in link');
				FormOperation.submit('post', 'users/signin', scope.entity, {state: 'app.form.simpleForm', url: 'app/form/simpleForm'});
				// {'type': 'post','url': 'users/signin', 'redirectUrl': 'app/form/selectForm'}
			};

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