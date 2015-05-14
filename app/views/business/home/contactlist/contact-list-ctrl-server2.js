'use strict';

app.service('DataService', ['$http', '$q', '$interval', 
	function($http, $q, $interval) {

		var dataGetUrl = '';

		this.setUrl = function(url) {
			dataGetUrl = url;
		};

		this.getUrl = function() {
			return dataGetUrl;
		};

		this.getData = function(url) {
			var deferred = $q.defer();

			$http.get(url)
				.success(function(data, status, headers, config) {
					deferred.resolve(data);
				})
				.error(function(data, status, headers, config) {
					deferred.reject('Get data from "' + url + '" wrong...');
				});

			return deferred.promise;
		};
	}
]);

//OrgSearch service 用于保存点击的组织
app.service('OrgSearch', function(){
	var selectedOrg = '';

	this.setOrg = function(org) {
		selectedOrg = org;
	};

	this.getOrg = function() {
		return selectedOrg;
	};
});
// 已关注 service，保存已关注的人员和组织
app.service('CollectionService', ['$http', 
  	function($http) {
  		var orgs = [],
			persons = [],
			params = {},
			urlCollections = '/service/followItem!queryFollowItemByFollowType';
//			isLoading = true;
  		
  		var getCollections = function(collectionType) {
  			if(collectionType == 'STAFF') {
  				params = {
					'FOLLOW_TYPE': 'STAFF'
  				};
  			} else if(collectionType == 'ORG') {
  				params = {
					'FOLLOW_TYPE': 'ORG'
  				};
  			} else {
  				params = {};
  			}
  	  		// 获取已关注的人员和组织，页面操作过程中维护获得的 orgs 和 persons
  	  		$http.post(urlCollections, params)
  	  			.success(function(data, status, headers, config) {
//  	  				isLoading = false;
  	  				var collections = data.obj;
  	  				orgs = collections.orgFollowItem;
  	  				persons = collections.staffFollowItem;
console.info('CollectionService --> ', orgs);
console.info('CollectionService --> ', persons);
  	  			})
  	  			.error(function(data, status, headers, config) {
  	  				console.error('Get "' + urlCollections + '" wrong...');
  	  			});
  			
  		};
  		
  		getCollections();

  		this.setOrgs = function(orgs) {
  			orgs = orgs;
  		};
  		
  		this.setPersons = function(persons) {
  			persons = persons;
  		};

  		this.addOrg = function(org) {
  			orgs.push(org);
  		};

  		this.removeOrg = function(org) {
  			var index = -1;
  			for(var i=0; i<orgs.length; i++) {
  				if(orgs[i].ID == org.ID) {
  					index = i;
  					break;
  				}
  			}
  			orgs.splice(i, 1);
  		};

  		this.addPerson = function(person) {
  			persons.push(person);
  		};

  		this.removePerson = function(person) {
  			var index = -1;
  			for(var i=0; i<persons.length; i++) {
  				if(persons[i].ID == person.ID) {
  					index = i;
  					break;
  				}
  			}
  			persons.splice(i, 1);
  		};

  		this.getOrgById = function(orgId) {
  			// @todo
  		};

  		this.getOrgs = function() {
  			return orgs;
  		};

  		this.getPersonById = function(personId) {
  			// @todo
  		};

  		this.getPersons = function() {
//  			if(isLoading) {
//  				
//  			}
  			return persons;
  		};

  		this.getAll = function() {
  			return {
  				orgs: orgs,
  				persons: persons
  			};
  		};

  	}
  ]);
//app.service('CollectionService', ['$http', 'DataService', 
//	function($http, DataService) {
//		var orgs = [],
//			persons = [],
//			personsFollowType = 'STAFF',
//			orgsFollowType = 'ORG',
//			params = {},
//			urlCollections = '/service/followItem!queryFollowItemByFollowType';
//
//		$http.post(urlCollections, params)
//			.success(function(data, status, headers, config) {
//				orgs = data.obj.orgFollowItem;
//				persons = data.obj.staffFollowItem;
//			})
//			.error(function(data, status, headers, config) {
//				console.error('Get "' + urlCollections + '" wrong...');
//			});
//		
//		this.setOrgs = function(orgs) {
//			orgs = orgs;
//		};
//		
//		this.setPersons = function(persons) {
//			persons = persons;
//		};
//
//		this.addOrg = function(org) {
//			orgs.push(org);
//		};
//
//		this.addPerson = function(person) {
//			persons.push(person);
//		};
//
//		this.getOrgs = function() {
//			return orgs;
//		};
//
//		this.getPersons = function() {
//			return persons;
//		};
//
//		this.getAll = function() {
//			return {
//				orgs: orgs,
//				persons: persons
//			};
//			
//		};
//	}
//]);

