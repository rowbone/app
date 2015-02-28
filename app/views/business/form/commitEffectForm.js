'use strict';

app.controller('CommitEffectFormCtrl', ['$scope', '$http',
	function($scope, $http) {

		$scope.entity = {
			'userName': 'hr1',
			'password': 'hr1'
		}

		$scope.save = function() {
			// FormOperation.save('pOst', 'users/signin', $scope.entity, 'app/form/selectForm');
			return $scope.entity;
		}

		$scope.submit = function() {
			return $scope.entity;
			// FormOperation.submit('post', 'users/signin', $scope.entity, {state: 'app.form.simpleForm', url: 'app/form/simpleForm'});
		};

		$scope.funcClick = function() {
			return $scope.entity;
		}

	}
])