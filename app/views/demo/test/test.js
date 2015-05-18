'use strict';

app.controller('ExecFuncInServiceCtrl', ['$scope', 'ExecFuncService', 
	function($scope, ExecFuncService) {
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