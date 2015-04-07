'use strict';

app.directive('directValidate', ['$timeout', 
	function($timeout) {
		return {
			restrict: 'AE',
			template: '<input type="text" placeholder="指令中的元素校验！" >',
			link: function(scope, elem, attrs) {
				console.log('linking...........');
				console.log(attrs);
			}
		}
	}
]);