'use strict';

app.controller('conowGridDemoCtrl', ['$scope', 'i18nService', '$filter', 'DataService', 
	function($scope, i18nService, $filter, DataService) {

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

		// DataService.getData('views/components/conow-responsive-table/data/conow-grid-data.json')
		// 	.then(function(data) {
		// 		$scope.gridOptions.data = data;

		// 		// var friends = data[0].friends;
		// 		// var friend = {};

		// 		// for(var i=0, iLen=friends.length; i<iLen; i++) {
		// 		// 	friend = friends[i];
		// 		// 	$scope.gridOptions.columnDefs.push({ name: friend["name"], field: });
		// 		// }
		// 	}, function(msg) {
		// 		console.error(msg);
		// 	});

		$scope.gridOptions = {
			// enableFiltering: false,
			// enableGridMenu: true,
			enableRowSelection: true,
			enableSelectAll: false,
			multiSelect: true,
			enableRowHeaderSelection: false,
			// onRegisterApi: function(gridApi) {
			// 	$scope.gridApi = gridApi;
			// 	$scope.gridApi.grid.registerRowsProcessor($scope.singleFilter, 200);
			// },
			// data: $scope.myData,
			// filterOptions: $scope.filterOptions,
			singleFilter: false,
			select: 'multiply',
			url: 'views/components/conow-responsive-table/data/conow-grid-data.json',
			// url: 'views/components/conow-responsive-table/data/pagination1.json',
			columnDefs: [
				{ name: 'firstName', field: 'firstName' }, 
				{ name: 'lastName', field: 'lastName' }, 
				{ name: 'lastName2', field: 'lastName' }, 
				{ name: 'company', field: 'company' }, 
				{ name: 'firstFriend', field: 'friends[0]' }, 
				{ name: 'secondFriend', field: 'friends[1]' }, 
				{ name: 'thirdFriend', field: 'friends[2]' }
			]
		};


	}
])