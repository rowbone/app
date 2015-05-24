'use strict';

// 找组织
app.controller('OrgSearchCtrl', ['$scope', '$http', '$timeout', '$modal', 'OrgSearch', 'DataService', '$rootScope', '$filter', 'CollectionService', 
	function($scope, $http, $timeout, $modal, OrgSearch, DataService, $rootScope, $filter, CollectionService) {
		var entity = $scope.entity = {};
		var options = $scope.options = {
			search: false,
			showDetail: false
		};
		var orgAreaUrl = 'data/bz/home/contactlist2/orgUnit-query12BranchCourts.json';
		var orgClassifyUrl = 'data/bz/home/contactlist2/common-queryOptions-type-DICT_OPTION-DICT_CODE-HR_ORG_CLASS.json';
		var orgSearchUrl = 'app/business/home/contactlist/data/orgs-search.json';
		var orgDetailUrl = '/service/orgUnit!queryOrgUnitInfoInCam?ID=';

		$http.post('/service/orgUnit!query12BranchCourts')
			.success(function(result){
				 entity.area = result.obj;
			 });
		$http.post('/service/common!queryOptions?type=DICT_OPTION&DICT_CODE=HR_ORG_CLASS')
			.success(function(result){
				var arr = result.obj.split(';'),
					obj = {},
					arrClassify = [],
					arr2 = [];
				for(var i=0; i<arr.length; i++) {
					arr2 = arr[i].split(':');
					obj = {
						key: arr2[0],
						value: arr2[1]
					};
					arrClassify.push(obj);
				}
				entity.classify = arrClassify;
			 });
		// 获取所有的组织信息
		$http.post('/service/orgUnit!queryAcademicAllOrg')
			.success(function(data, status, headers, config) {
				if(data.obj){
					entity.allOrgs = data.obj;
				}
			})
			.error(function(data, status, headers, config) {
				// console.error(data);
			});


//		entity.area = ['北京', '上海', '广州', '沈阳', '南京', '成都', '兰州', '武汉', '西安', '长春', '昆明', '新疆'];
//		entity.classify = ['大科学中心', '创新研究院', '卓越创新中心', '特色研究所', '其他'];

		$scope.areaSelect = function(obj) {
			entity.areaSelected = (entity.areaSelected == obj) ? null : obj;
		};

		$scope.classifySelect = function(obj) {
			entity.classifySelected = (entity.classifySelected == obj) ? null : obj;
		};
		
		$scope.$watch(function() {
			return {
				searchKey: entity.searchKey,
				areaSelected: entity.areaSelected,
				classifySelected: entity.classifySelected
			};
		}, function(newVal, oldVal) {
			$scope.enterPress(null, 'btn');
		}, true);
		
		// 获取已关注组织
		$scope.$watch(function() {
			return CollectionService.getOrgs();
		}, function(newVal, oldVal) {
			var orgs = CollectionService.getOrgs();
			entity.collectionsOrgs = orgs;
			// 触发过滤操作
			$scope.enterPress(null, 'btn');
		}, true);

		// 搜索框 enter 触发搜索事件
		$scope.enterPress = function(e, trigType) {
			var params = {};

			if(trigType == 'btn' || e.keyCode === 13) {
				options.search = true;
				entity.searchResults = null;

				params.searchArea = entity.areaSelected;
				params.searchClassify = entity.classifySelected;
				
				var data = entity.allOrgs;
				if(data != undefined) {
					if(entity.searchKey != undefined) {
						data = $filter('filter')(data, entity.searchKey);
					}
					if(entity.areaSelected != undefined) {
						data = $filter('filter')(data, {'ORG_UNIT_RGN': entity.areaSelected.ORG_UNIT_RGN});
					}
					if(entity.classifySelected != undefined) {
						data = $filter('filter')(data, {'ORG_CLASS': entity.classifySelected.key});
					}				
			
					var iDataLen = data.length;
					var collectionsOrgs = entity.collectionsOrgs;
					var iLen = collectionsOrgs.length;
					for(var i=0; i<iDataLen; i++) {
						data[i].isInCollection = false;
						for(var j=0; j<iLen; j++) {
							if(data[i].ID == collectionsOrgs[j].FOLLOW_ITEM) {
								data[i].isInCollection = true;
								break;
							}
						}
					}
					entity.searchResults = data;
				}
			}
			if(e != null) {
				e.stopPropagation();
			}			
		};
		
		$scope.$watch(function() {
			return OrgSearch.getOrg();
		}, function(newVal) {
			if(newVal) {
				$scope.showOrgInfo(newVal);
			}			
		});
		// 组织信息弹出层
		$scope.showOrgInfo = function(org) {
			OrgSearch.setOrg(org);
			// 获取当前人在关注列表中的对象
			var orgFollowItem = null;
			if(org.isInCollection) {
				var collectionsOrgs = entity.collectionsOrgs;
				var iLen = collectionsOrgs.length;
				for(var i=0; i<iLen; i++) {
					if(org.ID == collectionsOrgs[i].FOLLOW_ITEM) {
						orgFollowItem = collectionsOrgs[i];
						break;
					}
				}
			}
			var modalInstance = $modal.open({
				templateUrl: 'app/business/cam/organdstaff/org-info-all.html',
				controller: 'OrgInfoAllCtrl',
				resolve: {
					modalParams: function() {
						var objParams = {
							orgFollowItem: orgFollowItem
						};

						return objParams;		
					}
				}
			});
		};
		
		// 显示对应的组织信息
		$scope.showDetailInfo = function(org) {
			options.showDetail = true;			
			$scope.selectedOrg = org;
			
			OrgSearch.setOrg(org);
			
			// 组织面包屑
			$http.post(orgDetailUrl + org.ID)
				.success(function(data, status, headers, config) {
					$scope.orgAndFatherOrgs = data.obj.orgUnit.orgAndFatherOrgs;
				})
				.error(function(data, status, headers, config) {
					console.log(data);
				});
		};

		// 添加关注确认
		$scope.collectionConfirm = function(org, strType) {

			var urlAddCollection = '/service/followItem!saveEntity',
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
			
			$http.post(urlAddCollection, params)
				.success(function(data, status, headers, config) {
					CollectionService.addOrg(data.obj);
					var searchResults = entity.searchResults;
					var iLen = searchResults.length;
					for(var i=0; i<iLen; i++) {
						if(searchResults[i].ID == followId) {
							searchResults[i].isInCollection = true;
							break;
						}
					}
				})
				.error(function(data, status, headers, config) {
					console.error(data);
				});

		};
		
		// 返回通讯录列表
		$scope.backContactlist = function() {
			options.showDetail = false;
		};
		
	}
]);