'use strict';

app.controller('CommitEffectFormCtrl', ['$scope', '$http', 'FormOperation', 
	function($scope, $http, FormOperation) {

		$scope.entity = {
			'userName': 'hr1',
			'password': 'hr1'
		}

		$scope.save = function() {
			FormOperation.save('pOst', 'users/signin', $scope.entity, 'app/form/selectForm');
		}

		$scope.submit = function() {
			FormOperation.submit('post', 'users/signin', $scope.entity, {state: 'app.form.simpleForm', url: 'app/form/simpleForm'});
		};

	}
])