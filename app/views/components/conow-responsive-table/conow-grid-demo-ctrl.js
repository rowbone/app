'use strict';

app.controller('conowGridDemoCtrl', ['$scope', 'i18nService', '$filter', 'DataService', 
	function($scope, i18nService, $filter, DataService) {

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

		$scope.filteredData = $scope.myData;

		$scope.filterOptions = {
			filterText: ''
		};

		$scope.gridOptions = {
			// enableFiltering: false,
			// enableGridMenu: true,
			// enableRowSelection: true,
			// enableSelectAll: true,
			// onRegisterApi: function(gridApi) {
			// 	$scope.gridApi = gridApi;
			// 	$scope.gridApi.grid.registerRowsProcessor($scope.singleFilter, 200);
			// },
			data: 'filteredData',
			// filterOptions: $scope.filterOptions,
			singleFilter: true,
			columnDefs: [
				{ name: 'firstName', field: 'firstName' }, 
				{ name: 'firstFriend', field: 'friends[0]' }, 
				{ name: 'city', field: 'address.city' }, 
				{ name: 'getZip', field: 'getZip()' }
			]
		};

		$scope.filter = function() {
			$scope.filteredData = $filter('filter')($scope.myData, $scope.filterOptions.filterText);
		};

	}
])