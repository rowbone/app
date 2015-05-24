'use strict';

//已关注搜索弹出层 controller
app.controller('CollectionSearchModalCtrl', ['$scope', '$modalInstance', '$filter', 'modalParams', 
	function($scope, $modalInstance, $filter, modalParams) {

		var entity = $scope.entity = {};
		var options = $scope.options = {
			search: false
		};

		entity.collectionsPersons = modalParams.collectionsPersons;
		entity.collectionsOrgs = modalParams.collectionsOrgs;

		$scope.$watch('entity.searchKey', function(newVal) {
			if(newVal == ''){
				options.search = false;
			} else {
				entity.filteredPersons = $filter('orderBy')($filter('filter')(entity.collectionsPersons, newVal), 'GROUPCODE');
				entity.filteredOrgs = $filter('orderBy')($filter('filter')(entity.collectionsOrgs, newVal), 'GROUPCODE');
			}
		});

		$scope.showDetail = function(obj, showType) {
			$modalInstance.close({
				objEntity: obj,
				showType: showType
			});
		};

	}
]);