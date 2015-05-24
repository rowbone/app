'use strict';

// 人员信息页签
app.controller('OrgStaffsCtrl', ['$scope', '$http', 'OrgSearch', 'CollectionService', '$rootScope', '$modal', 
	function($scope, $http, OrgSearch, CollectionService, $rootScope, $modal) {
		$scope.orgStaffs = [];
		
		$scope.$watch(function() {
			return OrgSearch.getOrg();
		}, function(newVal) {
			getOrgStaffs(newVal.ID);
		}, true);
		
		$scope.$watch(function() {
			return CollectionService.getPersons();
		}, function(newVal, oldVal) {
			$scope.collectionPersons = newVal;
		}, true);
		
		var getOrgStaffs = function(selectedOrgId) {
			var orgStaffsUrl = '/service/staffInfo!queryActStaffByOrgUnitId';

			$http.post(orgStaffsUrl, {ORG_UNIT_ID:selectedOrgId})
				.success(function(data, status, headers, config) {
					var staffs = data.obj;
					var collectionPersons = $scope.collectionPersons;
					for(var i=0; i<staffs.length; i++) {
						for(var j=0; j<collectionPersons.length; j++) {
							if(staffs[i].ID == collectionPersons[j].FOLLOW_ITEM) {
								staffs[i].isInCollection = true;
								break;
							}
						}
					}
					$scope.orgStaffs = staffs;
				})
				.error(function(data, status, headers, config) {
					console.log('Get ' + orgStaffsUrl + ' wrong...');
				});
		};
		// 添加关注确认
		$scope.collectionConfirm = function(user, strType) {
			var urlAddCollection = '/service/followItem!saveEntity',
				staffId = $rootScope.userInfo.ID,
				followType = 'STAFF',
				followName = user.NAME,
				followId = user.ID,
				params = {
					'STAFF_ID': staffId,
					'FOLLOW_TYPE': followType,
					'NAME': followName,
					'FOLLOW_ITEM': followId
				};
				
			$http.post(urlAddCollection, params)
				.success(function(data, status, headers, config) {
					var searchResults = $scope.orgStaffs;
					var iLen = searchResults.length;
					for(var i=0; i<iLen; i++) {
						if(searchResults[i].ID == followId) {
							searchResults[i].isInCollection = true;
							break;
						}
					}
					CollectionService.addPerson(data.obj);
				})
				.error(function(data, status, headers, config) {
					console.error(data);
				});
		};
		// 人员详细信息
		$scope.showStaffInfo = function(staff) {
			
			// 获取当前人在关注列表中的对象
			var staffFollowItem = null;
			if(staff.isInCollection) {
				var collectionsPersons = $scope.collectionPersons;
				var iLen = collectionsPersons.length;
				for(var i=0; i<iLen; i++) {
					if(staff.ID == collectionsPersons[i].FOLLOW_ITEM) {
						staffFollowItem = collectionsPersons[i];
						break;
					}
				}
			}
//			var modalInstance = $modal.open({
//				templateUrl: 'app/business/cam/staffdetail/staff-info.html',
//				controller: 'StaffInfoCtrl',
//				resolve: {
//					modalParams: function() {
//						var objParams = {
//							staff: staff,
//							staffFollowItem: staffFollowItem
//						};
//
//						return objParams;		
//					}
//				}
//			});
		};
		
		
	}
]);