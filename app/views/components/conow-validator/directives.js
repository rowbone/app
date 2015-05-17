'use strict';

app.directive('directValidate', ['$timeout', 
	function($timeout) {
		return {
			restrict: 'AE',
			template: '<input type="text" name="abc" class="form-control" placeholder="指令中的元素校验！" ng-model="entity.abc" >',
			link: function(scope, elem, attrs) {
				console.log('linking...........');
				console.log(attrs.$attr);
			}
		}
	}
]);