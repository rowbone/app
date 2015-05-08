'use strict';

app.controller('contactListCtrl', ['$scope', 
	function($scope) {
		$scope.contactListTabs = [true, false, false, false];

		$scope.tabsChange = function(tabIndex) {
			var iTabsLen = $scope.contactListTabs.length;
			tabIndex = Number(tabIndex);
			for(var i=0; i<iTabsLen; i++) {
				if(tabIndex === i) {
					$scope.contactListTabs[i] = true;
				} else {
					$scope.contactListTabs[i] = false;
				}
			}

			console.log($scope.contactListTabs);
		};
	}
]);

app.controller('CollectionCtrl', ['$scope', '$http', '$timeout', '$filter', '$state', 
	function($scope, $http, $timeout, $filter, $state) {
		var urlCollectionsOrgs = 'app/business/home/contactlist/data/collections-orgs.json';
		var urlCollectionsPersons = 'app/business/home/contactlist/data/collections-persons.json';

		var options = $scope.options = {
			collectionNone: false,
			collectionOrgExpand: false,
			collectionPersonExpand: true
		};

		var collections = $scope.collections = {
			persons: [],
			orgs: []
		};

		$http.get(urlCollectionsOrgs) 
			.success(function(data, status, headers, config) {
				var orgs = data.obj;
				collections.orgs = orgs;
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + urlCollectionsOrgs + ' wrong...');
			});

		$http.get(urlCollectionsPersons) 
			.success(function(data, status, headers, config) {
				var persons = data.obj;
				collections.persons = persons;
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + urlCollectionsPersons + ' wrong...');
			});

		$timeout(function() {
			if(collections.persons.length > 0 || collections.orgs.length > 0) {
				options.collectionNone = false;
			} else {
				options.collectionNone = true;
			}
		}, 3000);

		// 添加收藏
		$scope.addCollection = function() {
			var iTabsLen = $scope.contactListTabs.length;
			for(var i=0; i<iTabsLen; i++) {
				$scope.contactListTabs[i] = false;
			}
			$scope.contactListTabs[1] = true;
		};
		// 组织/人员详细信息
		$scope.showDetailInfo = function(obj, showType) {
			var state = '';

			// if(showType == 'org') {
			// 	$state.go('app.hr.orgInfo', { orgId: obj.id });
			// } else if(showType == 'person') {
			// 	$state.go('app.hr.staffInfo', { staffId: obj.id });
			// } else {
			// 	// 
			// }
		};
	}
]);

app.controller('PersonSearchCtrl', ['$scope', '$http', '$timeout', '$modal', 
	function($scope, $http, $timeout, $modal) {
		var entity = $scope.entity = {};
		var options = $scope.options = {
			search: false
		};
//		var personSearchUrl = 'app/business/home/contactlist/data/persons-search.json';
		var personSearchUrl = '/service/staffInfo!queryStaffInfoByNameByPage';

		entity.searchType = 'name';
		
//		var params = {NAME:name,page:$scope.staffCurrentPage,pagesize:$scope.staffPageSize};
//	   	   $http.post('/service/staffInfo!queryStaffInfoByNameByPage',params).success(function(result){
//	   			var obj = result.obj;
//	   			$scope.staffLength = obj.length;
//	   			$scope.staffTotalItems = result.pageInfo.count;
//	   			$scope.staffRepeat = obj;
//	   			/*隐藏树*/
//	   			$scope.treeIsDisplay = false;
//	   			$scope.backToTree = true;
//	   			$scope.statusStaff = {
//	   	    	      openStaff:true
//	   	    	    };
//	   	  	    $scope.doing_async_searchStaff = false;
//	   		});

		// 搜索框 enter 触发搜索事件
		$scope.enterPress = function(e) {
			   
		   //初始化当前页码对象（用对象的方式解决跨作用域的问题）
		   $scope.page = {};
		    /*查询人员*/
		   $scope.page.staffCurrentPage = 1;//当前页
		   $scope.staffMaxSize = 5;//显示的最大页码
		   $scope.staffPageSize = 10;//每页显示记录条数
		   
			var params = {NAME:entity.searchKey,page:1,pagesize:50};
//			if(e.keyCode === 13) {
				options.search = true;
				entity.searchResults = null;

				params.searchKey = entity.searchKey;
				params.searchType = entity.searchType;

				$http.post(personSearchUrl, params)
					.success(function(data, status, headers, config) {
//						if(params.searchKey == '张' && params.searchType == 'name') {
							$timeout(function() {
								entity.searchResults = data.obj;
							}, 2000);
//						} else {
//							$timeout(function() {
//								entity.searchResults = [];
//							}, 2000);
//						}
					})
					.error(function(data, status, headers, config) {
						console.log('Get ' + personSearchUrl + ' wrong...');
					})
//			}

			e.stopPropagation();
		};
		// 人员详细信息
		$scope.showDetailInfo = function(obj) {
			// $state.go('app.hr.staffInfo', { staffId: obj.id });
			var modalInstance = $modal.open({
				templateUrl: 'app/business/cam/staffdetail/staff-info.html',
				controller: 'StaffInfoCtrl',
				resolve: {
					modalParams: function() {
						var objParams = {
							user: obj
						};

						return objParams;		
					}
				}
			})
		};
		// 添加关注确认
		$scope.collectionConfirm = function(user) {
			var modalInstance = $modal.open({
				templateUrl: 'app/business/home/contactlist/confirm.html',
				controller: 'ConfirmCtrl',
				resolve: {
					modalParams: function() {
						var objParams = {
							user: user
						};

						return objParams;		
					}
				}
			});

			var modalInstance2 = null;

			modalInstance.result.then(function(rtnVal) {				
				if(rtnVal == 'confirm') {
					modalInstance2 = $modal.open({
						templateUrl: 'app/business/home/contactlist/result.html',
						controller: 'ConfirmResultCtrl'
					})

					$timeout(function() {
						modalInstance2.close();
					}, 1000);
				}
			}, function(rtnVal) {
				console.log(rtnVal)
			})
		};

		$scope.$watch('entity.searchKey', function(newVal) {
			// console.log(newVal);
		});
	}
]);

