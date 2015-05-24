'use strict';

// 找人 controller
app.controller('PersonSearchCtrl', ['$scope', '$http', '$timeout', '$modal', 'CollectionService', 'DataService', '$rootScope', 
	function($scope, $http, $timeout, $modal, CollectionService, DataService, $rootScope) {
		var entity = $scope.entity = {};
		var options = $scope.options = {
			search: false
		};
		var personSearchUrl = '/service/staffInfo!queryStaffInfoByNameByPage';

		entity.searchType = 'name';
		
		// 获取已关注人员		
		$scope.$watch(function() {
			return CollectionService.getPersons();
		}, function(newVal, oldVal) {
			var persons = CollectionService.getPersons();			
			entity.collectionsPersons = persons;
			$scope.enterPress(null, 'btn');
//			if(persons && entity.searchResults) {
//				var iPersonsLen = persons.length;
//				var searchResults = entity.searchResults;
//				var iResultsLen = searchResults.length;
//				for(var i=0; i<iResultsLen; i++) {
//					searchResults.isInCollection = false;
//					for(var j=0; j<iPersonsLen; j++) {
//						if(persons[j].FOLLOW_ITEM == searchResults[i].ID) {
//							searchResults.isInCollection = true;
//							break;
//						}
//					}
//				}
//				entity.searchResults = searchResults;
//			}
		}, true);
		
		// 搜索框 enter 触发搜索事件
		$scope.enterPress = function(e, trigType) {		   
			var params = {
				page:1,
				pagesize:50
			};
			if(trigType == 'btn' || e.keyCode === 13) {
				options.search = true;
				entity.searchResults = null;
				
				if(entity.searchType == 'name') {
					personSearchUrl = '/service/staffInfo!queryStaffInfoByNameByPage';
					params['NAME'] = entity.searchKey;								
				}
				if(entity.searchType == 'fullText') {
					personSearchUrl = '/service/staffInfo!queryStaffListByResume';
					params['RESUME'] = entity.searchKey;
				}
	
				$http.post(personSearchUrl, params)
					.success(function(data, status, headers, config) {
						data = data.obj;
						var iDataLen = data.length;
						var collectionPersons = entity.collectionsPersons;
						var iLen = collectionPersons.length;
						for(var i=0; i<iDataLen; i++) {
							for(var j=0; j<iLen; j++) {
								if(data[i].ID == collectionPersons[j].FOLLOW_ITEM) {
									data[i].isInCollection = true;
									break;
								}
							}
						}
						entity.searchResults = data;
					})
					.error(function(data, status, headers, config) {
						console.log('Get ' + personSearchUrl + ' wrong...');
					});

			}
			if(e != null) {
				e.stopPropagation();
			}			
		};
		// 人员详细信息
		$scope.showStaffInfo = function(staff) {
			// 获取当前人在关注列表中的对象
			var staffFollowItem = null;
			if(staff.isInCollection) {
				var collectionsPersons = entity.collectionsPersons;
				var iLen = collectionsPersons.length;
				for(var i=0; i<iLen; i++) {
					if(staff.ID == collectionsPersons[i].FOLLOW_ITEM) {
						staffFollowItem = collectionsPersons[i];
						break;
					}
				}
			}
			var modalInstance = $modal.open({
				templateUrl: 'app/business/cam/staffdetail/staff-info.html',
				controller: 'StaffInfoCtrl',
				resolve: {
					modalParams: function() {
						var objParams = {
							staff: staff,
							staffFollowItem: staffFollowItem
						};

						return objParams;		
					}
				}
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
					var searchResults = entity.searchResults;
					var iLen = searchResults.length;
					for(var i=0; i<iLen; i++) {
						if(searchResults[i].ID == followId) {
							searchResults[i].isInCollection = true;
							break;
						}
					}
					data.obj.NAME = followName;
					CollectionService.addPerson(data.obj);
				})
				.error(function(data, status, headers, config) {
					console.error(data);
				});
		};
		// 代码直接触发搜索操作
		$scope.trigSearch = function() {
			$scope.enterPress(null, 'btn');
		};
	}
]);