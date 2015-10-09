'use strict';

app.controller('conowGridDemoCtrl', ['$scope', 'i18nService', 
	function($scope, i18nService) {

		// i18nService.setCurrentLang('zh-cn');

		$scope.myData = [
			{
				"firstName": "Cox",
				"lastName": "Carney",
				"company": "Enormo",
				"employed": true,
				"friends": ["friend0", "friend1", "friend2"],
				"address": {street:"301 Dove Ave", city:"Laurel", zip:"39565"},
				"getZip": function() { return this.address.zip; }
			}, {
				"firstName": "Lorraine",
				"lastName": "Wise",
				"company": "Comveyer",
				"employed": false,
				"friends": ["friend10", "friend11", "friend12"],
				"address": {street:"301 Dove Ave", city:"Guangzhou", zip:"12345"},
				"getZip": function() { return this.address.zip; }
			}, {
				"firstName": "Nancy",
				"lastName": "Waters",
				"company": "Fuelton",
				"employed": false,
				"friends": ["friend20", "friend21", "friend22"],
				"address": {street:"301 Dove Ave", city:"Beijing", zip:"abcde"},
				"getZip": function() { return this.address.zip; }
			}
		];

		$scope.gridOptions = {
			enableFiltering: true,
			enableGridMenu: true,
			data: $scope.myData,
			columnDefs: [
				{ name: 'firstName', field: 'firstName' }, 
				{ name: 'firstFriend', field: 'friends[0]' }, 
				{ name: 'city', field: 'address.city' }, 
				{ name: 'getZip', field: 'getZip()' }
			]
		};

		$scope.filter = function() {
			$scope.gridApi.grid.refresh();
		};

	}
])