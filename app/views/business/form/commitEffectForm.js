'use strict';

app.controller('CommitEffectFormCtrl', ['$scope', '$http', 'FormOperation', 
	function($scope, $http, FormOperation) {

		$scope.entity = {
			'userName': 'hr1',
			'password': 'hr1'
		}

		$scope.save = function(data) {
			console.log('CommitEffectFormCtrl save');
			// FormOperation.save('pOst', 'users/signin', $scope.entity, 'app/form/selectForm');
			// return data || $scope.entity;
		}

		$scope.submit = function() {
			console.log('CommitEffectFormCtrl submit');
			// FormOperation.submit('post', 'users/signin', $scope.entity, {state: 'app.form.simpleForm', url: 'app/form/simpleForm'});
		};

		$scope.funcClick = function() {
			return $scope.entity;
		}

	}
])