app.controller('ConfirmCtrl', ['$scope', '$modalInstance', 'modalParams', '$modal', '$timeout', 
	function($scope, $modalInstance, modalParams, $modal, $timeout) {
		$scope.entity = modalParams.user;

		$scope.confirm = function() {
			$modalInstance.close('confirm');
		};

		$scope.cancel = function() {
			$modalInstance.close('cancel');
		};

		$scope.close = function() {
			$modalInstance.close('close');
		};
	}
]);

app.controller('ConfirmResultCtrl', ['$scope', function($scope){
	
}])

app.controller('OrgSearchCtrl', ['$scope', '$http', '$timeout', '$modal', 'OrgSearch', 
	function($scope, $http, $timeout, $modal, OrgSearch) {
		var entity = $scope.entity = {};
		var options = $scope.options = {
			search: false,
			showDetail: false
		};
		var orgAreaUrl = 'data/bz/home/contactlist2/orgUnit-query12BranchCourts.json';
		var orgClassifyUrl = 'data/bz/home/contactlist2/common-queryOptions-type-DICT_OPTION-DICT_CODE-HR_ORG_CLASS.json';
		var orgSearchUrl = 'app/business/home/contactlist/data/orgs-search.json';
		var orgDetailUrl = 'app/business/home/contactlist/data/org-info.json';

//		$http.get(orgAreaUrl)
//			.success(function(data, status, headers, config) {
//				console.log(data);
//				// entity.area = data.obj;
//			})
//			.error(function(data, status, headers, config) {
//				console.log('Get ' + orgAreaUrl + ' wrong...');
//			})
//
//		$http.get(orgClassifyUrl)
//			.success(function(data, status, headers, config) {
//				console.log(data);
//				// entity.classify = data.obj;
//			})
//			.error(function(data, status, headers, config) {
//				console.log('Get ' + orgClassifyUrl + ' wrong...');
//			})

		entity.area = ['北京', '上海', '广州', '沈阳', '南京', '成都', '兰州', '武汉', '西安', '长春', '昆明', '新疆'];
		entity.classify = ['大科学中心', '创新研究院', '卓越创新中心', '特色研究所', '其他'];

		$scope.areaSelect = function(obj) {
			entity.areaSelected = (entity.areaSelected == obj) ? null : obj;
		};

		$scope.classifySelect = function(obj) {
			entity.classifySelected = (entity.classifySelected == obj) ? null : obj;
		};

		// 搜索框 enter 触发搜索事件
		$scope.enterPress = function(e) {
			var params = {};
//			if(e.keyCode === 13) {
				options.search = true;
				entity.searchResults = null;

				params.searchArea = entity.areaSelected;
				params.searchClassify = entity.classifySelected;
				var params_search= {ORG_UNIT_NAME:entity.searchKey,page:1,pagesize:50};
				
				orgSearchUrl = '/service/orgUnit!queryListOrgByNameOrShortNameByPage';

				$http.post(orgSearchUrl, params_search)
					.success(function(data, status, headers, config) {

						entity.searchResults = data.obj;

					})
					.error(function(data, status, headers, config) {
						console.log('Get ' + orgSearchUrl + ' wrong...');
					})
//			}

			e.stopPropagation();
		};

		$scope.showDetailInfo = function(org) {
			// var modalInstance = $modal.open({
			// 	templateUrl: 'views/business/hr/org/org-info.html'
			// })
			options.showDetail = true;
			
			$scope.selectedOrg = org;
			
			OrgSearch.setOrg(org);
//			$http.get(orgDetailUrl)
//				.success(function(data, status, headers, config) {
//console.log(data);
//					$scope.orgInfo = data.obj;
//				})
//				.error(function(data, status, headers, config) {
//					console.log('Get ' + orgDetailUrl + ' wrong...');
//				})
		};

		// 添加关注确认
		$scope.collectionConfirm = function(org) {
			var modalInstance = $modal.open({
				templateUrl: 'app/business/home/contactlist/confirm.html',
				controller: 'ConfirmCtrl',
				resolve: {
					modalParams: function() {
						var objParams = {
							user: org
						};

						return objParams;		
					}
				}
			});

			var modalInstance2 = null;

			modalInstance.result.then(function(rtnVal) {				
				if(rtnVal == 'confirm') {
					modalInstance2 = $modal.open({
						templateUrl: 'app/business/home/contactlist/result.html',
						controller: 'ConfirmResultCtrl'
					})

					$timeout(function() {
						modalInstance2.close();
					}, 1000);
				}
			}, function(rtnVal) {
				console.log(rtnVal)
			})
		};
		
		// 返回通讯录列表
		$scope.backContactlist = function() {
			options.showDetail = false;
		};
		
	}
]);

