'use strict';

app.controller('contactlistCtrlNew', ['$scope', 'DataService', 
	function($scope, DataService) {
		//

		console.log('contactlistCtrlNew');

		$scope.recentContacts = [
			{ 
				'name': '温丽璇',
				'nick': '当当',
				'org': '科南软件'
			}, { 
				'name': '黄吉米',
				'nick': 'aaaaaaJimmy11111111111111',
				'org': '科南软件'
			}
		];

		DataService.postData('/contactlist/', { 'name': 'abc', 'age': 8})
			.then(function(data) {
				console.log('data-->', data);
				$scope.orgUnitInfo = data;
			}, function(msg) {
				console.log('msg-->', msg);
			});
	}
])