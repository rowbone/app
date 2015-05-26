'use strict';

app.controller('ExecFuncInServiceCtrl', ['$scope', 'ExecFuncService', 'foo', '$log', 
	function($scope, ExecFuncService, foo, $log) {
		$scope.entity = {
			'email': 'abc111@email.com',
			'sex': 'female'
		};
		// service 调用 controller 提供的参数方法
		$scope.execFuncInService = function() {
			ExecFuncService.submit({'name': 'abc', 'age': 12}, function() {
				$scope.entity = {
					'email': 'abc@email.com',
					'sex': 'male'
				};
			});
		};
		// service decorator
		$scope.execDecorator = function() {
			// 
			console.log('foo.variable-->', foo.variable);
			console.log('foo.getPrivate()-->', foo.getPrivate());
			console.log('foo.greet()-->', foo.greet());

			$log.log('This is from Angular $log...');
		};

		$scope.chkboxes = [
			{
				'name': 'name1',
				'age': 3
			}, {
				'name': 'name2',
				'age': 8
			}
		];

		$scope.abc = [];

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
	});

	$provide.decorator('$log', function($delegate) {
		angular.forEach(['log', 'debug', 'info', 'warn', 'error'], function(o) {
			$delegate[o] = decoratorLogger($delegate[o]);
		});

		function decoratorLogger(originalFn) {
			return function() {
				var args = Array.prototype.slice(arguments);
				args.unshift(new Date().toISPString());
				originalFn.apply(null, args);
			}
		}
	});
	
});