app.controller('OrgTreeCtrl', ['$scope', 
	function($scope) {
		
	}
]);

// OrgSearch service 用于保存点击的组织
app.service('OrgSearch', function(){
	var selectedOrg = '';

	this.setOrg = function(org) {
		selectedOrg = org;
	};

	this.getOrg = function() {
		return selectedOrg;
	};
});

// 下级组织页签
app.controller('ChildOrgsCtrl', ['$scope', '$http', 'OrgSearch', 
	function($scope, $http, OrgSearch) {
		$scope.orgs = [];
		
		var selectedOrg = OrgSearch.getOrg();
		$scope.selectedOrg = selectedOrg;
		
//		var childOrgsUrl = 'app/business/home/contactlist/data/child-orgs.json';
		var childOrgsUrl = '/service/orgUnit!queryNextContactTreeById';

		$http.post(childOrgsUrl, {ORG_ID:selectedOrg.ID})
			.success(function(data, status, headers, config) {
				$scope.orgs = data.obj;
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + childOrgsUrl + ' wrong...');
			})
	}
]);

// 人员信息页签
app.controller('OrgStaffsCtrl', ['$scope', '$http', 'OrgSearch', 
	function($scope, $http, OrgSearch) {
		$scope.orgStaffs = [];
		
		var selectedOrg = OrgSearch.getOrg();

//		var orgStaffsUrl = 'app/business/home/contactlist/data/org-staffs.json';
		var orgStaffsUrl = '/service/staffInfo!queryActStaffByOrgUnitId';

		$http.post(orgStaffsUrl, {ORG_UNIT_ID:selectedOrg.ID})
			.success(function(data, status, headers, config) {
				$scope.orgStaffs = data.obj;
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + orgStaffsUrl + ' wrong...');
			})
	}
]);

// 组织信息页签
app.controller('OrgInfoCtrl', ['$scope', '$http', 'OrgSearch', 
	function($scope, $http, OrgSearch) {
		$scope.orgInfo = {};
		var selectedOrg = OrgSearch.getOrg();

//		var orgInfoUrl = 'app/business/home/contactlist/data/org-info.json';
		var orgInfoUrl = '/service/orgUnit!queryOrgUnitInfoInCam?ID=' + selectedOrg.ID;

		$http.post(orgInfoUrl)
			.success(function(data, status, headers, config) {
console.log(data.obj);
				$scope.orgInfo = data.obj.orgUnit;
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + orgInfoUrl + ' wrong...');
			})
	}
]);

app.controller('StaffInfoCtrl', ['$scope', '$stateParams', '$http', '$modalInstance',  'modalParams', 
 	function($scope, $stateParams, $http, $modalInstance, modalParams){
 		var staff = modalParams.user;
 		$scope.staffId = staff.ID;
 		var entity = $scope.entity = {};
 		entity.color = 'blue';
// 		var urlStaffInfo = 'app/business/home/contactlist/data/staff-info.json';
 		var urlStaffInfo = '/service/staffInfo!queryStaffInfoAndTotalnameAndJobs?ID=' + staff.ID
 		$http.get(urlStaffInfo)
 			.success(function(data, status, headers, config) {
 				entity = data.obj;
	    		var imgSrc = 'img/person';
	    		if(entity.PHOTO == null) {
		    		if(entity.GENDER == 'M') {
		    			entity.PHOTO = imgSrc + '/person_photo_2.png';
		    		} else {
		    			entity.PHOTO = imgSrc + '/person_photo_4.png';
		    		}	    			
	    		}
 				
 				$scope.entity = entity;
 			})
 			.error(function(data, status, headers, config) {
 				console.log('Get ' + urlStaffInfo + ' wrong...');
 			})

 		// 返回
 		$scope.goBack = function() {
			$modalInstance.close();
// 			history.back();
 			// $scope.$apply();
 		};
 	}
 ]);