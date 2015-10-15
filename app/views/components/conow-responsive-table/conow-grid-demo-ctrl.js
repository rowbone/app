'use strict';

app.controller('conowGridDemoCtrl', ['$scope', 'i18nService', '$filter', 'DataService', 'uiGridConstants', 
	function($scope, i18nService, $filter, DataService, uiGridConstants) {

		var vm = $scope.vm = {};

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

		$scope.gridOptions1 = {
			// singleFilter: false,	// true/false
			// pagination: false,	// true/false
			
			select: 'single',	// single/multiply/undefined
			url: 'views/components/conow-responsive-table/data/conow-grid-data.json',
			// url: 'views/components/conow-responsive-table/data/pagination1.json',
			showColumnFooter: true,
			selected: [
				{
					"firstName": "Cox11111111111111111111111111111",
					"lastName": "Carney",
					"company": "Enormo",
					"friends": ["friend0", "friend1", "friend2"]
				}, {
					"firstName": "Lorraine",
					"lastName": "Wise",
					"company": "Comveyer",
					"friends": ["friend10", "friend11", "friend12"]
				}
			],
			columnDefs: [
				{ name: 'firstName', field: 'firstName', width: 100}, 
				{ name: 'lastName', field: 'lastName', width: 300 }, 
				{ name: 'lastName2', field: 'lastName', width: 200 }, 
				{ name: 'Age', field: 'age', width: 50 }, 
				{ name: 'Min Age', field: 'age', width: 100, aggregationType: uiGridConstants.aggregationTypes.min }, 
				{ name: 'Max Age', field: 'age', width: 100, aggregationType: uiGridConstants.aggregationTypes.max }, 
				{ name: 'Sum Age', field: 'age', width: 100, aggregationType: uiGridConstants.aggregationTypes.sum }, 
				{ name: 'Average Age', field: 'age', width: 100, aggregationType: uiGridConstants.aggregationTypes.avg }, 
				{ name: 'company', field: 'company', width: 300 }, 
				{ name: 'firstFriend', field: 'friends[0]', width: 200 }, 
				{ name: 'secondFriend', field: 'friends[1]', width: 100 }, 
				{ name: 'thirdFriend', field: 'friends[2]', width: 100 }
			]
		};

		$scope.gridOptions2 = {
			singleFilter: true,	// true/false
			pagination: true,	// true/false
			select: 'single',	// single/multiply/undefined
			url: 'views/components/conow-responsive-table/data/pagination.json',
			columnDefs: [
			]
		};


	}
])