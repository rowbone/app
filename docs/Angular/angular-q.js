'use strict';

app.controller('QCtrl', ['$scope', '$q', '$timeout', 
	function($scope, $q, $timeout) {
		function asyncGreet(name) {
			var deffered = $q.defer();
			$timeout(function() {
				$scope.$apply(function() {
					deffered.notify('About to greet ' + name + '.');

					if(okToGreet(name)) {
						deffered.resolve('Hello, ' + name + '!');
					} else {
						deffered.reject('Greeting ' + name + ' is not allowed.');
					}
				});
			}, 1000);

			return deffered.promise;
		}

		var promise = asyncGreet('Robin Hood');
		promise.then(function(greeting) {
				alert('Success: ' + greeting);
			}, function(reason) {
				alert('Failed: ' + reason);
			}, function(update){
				alert('Got notifacation ' + update);
			});
	}
]);
