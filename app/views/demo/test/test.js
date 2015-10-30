'use strict';

app.controller('ngBindCtrl', ['$scope', '$sce', 
	function($scope, $sce) {
		var vm = $scope.vm = {
			'info': 'abc',
			'name': 'name-string',
			'age': 4,
			'html': '<div class="container">' 
				+ '<div class="title">{{ vm.info }}' 
				+ '<div class="content">content</div></div>'
		};

		$scope.safeHtml = $sce.trustAsHtml(vm.html);

		$scope.items = [
			{
				name: '111',
				age: 2,
				children: [
					{
						name: '222',
						age: 5
					}
				]
			}, {
				name: '123',
				age: 2
			}, {
				name: '111',
				age: 2
			}, {
				name: '111',
				age: 2
			}, {
				name: '111',
				age: 2
			}
		];
	}
]);

app.directive('compileBindHtml', ['$compile', 
	function($compile) {
		return {
			restrict: 'AE',
			link: function(scope, elem, attrs) {
				var fn = function() {
					return scope.$eval(attrs.compileBindHtml);
				};

				scope.$watch(fn, function(newVal) {
					elem.html(newVal);
					$compile(elem.contents())(scope);
				});
			}
		}
	}
]);