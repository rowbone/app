'use strict';

app.controller('ExecFuncInServiceCtrl', ['$scope', 'ExecFuncService', 'foo', '$log', 'DataService', 
	function($scope, ExecFuncService, foo, $log, DataService) {

		var str = '中华人民共和国';
		console.log('before convert-->', str);
		console.log('after convert-->', codefans_net_CC2PY(str));

		$scope.entity = {
			'email': 'abc111@email.com',
			'sex': 'female',
			'isMulti': false,
			'results': [{}, {}, {}]
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

app.service('PromiseDataService', ['DataService', 
	function(DataService) {
		var self = this,
				data = [];

		var data = DataService.getData('');

		this.setData = function(data) {
			self.data = data;
		}

		this.getData = function() {
			return self.data;
		};
	}
]);

// $q defer promise 
app.controller('DeferAndPromiseCtrl', ['$scope', 'DataService', 
	function($scope, DataService) {
		// 

		// $scope.$watch(function() {
		// 	return DateService.getData('')
		// });
	}
]);

app.controller('DataGenerateCtrl', ['$scope', 'DataService', 
	function($scope, DataService) {
		//
		$scope.entity = {
			// 'sex': 'male'
		};

		$scope.generateData = function() {console.log(DataService);
			DataService.getData('/dataGenerate/scroll?name=123')
				.then(function(data) {
					console.log(data);
				}, function(msg) {
					console.log('msg-->', msg);
				});
		};

	}
]);

app.controller('listItemCtrl', ['$scope', 
	function ($scope) {
		// 
		var vm = $scope.vm = {
			countries: ['中国', '英国', '美国', '法国', '俄罗斯', '印度', '德国', '西班牙', '南非', '中非', '埃及', '墨西哥']
		};
	}
]);

// directive bind strategy
app.directive('directParam', function() {
		return {
			restrict: 'ECMA',
			template: '<div>指令中:{{ name }}</div>',
			scope: {
				name: '@forName'
			}
		}
	})
	.controller('nameCtrl', ['$scope', 
		function($scope){
			$scope.name = '张三';
		}
	])