// 人员分组过滤器
app.filter('userGroup', ['$filter', 
	function($filter) {
		return function(input, groupCode) {
			if(!angular.isArray(input)) {
				console.error('Input must be an array.');
				return;
			}

			var groupCode = groupCode;
			var arrData = input;
			var arrLabels = ['A - E', 'F - J', 'K - O', 'P - T', 'U - Z'];
			var arrSplit = ['ABCDE', 'FGHIJ', 'KLMNO', 'PQRST', 'UVWXYZ'];
			var arrSplitLower = ['abcde', 'fghij', 'klmno', 'pqrst', 'uvwxyz'];
			var arr = [[], [], [], [], []];

			var arrRtn = [];

			if(angular.isUndefined(groupCode)) {
				groupCode = 'name';
			}
			// 按照 groupCode 排序
			arrData = $filter('orderBy')(arrData, groupCode);
			// 转换 groupCode 为大写字符
			angular.forEach(arrData, function(value, key) {
				value[groupCode] = value[groupCode].toUpperCase();
			});
			for(var i=0; i<arrSplit.length; i++) {
				for(var j=0; j<arrData.length; j++) {
					if(arrSplit[i].indexOf(arrData[j][groupCode]) > -1) {
						arr[i].push(arrData[j]);
					}
				}
				var arrSubLabels = arrSplit[i].split('');
				arrRtn.push({
					'label': arrLabels[i],
					'subLabels': arrSubLabels,
					'persons': arr[i],
					'expanded': false,
					'selectedSub': arrSubLabels[0]
				});
			}

			return arrRtn;
		};
	}
]);

// 通讯录 controller
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
		};
	}
]);

// 已关注 controller
app.controller('CollectionCtrl', ['$scope', '$http', '$timeout', '$filter', '$state', '$modal', 'DataService', 'CollectionService', 'OrgSearch', 
	function($scope, $http, $timeout, $filter, $state, $modal, DataService, CollectionService, OrgSearch) {
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
			var modalInstance = $modal.open({
				templateUrl: 'app/business/cam/staffdetail/staff-info.html',
				controller: 'StaffInfoCtrl',
				resolve: {
					modalParams: function() {
						var objParams = {
							staffFollowItem: staffFollowItem
						};

						return objParams;		
					}
				}
			});
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
			OrgSearch.setOrg({'ID': orgFollowItem.FOLLOW_ITEM});
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
		
	}
]);

// 组织的所有信息弹出层 controller
app.controller('OrgInfoAllCtrl',  ['$scope', '$http', '$modalInstance', 'modalParams', '$modal', '$timeout', '$rootScope', 'CollectionService', 'OrgSearch', 
    function($scope, $http, $modalInstance, modalParams, $modal, $timeout, $rootScope, CollectionService, OrgSearch) {
		var org = OrgSearch.getOrg();

		// 返回通讯录
		$scope.backContactlist = function() {
			$modalInstance.close();
		};
		
		$scope.cancel = function() {
			$modalInstance.close();
//			$modalInstance.dismissAll();
		};
		
	}
]);

//个人信息
app.controller('StaffInfoCtrl', ['$scope', '$http', '$modalInstance', 'modalParams', '$modal', '$timeout', '$rootScope', 'CollectionService', 
	function($scope, $http, $modalInstance, modalParams, $modal, $timeout, $rootScope, CollectionService) {
		if(modalParams.staffFollowItem) {
			$scope.staffFollowItem = modalParams.staffFollowItem;
			$scope.staff = {
				"ID": $scope.staffFollowItem.FOLLOW_ITEM,
				"isInCollection": true
			};
		}
		if(modalParams.staff) {
			$scope.staff = modalParams.staff;
		}	
//		$scope.$watch(function() {
//			return CollectionService.getPersons();
//		}, function(newVal, oldVal) {
//			var persons = CollectionService.getPersons();
//			for(var i=0; i<persons.length; i++) {
//				if(persons[i].FOLLOW_ITEM == $scope.staffId) {
//					$scope.staffFollowItem = persons[i];
//					break;
//				}
//			}
//		}, true);
		
		var entity = $scope.entity = {};
		
		var urlStaffInfo = '/service/staffInfo!queryStaffInfoAndTotalnameAndJobs?ID=' + $scope.staff.ID;
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
	     		// 是否已经关注
	     		entity.isInCollection = $scope.staff.isInCollection;			
				$scope.entity = entity;
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + urlStaffInfo + ' wrong...');
			});
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
						CollectionService.removePerson($scope.staffFollowItem);
					} else {
						$scope.staffFollowItem = data.obj;
						entity.isInCollection = true;
						CollectionService.addPerson($scope.staffFollowItem);
					}
				})
				.error(function(data, status, headers, config) {
					console.error(data);
				});
	 	};

		// 返回
		$scope.goBack = function() {
			$modalInstance.close();
//			history.back();
			// $scope.$apply();
		};
		
	}
]);

