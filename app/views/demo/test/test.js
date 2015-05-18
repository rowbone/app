'use strict';

app.controller('ExecFuncInServiceCtrl', ['$scope', 'ExecFuncService', 'foo', 
	function($scope, ExecFuncService, foo) {
		$scope.entity = {
			'email': 'abc111@email.com',
			'sex': 'female'
		};

		$scope.execFuncInService = function() {
			ExecFuncService.submit({'name': 'abc', 'age': 12}, function() {
				$scope.entity = {
					'email': 'abc@email.com',
					'sex': 'male'
				};
			});
		};

		$scope.execDecorator = function() {
			// 
			console.log('foo.variable-->', foo.variable);
			console.log('foo.getPrivate-->', foo.getPrivate());
			console.log('foo.greet-->', foo.greet());
		};

	}
]);

app.service('ExecFuncService', ['$timeout', 
	function($timeout) {
		var ExecFuncService = {
			submit: function(params, fn) {
				console.log('params-->', params);

				if(fn) {
					console.log('fn-->', fn);
					fn();
				}
			}
		};

		return ExecFuncService;
	}
]);

app.factory('foo', ['$timeout', function($timeout) {
	var thisIsPrivate = 'Private';

	function getPrivate() {
		return thisIsPrivate;
	}

	return {
		variable: 'This is public',
		getPrivate: getPrivate
	};
}]);

app.config(function($provide) {
	$provide.decorator('foo', function($delegate) {
		$delegate.greet = function() {
			return 'Hello, I am a new function of "foo"';
		};

		return $delegate;
	})
})