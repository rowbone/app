'use strict';

app.controller('ToasterDemoCtrl', ['$scope', 'toaster', 
	function($scope, toaster) {console.log('toaster-->', toaster);
		console.log('in ToasterDemoCtrl-->');
		$scope.toaster = {
	      type: 'success',
	      title: 'Title',
	      text: 'Message'
	  };

	  $scope.pop = function(){console.log('1111111111111')
	      toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
	  };
	}
]);