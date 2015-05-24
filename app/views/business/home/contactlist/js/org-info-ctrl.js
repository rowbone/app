'use strict';

// 组织信息页签
app.controller('OrgInfoCtrl', ['$scope', '$http', 'OrgSearch', 'followService', '$rootScope', 
	function($scope, $http, OrgSearch, followService, $rootScope) {
		$scope.orgInfo = {};
		var selectedOrg = OrgSearch.getOrg();

		var orgInfoUrl = '/service/orgUnit!queryOrgUnitInfoInCam?ID=' + selectedOrg.ID;

		$http.post(orgInfoUrl)
			.success(function(data, status, headers, config) {
				$scope.orgInfo = data.obj.orgUnit;
				
//				$scope.$watch(function() {
//					return followService.getAll();
//				}, function(newVal, oldVal) {
//					var orgs = followService.getOrgs();
//					for(var i=0; i<orgs.length; i++) {
//						if(orgs[i].FOLLOW_ITEM == selectedOrg.ID) {
//							$scope.collectionItem = orgs[i];
//							$scope.orgInfo.isInCollection = true;
//							break;
//						}
//					}
//				}, true);
				
				var collectionOrgs = followService.getOrgs();
				for(var i=0; i<collectionOrgs.length; i++) {
					if(selectedOrg.ID == collectionOrgs[i].FOLLOW_ITEM) {
						$scope.orgInfo.isInCollection = true;
						$scope.collectionItem = collectionOrgs[i];
						break;
					}
				}
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + orgInfoUrl + ' wrong...');
			});	
		// 关注/取消关注
		$scope.collectionConfirm = function(org, strType) {
			var urlAddCollection = '',
				staffId = '',
				followType = '',
				followName = '',
				followId = '',
				params = {};
			if(strType == 'add') {
				urlAddCollection = '/service/followItem!saveEntity';
				staffId = $rootScope.userInfo.ID,
				followType = 'ORG',
				followName = org.ORG_UNIT_SHORT_NAME,
				followId = org.ID,
				params = {
					'STAFF_ID': staffId,
					'FOLLOW_TYPE': followType,
					'NAME': followName,
					'FOLLOW_ITEM': followId
				};
			}
				
			if(strType == 'remove') {
				urlAddCollection = '/service/followItem!deleteEntity';
				var collectionItemId = $scope.collectionItem.ID;
				params = {
					'ID': collectionItemId
				};
			}
					
			$http.post(urlAddCollection, params)
				.success(function(data, status, headers, config) {
					if(strType == 'remove') {
						followService.removeOrg($scope.collectionItem);
						org.isInCollection = false;
					} else {
						followService.addOrg(data.obj);
						$scope.collectionItem = data.obj;
						org.isInCollection = true;
					}
				})
				.error(function(data, status, headers, config) {
					console.error(data);
				});
 	 	};
	}
]);