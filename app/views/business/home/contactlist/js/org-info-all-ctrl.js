'use strict';

// 组织的所有信息弹出层 controller
app.controller('OrgInfoAllCtrl',  ['$scope', '$http', '$modalInstance', '$modal', '$timeout', '$rootScope', 'followService', 'OrgSearch', '$modalStack', 
    function($scope, $http, $modalInstance, $modal, $timeout, $rootScope, followService, OrgSearch, $modalStack) {
		var org = OrgSearch.getOrg();
		
		var func = function(org) {console.log('in func-->', org);
		    var orgDetailUrl = '/service/orgUnit!queryOrgUnitInfoInCam?ID=';
			
			// 组织面包屑
			$http.post(orgDetailUrl + org.ID)
				.success(function(data, status, headers, config) {
					$scope.orgAndFatherOrgs = data.obj.orgUnit.orgAndFatherOrgs;
				})
				.error(function(data, status, headers, config) {
					console.log(data);
				});
		};
		
		$scope.showOrgInfo = function(org) {			
			OrgSearch.setOrg(org);
		};

		$scope.$watch(function() {
			return OrgSearch.getOrg();
		}, function(newVal) {
			func(newVal);
		});
		
		// 返回通讯录
		$scope.backContactlist = function() {
//			$modalInstance.close();
			$modalStack.dismissAll();
		};
		
		$scope.cancel = function() {
//			$modalInstance.close();
			$modalStack.dismissAll();
		};
		
	}
]);