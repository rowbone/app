'use strict';

// 找人 controller
app.controller('PersonSearchCtrl', ['$scope', '$http', '$timeout', '$modal', 'followService', 'DataService', '$rootScope', 'DataSelected', 
	function($scope, $http, $timeout, $modal, followService, DataService, $rootScope, DataSelected) {
		var entity = $scope.entity = {};
		var options = $scope.options = {
			search: false
		};
		var personSearchUrl = '/service/staffInfo!queryStaffInfoByNameByPage';

		entity.searchType = 'name';
		
		// 获取已关注人员		
		$scope.$watch(function() {
			return followService.getStaffs();
		}, function(newVal, oldVal) {
console.log('in watch....');
			var staffs = newVal;			
			entity.followedStaffs = staffs;
console.log(entity.followedStaffs)
			// $scope.enterPress(null, 'btn');
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

				DataService.postData(personSearchUrl, params)
					.then(function(data) {
						data = data.obj;
						var iDataLen = data.length;
						var followedStaffs = entity.followedStaffs;
						var iLen = followedStaffs.length;
						for(var i=0; i<iDataLen; i++) {
							for(var j=0; j<iLen; j++) {
								if(data[i].ID == followedStaffs[j].FOLLOW_ITEM) {
									data[i].isInCollection = true;
									break;
								}
							}
						}
						entity.searchResults = data;
					}, function(msg) {
						console.log(msg);
					});

			}
			if(e != null) {
				e.stopPropagation();
			}			
		};

		// 人员详细信息
		$scope.showStaffInfo = function(staff) {
console.log(staff);
			DataSelected.setStaff(staff);
		};

		// 添加关注
		$scope.follow = function(staff) {
			console.log(staff)
			// var staffId = $rootScope.userInfo.ID,
			var staffId = '1234567890',
					followType = 'STAFF',
					followName = staff.NAME,
					followId = staff.ID,
					params = {
						'STAFF_ID': staffId,
						'FOLLOW_TYPE': followType,
						'NAME': followName,
						'FOLLOW_ITEM': followId
					};

			followService.follow(params);
		};

		// 取消关注
		$scope.unFollow = function(followItem, strType) {
			//
			followService.unFollow(followItem, strType);
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
					followService.addPerson(data.obj);
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