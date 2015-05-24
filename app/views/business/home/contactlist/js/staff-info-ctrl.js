'use strict';

//个人信息
app.controller('StaffInfoCtrl', ['$scope', '$http', '$timeout', '$rootScope', 'followService', '$modalStack', 'DataSelected', 'DataService',
	function($scope, $http, $timeout, $rootScope, followService, $modalStack, DataSelected, DataService) {
		
		var entity = $scope.entity = {};
		var staff = DataSelected.getStaff();
console.log('staff-->', staff);
		var urlStaffInfo = '/service/staffInfo!queryStaffInfoAndTotalnameAndJobs?ID=' + staff.ID;

		DataService.postData(urlStaffInfo)
			.then(function(data) {
				entity = data.obj;
    		var imgSrc = 'img/person';
    		if(entity.PHOTO == null) {
	    		if(entity.GENDER == 'M') {
	    			entity.PHOTO = imgSrc + '/person_photo_2.png';
	    		} else {
	    			entity.PHOTO = imgSrc + '/person_photo_4.png';
	    		}	    			
    		}
     		// 是否已经关注
     		entity.isInCollection = staff.isInCollection;			
				$scope.entity = entity;
			}, function(msg) {
				console.log(msg);
			})

		// 增加/取消关注
		$scope.collectionConfirm = function(staff, strType) {
			var urlAddCollection = '',
				currUserId = '',
				followType = '',
				followName = '',
				followId = '',
				params = {};
			if(strType == 'add') {
				urlAddCollection = '/service/followItem!saveEntity';
				currUserId = $rootScope.userInfo.ID,
				followType = 'STAFF',
				followName = staff.NAME,
				followId = staff.ID,
				params = {
					'STAFF_ID': currUserId,
					'FOLLOW_TYPE': followType,
					'NAME': followName,
					'FOLLOW_ITEM': followId
				};
			}
				
			if(strType == 'remove') {
				urlAddCollection = '/service/followItem!deleteEntity';				
				params = {
					'ID': $scope.staffFollowItem.ID
				};
			}
					
			$http.post(urlAddCollection, params)
				.success(function(data, status, headers, config) {
					if(strType == 'remove') {
						entity.isInCollection = false;
						followService.removePerson($scope.staffFollowItem);
					} else {
						$scope.staffFollowItem = data.obj;
						entity.isInCollection = true;
						followService.addPerson($scope.staffFollowItem);
					}
				})
				.error(function(data, status, headers, config) {
					console.error(data);
				});
	 	};

		// 返回
		$scope.goBack = function() {
//			$modalInstance.close();
			$modalStack.dismissAll('close');
		};

		// 返回通讯录
		$scope.backContactlist = function() {
//			$modalInstance.close();
			$modalStack.dismissAll('close');
		};
		
	}
]);