'use strict';

// 找组织
app.controller('OrgSearchCtrl', ['$scope', '$http', '$timeout', '$modal', 'OrgSearch', 'DataService', '$rootScope', '$filter', 'followService', 
	function($scope, $http, $timeout, $modal, OrgSearch, DataService, $rootScope, $filter, followService) {
		var entity = $scope.entity = {};
		var options = $scope.options = {
			search: false
		};
		var orgAreaUrl = '/service/orgUnit!query12BranchCourts';
		var orgClassifyUrl = '/service/common!queryOptions?type=DICT_OPTION&DICT_CODE=HR_ORG_CLASS';
		var orgSearchUrl = 'app/business/home/contactlist/data/orgs-search.json';
		var orgDetailUrl = '/service/orgUnit!queryOrgUnitInfoInCam?ID=';
		var orgAllUrl = '/service/orgUnit!queryAcademicAllOrg';

		DataService.postData(orgAreaUrl)
			.then(function(data) {
				entity.area = data.obj;
			}, function(msg) {
				console.log(msg);
				entity.area = [];
			})

		DataService.postData(orgClassifyUrl)
			.then(function(data) {
				var arr = data.obj.split(';'),
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

			})

		// 获取所有的组织信息
		DataService.postData(orgAllUrl)
			.then(function(data) {console.log(data)
				if(data.obj) {
					entity.allOrgs = data.obj;

					options.search = true;
					entity.searchResults = entity.allOrgs;
				}
			}, function(msg) {
				console.log(msg);
			});

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
			return followService.getOrgs();
		}, function(newVal, oldVal) {
			var orgs = followService.getOrgs();
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
					followService.addOrg(data.obj);
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