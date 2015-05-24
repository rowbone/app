'use strict';

// 下级组织页签
app.controller('ChildOrgsCtrl', ['$scope', '$http', 'OrgSearch', 'followService', '$rootScope', 
	function($scope, $http, OrgSearch, followService, $rootScope) {
		
		$scope.$watch(function() {
			return OrgSearch.getOrg();
		}, function(newVal) {
			getChildOrgs(newVal.ID);
		}, true);
		
		$scope.$watch(function() {
			return followService.getOrgs();
		}, function(newVal, oldVal) {
			$scope.collectionOrgs = newVal;
		}, true);
		
		// 获取下级组织信息
		var getChildOrgs = function(selectedOrgId) {			
			var childOrgsUrl = '/service/orgUnit!queryNextContactTreeById';

			$http.post(childOrgsUrl, {ORG_ID:selectedOrgId})
				.success(function(data, status, headers, config) {
					var orgs = data.obj;
					var collectionOrgs = $scope.collectionOrgs;
					for(var i=0; i<orgs.length; i++) {
						for(var j=0; j<collectionOrgs.length; j++) {
							if(orgs[i].ID == collectionOrgs[j].FOLLOW_ITEM) {
								orgs[i].isInCollection = true;
								break;
							}
						}
					}
					$scope.orgs = orgs;
				})
				.error(function(data, status, headers, config) {
					console.log('Get ' + childOrgsUrl + ' wrong...');
				});
		};
			
		// 查看组织详细信息
		$scope.showOrgInfo = function(org) {
			OrgSearch.setOrg(org);
		};
		

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