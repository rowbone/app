'use strict';

// 已关注 controller
app.controller('CollectionCtrl', ['$scope', '$http', '$timeout', '$filter', '$state', '$modal', 'DataService', 'CollectionService', 'OrgSearch', 'DataSelected', 
	function($scope, $http, $timeout, $filter, $state, $modal, DataService, CollectionService, OrgSearch, DataSelected) {
		var urlCollectionsOrgs = 'app/business/home/contactlist/data/collections-orgs.json',
			urlCollectionsPersons = 'app/business/home/contactlist/data/collections-persons.json',
			
			options = $scope.options = {
				isLoading: true,
				collectionNone: false,
				collectionOrgExpand: false,
				collectionPersonExpand: true,
				collectionPersonsGroupExpand: false
			},

			collections = $scope.collections = {
				persons: [],
				orgs: []
			};
		
		$scope.$watch(function() {
			return CollectionService.getAll();
		}, function(newVal, oldVal) {			
			$scope.collections.orgs = CollectionService.getOrgs();
			var persons = CollectionService.getPersons();
			for(var i=0; i<persons.length; i++) {
				if(persons[i].PHOTO == null) {
					persons[i].PHOTO = 'img/person/person_photo_2.png';
				}
			}
			var personsGroup = $filter('userGroup')(persons, 'GROUPCODE');
			collections.persons = persons;
			collections.personsGroup = personsGroup;
			
			if(collections.persons.length > 0 || collections.orgs.length > 0) {
				options.collectionNone = false;
			} else {
				options.collectionNone = true;
			}
			options.isLoading = false;
		}, true);		

		// 没有关注时，点击切换到“找人”，添加人员关注
		$scope.addCollection = function() {
			var iTabsLen = $scope.contactListTabs.length;
			for(var i=0; i<iTabsLen; i++) {
				$scope.contactListTabs[i] = false;
			}
			$scope.contactListTabs[1] = true;
		};
		// 关注人员过滤，点击人员分组字母时触发
		$scope.collectionPersonFilter = function(group, subLabel) {
			group.selectedSub = subLabel;
		};
		// 人员详细信息
		$scope.showStaffInfo = function(staffFollowItem) {			
			//
			var staff = {
				'ID': staffFollowItem.FOLLOW_ITEM,
				'isInCollection': true
			};
			console.log(OrgSearch)

			DataSelected.setStaff(staff);
		};
		// 过滤弹出框
		$scope.openSearchModal = function() {
			var modalInstance = $modal.open({
				templateUrl: 'app/business/home/contactlist/collectionSearchModal.html',
				controller: 'CollectionSearchModalCtrl',
				resolve: {
					modalParams: function() {
						var objParams = {
							collectionsPersons: collections.persons,
							collectionsOrgs: collections.orgs
						};

						return objParams;
					}
				}
			});

			var modalInstance2 = null;
			modalInstance.result.then(function(rtnVal) {
				if(rtnVal.objEntity && rtnVal.showType) {

					if(rtnVal.showType == 'person') {
						modalInstance2 = $modal.open({
							templateUrl: 'app/business/cam/staffdetail/staff-info.html',
							controller: 'StaffInfoCtrl'
						});
					}
				}
			}, function(msg) {
				console.log(msg);
			});
		};
		// 查看组织信息
		$scope.showOrgInfo = function(orgFollowItem) {
console.log(orgFollowItem)
			OrgSearch.setOrg({'ID': orgFollowItem.FOLLOW_ITEM});
		};
		
	}
]);