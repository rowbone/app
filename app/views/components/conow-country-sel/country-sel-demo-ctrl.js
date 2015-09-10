'use strict';

app.controller('countryCascadeSelDemoCtrl', ['$scope', '$stateParams',
	function($scope, $stateParams) {
		// 
		// console.log('$stateParams-->', $stateParams);

		var vm = $scope.vm = {
			sel: '208'
		};
	}
]);

app.controller('countrySelDemoCtrl', ['$scope', 'peerCountriesService', 
	function($scope, peerCountriesService) {
		// 
		var vm = $scope.vm = {
			sel: '446'
		};

		var options = $scope.options = {
			dataSrcUrl: 'views/components/conow-country-sel/data/country-queryAllCountry.json',
			getSelectedValueUrl: 'views/components/conow-country-sel/data/school/get-selected-value.json', 
			getDataInitialsUrl: 'views/components/conow-country-sel/data/school/query-school-by-initials.json',
			searchUrl: 'views/components/conow-country-sel/data/school/query-school-by-name-spell.json',
			isLoadingAll: true,
			isHasCommon: true,
			isCommonExpanded: true,
			isShowAllLabels: true,
			isShowSearch: true,
			isMultiSelect: false,
			selectKey: 'CODE',
			selectValue: 'VALUE',
			colsPerRow: 2
		};

		peerCountriesService.peerCountriesPromise.then(function(data) {
			vm.selName = peerCountriesService.getSelectedCountryName(vm.sel);
		})
	}
]);

/**
 * schoolSelDemoCtrl
 * demo controller
 */
app.controller('schoolSelDemoCtrl', ['$scope', '$state',
	function($scope, $state) {

		$scope.alphabetGroupCallback = function(selected) {
			console.log(111111111);
			console.log(selected);
		};

		var options = $scope.options = {
			dataSrcUrl: 'views/components/conow-country-sel/data/school/query-is-common-school.json',
			getSelectedValueUrl: 'views/components/conow-country-sel/data/school/get-selected-value.json', 
			getDataInitialsUrl: 'views/components/conow-country-sel/data/school/query-school-by-initials.json',
			searchUrl: 'views/components/conow-country-sel/data/school/query-school-by-name-spell.json',
			isLoadingAll: false,
			isHasCommon: true,
			isCommonExpanded: true,
			isShowAllLabels: false,
			isShowSearch: true,
			isMultiSelect: false,
			selectKey: 'CODE',
			selectValue: 'VALUE',
			colsPerRow: 3
		};

		var vm = $scope.vm = {
			selected: '25'
		}

	}
]);

/**
 * areaSelDemoCtrl
 * demo controller
 */
app.controller('areaSelDemoCtrl', ['$scope', 
	function($scope) {
		var options = $scope.options = {
			dataSrcUrl: 'views/components/conow-alphabet-group/data/area/region-query-city.json',
			isLoadingAll: true,
			isHasCommon: true,
			isCommonExpanded: true,
			isShowAllLabels: false,
			isShowSearch: true,
			isMultiSelect: false,
			selectKey: 'CODE',
			selectValue: 'SHORT_NAME',
			selectTitle: 'NAME',
			colsPerRow: 4
		};

		var vm = $scope.vm = {
			selected: '44120000'
		}

	}
]);