//已关注搜索弹出层 controller
app.controller('CollectionSearchModalCtrl', ['$scope', '$modalInstance', '$filter', 'modalParams', 
	function($scope, $modalInstance, $filter, modalParams) {

		var entity = $scope.entity = {};
		var options = $scope.options = {
			search: false
		};

		entity.collectionsPersons = modalParams.collectionsPersons;
		entity.collectionsOrgs = modalParams.collectionsOrgs;

		$scope.$watch('entity.searchKey', function(newVal) {
			if(newVal == ''){
				options.search = false;
			} else {
				entity.filteredPersons = $filter('orderBy')($filter('filter')(entity.collectionsPersons, newVal), 'GROUPCODE');
				entity.filteredOrgs = $filter('orderBy')($filter('filter')(entity.collectionsOrgs, newVal), 'GROUPCODE');
			}
		});

		$scope.showDetail = function(obj, showType) {
			console.info(obj, showType);
			$modalInstance.close({
				objEntity: obj,
				showType: showType
			});
		};

	}
]);

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
		// @todo:添加的后台接口需要返回关注实体，才能在已关注中显示对应的关注数据
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

app.controller('ConfirmCtrl', ['$scope', '$modalInstance', 'modalParams', '$modal', '$timeout', 
	function($scope, $modalInstance, modalParams, $modal, $timeout) {
		$scope.entity = modalParams.user;
		var options = $scope.options = {
			strType: modalParams.strType
		};
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

app.controller('ConfirmResultCtrl', ['$scope', '$modalInstance', 'modalParams',
	function($scope, $modalInstance, modalParams){
		$scope.entity = modalParams.user;
		$scope.strType = modalParams.strType;
	}
]);

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
				console.error(data);
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
			
			console.info(newVal);
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
console.info('showOrgInfo=====================');
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
console.info('OrgSearchCtrl --> showDetailInfo:', org);			
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

app.controller('OrgTreeCtrl', ['$scope', 
	function($scope) {
		
	}
]);

// 下级组织页签
app.controller('ChildOrgsCtrl', ['$scope', '$http', 'OrgSearch', 'CollectionService', '$rootScope', 
	function($scope, $http, OrgSearch, CollectionService, $rootScope) {
		
		$scope.$watch(function() {
			return OrgSearch.getOrg();
		}, function(newVal) {
			getChildOrgs(newVal.ID);
		}, true);
		
		$scope.$watch(function() {
			return CollectionService.getOrgs();
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
						CollectionService.removeOrg($scope.collectionItem);
						org.isInCollection = false;
					} else {
						CollectionService.addOrg(data.obj);
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

// 人员信息页签
app.controller('OrgStaffsCtrl', ['$scope', '$http', 'OrgSearch', 
	function($scope, $http, OrgSearch) {
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
		
		
	}
]);

// 组织信息页签
app.controller('OrgInfoCtrl', ['$scope', '$http', 'OrgSearch', 'CollectionService', '$rootScope', 
	function($scope, $http, OrgSearch, CollectionService, $rootScope) {
		$scope.orgInfo = {};
		var selectedOrg = OrgSearch.getOrg();

		var orgInfoUrl = '/service/orgUnit!queryOrgUnitInfoInCam?ID=' + selectedOrg.ID;

		$http.post(orgInfoUrl)
			.success(function(data, status, headers, config) {
				$scope.orgInfo = data.obj.orgUnit;
				
//				$scope.$watch(function() {
//					return CollectionService.getAll();
//				}, function(newVal, oldVal) {
//					var orgs = CollectionService.getOrgs();
//					for(var i=0; i<orgs.length; i++) {
//						if(orgs[i].FOLLOW_ITEM == selectedOrg.ID) {
//							$scope.collectionItem = orgs[i];
//							$scope.orgInfo.isInCollection = true;
//							break;
//						}
//					}
//				}, true);
				
				var collectionOrgs = CollectionService.getOrgs();
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
						CollectionService.removeOrg($scope.collectionItem);
						org.isInCollection = false;
					} else {
						CollectionService.addOrg(data.obj);
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