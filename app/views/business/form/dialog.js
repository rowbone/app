'use strict';

app.controller('DialogDemoCtrl', ['$scope', '$rootScope', 'ngDialog', 
	function($scope, $rootScope, ngDialog) {
		//
		console.log('DialogDemoCtrl...........');

		$scope.entity = {
			username: 'username1'
		};

		$scope.open = function() {
		    ngDialog.open({
		        template: 'deleteConfirm',
		        controller: 'DeleteCtrl',
		        data: {
		            foo: 'some data'
		        },
		        closeByDocument: false
		    });
		};

	}

]);

app.controller('DeleteCtrl', ['$scope', '$timeout', 'ngDialog', function($scope, $timeout, ngDialog) {

	$scope.confirm = function() {
		console.log('confirm.............');
		var count = parseInt(Math.random() * 10);
		ngDialog.close();
		if(count % 2 == 0) {
			ngDialog.open({
				template: '<div class="text-success"><span class="glyphicon glyphicon-ok"></span>删除成功</div>',
				closeByDocument: false,
				closeByEscape: false,
				plain: true,
				overlay: false
			});
		} else {
			ngDialog.open({
				template: '<div class="text-danger"><span class="glyphicon glyphicon-remove"></span>删除失败</div>',
				closeByDocument: false,
				closeByEscape: false,
				plain: true,
				overlay: false
			});
		}


		$timeout(function() {
			ngDialog.close();
		}, 1000);
	};

	$scope.cancel = function() {
		console.log('cancel.........');
		ngDialog.close();
	};

}])