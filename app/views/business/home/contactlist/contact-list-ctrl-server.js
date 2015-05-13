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
		// 获取已关注的人员和组织，页面操作过程中维护获得的 orgs 和 persons
		$http.post(urlCollections, params)
			.success(function(data, status, headers, config) {
				var collections = data.obj;
				orgs = collections.orgFollowItem;
				persons = collections.staffFollowItem;
			})
			.error(function(data, status, headers, config) {
				console.error('Get "' + urlCollections + '" wrong...');
			});

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
			// @todo
		};

		this.addPerson = function(person) {
			persons.push(person);
		};

		this.removePerson = function(person) {
			// @todo
		};

		this.getCollectionOrgItemById = function(orgId) {
			// @todo
		};

		this.getOrgs = function() {
			return orgs;
		};

		this.getCollectionPersonItemById = function(personId) {
			// @todo
		};

		this.getPersons = function() {
			return persons;
		};

		this.getAll = function() {
			return {
				orgs: orgs,
				persons: persons
			}
		};

	}
]);

// app.service('CollectionService', ['$http', 'DataService', 
// 	function($http, DataService) {
// 		var orgs = [],
// 			persons = [],
// 			personsFollowType = 'STAFF',
// 			orgsFollowType = 'ORG',
// 			params = {},
// 			urlCollections = '/service/followItem!queryFollowItemByFollowType';
		
// 		this.setOrgs = function(orgs) {
// 			orgs = orgs;
// 		};
		
// 		this.setPersons = function(persons) {
// 			persons = persons;
// 		};

// 		this.addOrg = function(org) {
// 			orgs.push(org);
// 		};

// 		this.addPerson = function(person) {
// 			persons.push(person);
// 		};

// 		this.getOrgs = function() {
// 			params = {
// 				'FOLLOW_TYPE': orgsFollowType
// 			};
// 			$http.post(urlCollections, params)
// 				.success(function(data, status, headers, config) {
// 					var orgs = data.obj.orgFollowItem;

// 					return orgs;
// 				})
// 				.error(function(data, status, headers, config) {
// 					console.error('Get "' + urlCollections + '" wrong...');
// 				});
// 		};

// 		this.getPersons = function() {
// 			params = {
// 				'FOLLOW_TYPE': personsFollowType
// 			};
// 			$http.post(urlCollections, params)
// 				.success(function(data, status, headers, config) {
// 					var persons = data.obj.staffFollowItem;

// 					return persons;
// 				})
// 				.error(function(data, status, headers, config) {
// 					console.error('Get "' + urlCollections + '" wrong...');
// 				});
// 		};

// 		this.getAll = function() {
// 			params = {
// 				// 
// 			};
// 			$http.post(urlCollections, params)
// 				.success(function(data, status, headers, config) {
// 					var orgs = data.obj.orgFollowItem;
// 					var persons = data.obj.staffFollowItem;

// 					return {
// 						orgs: orgs,
// 						persons: persons
// 					};
// 				})
// 				.error(function(data, status, headers, config) {
// 					console.error('Get "' + urlCollections + '" wrong...');
// 				});
			
// 		};
// 	}
// ]);

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

			console.log($scope.contactListTabs);
		};
	}
]);

// 已关注 controller
app.controller('CollectionCtrl', ['$scope', '$http', '$timeout', '$filter', '$state', '$modal', 'DataService', 'CollectionService', 
	function($scope, $http, $timeout, $filter, $state, $modal, DataService, CollectionService) {
		var urlCollectionsOrgs = 'app/business/home/contactlist/data/collections-orgs.json',
			urlCollectionsPersons = 'app/business/home/contactlist/data/collections-persons.json',
			
			options = $scope.options = {
				collectionNone: false,
				collectionOrgExpand: false,
				collectionPersonExpand: true,
				collectionPersonsGroupExpand: false
			},

			collections = $scope.collections = {
				persons: [],
				orgs: []
			};
		
//		DataService.getData(urlCollectionsOrgs)
//			.then(function success(data) {
//				var orgs = data.obj;
//				collections.orgs = orgs;
//				CollectionService.setOrgs(orgs);
//			}, function error(msg) {
//				console.error(msg);
//			});
//		
//		DataService.getData(urlCollectionsPersons)
//			.then(function success(data) {
//				var persons = data.obj;
//				CollectionService.setPersons(persons);
//				var personsGroup = $filter('userGroup')(persons, 'groupCode');
//				collections.persons = persons;
//				collections.personsGroup = personsGroup;
//			}, function error(msg) {
//				console.error(msg);
//			});

		urlCollectionsOrgs = '/service/followItem!queryFollowItemByFollowType';
		var params = {
			
		};
		$http.post(urlCollectionsOrgs, params) 
			.success(function(data, status, headers, config) {
				collections.orgs = data.obj.orgFollowItem;
				
				var persons = data.obj.staffFollowItem;
				var personsGroup = $filter('userGroup')(persons, 'GROUPCODE');
				collections.persons = persons;
				collections.personsGroup = personsGroup;
console.log(collections.persons);
				$timeout(function() {
					if(collections.persons.length > 0 || collections.orgs.length > 0) {
						options.collectionNone = false;
					} else {
						options.collectionNone = true;
					}
				}, 3000);
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + urlCollectionsOrgs + ' wrong...');
			});

//		$http.get(urlCollectionsPersons) 
//			.success(function(data, status, headers, config) {
//				var persons = data.obj;
//				collections.persons = persons;
//			})
//			.error(function(data, status, headers, config) {
//				console.log('Get ' + urlCollectionsPersons + ' wrong...');
//			});
//	
//			$timeout(function() {
//				if(collections.persons.length > 0 || collections.orgs.length > 0) {
//					options.collectionNone = false;
//				} else {
//					options.collectionNone = true;
//				}
//			}, 3000);

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
		};

		$scope.collectionPersonFilter = function(group, subLabel) {
			group.selectedSub = subLabel;
		};

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
				console.log(rtnVal);
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
		
	}
]);

//已关注搜索弹出层 controller
app.controller('CollectionSearchModalCtrl', ['$scope', '$modalInstance', '$filter', 'modalParams', 
	function($scope, $modalInstance, $filter, modalParams) {
		console.log('CollectionSearchModalCtrl');
		console.log(modalParams);

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
console.log(entity.filteredOrgs);
console.log(entity.filteredPersons);
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
		
		$scope.$watch(function() {
			return CollectionService.getPersons();
		}, function(newVal) {
			console.log(newVal);
		}, true);
		// 获取已关注人员
//		var urlCollectionsPersons = 'app/business/home/contactlist/data/collections-persons.json';
//		DataService.getData(urlCollectionsPersons)
//			.then(function success(data) {
//				var persons = data.obj;
//				entity.collectionsPersons = persons;
//			}, function error(msg) {
//				console.error(msg);
//			});
		
		var urlCollectionsOrgs = '/service/followItem!queryFollowItemByFollowType';
		var params = {
//			'FOLLOW_TYPE': 'ORG'
			'FOLLOW_TYPE': 'STAFF'
		};
		$http.post(urlCollectionsOrgs, params) 
			.success(function(data, status, headers, config) {
				var persons = data.obj.staffFollowItem;
				entity.collectionsPersons = persons;
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + urlCollectionsOrgs + ' wrong...');
			});

		// 搜索框 enter 触发搜索事件
		$scope.enterPress = function(e, trigType) {
			   
		   //初始化当前页码对象（用对象的方式解决跨作用域的问题）
		   $scope.page = {};
		    /*查询人员*/
		   $scope.page.staffCurrentPage = 1;//当前页
		   $scope.staffMaxSize = 5;//显示的最大页码
		   $scope.staffPageSize = 10;//每页显示记录条数
		   
			var params = {NAME:entity.searchKey,page:1,pagesize:50};
			if(trigType == 'btn' || e.keyCode === 13) {
				options.search = true;
				entity.searchResults = null;
	
				params.searchKey = entity.searchKey;
				params.searchType = entity.searchType;
	
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
			e.stopPropagation();
		};
		// 人员详细信息
		$scope.showDetailInfo = function(user) {
			// 获取当前人在关注列表中的对象
			var collectionItem = null;
			if(user.isInCollection) {
				var collectionsPersons = entity.collectionsPersons;
				var iLen = collectionsPersons.length;
				for(var i=0; i<iLen; i++) {
					if(user.ID == collectionsPersons[i].FOLLOW_ITEM) {
						collectionItem = collectionsPersons[i];
						break;
					}
				}
			}
console.info('PersonSearchCtrl --> ', collectionItem);
			var modalInstance = $modal.open({
				templateUrl: 'app/business/cam/staffdetail/staff-info.html',
				controller: 'StaffInfoCtrl',
				resolve: {
					modalParams: function() {
						var objParams = {
							user: user,
							collectionItem: collectionItem
						};

						return objParams;		
					}
				}
			});
		};
		// 添加关注确认
		$scope.collectionConfirm = function(user, strType) {
			var modalInstance = $modal.open({
				templateUrl: 'app/business/home/contactlist/confirm.html',
				controller: 'ConfirmCtrl',
				resolve: {
					modalParams: function() {
						var objParams = {
							user: user,
							strType: strType
						};

						return objParams;		
					}
				}
			});

			var modalInstance2 = null;
			modalInstance.result.then(function(rtnVal) {				
				if(rtnVal == 'confirm') {
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
							
							modalInstance2 = $modal.open({
								templateUrl: 'app/business/home/contactlist/result.html',
								controller: 'ConfirmResultCtrl',
								resolve: {
									modalParams: function() {
										var objParams = {
											user: user,
											strType: strType
										};
										
										return objParams;
									}
								}
							});

							$timeout(function() {
								modalInstance2.close();
								var searchResults = entity.searchResults;
								var iLen = searchResults.length;
								for(var i=0; i<iLen; i++) {
									if(searchResults[i].ID == followId) {
										searchResults[i].isInCollection = true;
										break;
									}
								}
							}, 1000);
						})
						.error(function(data, status, headers, config) {
							console.error(data);
						});
				}
			}, function(rtnVal) {
				console.log(rtnVal);
			});
		};

		$scope.$watch('entity.searchKey', function(newVal) {
			// console.log(newVal);
		});
	}
]);

app.controller('ConfirmCtrl', ['$scope', '$modalInstance', 'modalParams', '$modal', '$timeout', 
	function($scope, $modalInstance, modalParams, $modal, $timeout) {
		$scope.entity = modalParams.user;
console.info('ConfirmCtrl --> entity ', $scope.entity);
		var options = $scope.options = {
			strType: modalParams.strType
		};
console.info('ConfirmCtrl --> options ', options);
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
console.log(modalParams);
		$scope.entity = modalParams.user;
		$scope.strType = modalParams.strType;
	}
]);

app.controller('OrgSearchCtrl', ['$scope', '$http', '$timeout', '$modal', 'OrgSearch', 'DataService', '$rootScope', '$filter', 
	function($scope, $http, $timeout, $modal, OrgSearch, DataService, $rootScope, $filter) {
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
					console.log(data);
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
			console.log(newVal);
			console.log(oldVal);
			$scope.enterPress(null, 'btn');
		}, true);
		
		// 获取已关注组织
//		var urlCollectionsOrgs = 'app/business/home/contactlist/data/collections-orgs.json';
//		DataService.getData(urlCollectionsOrgs)
//			.then(function success(data) {
//				var orgs = data.obj;
//				entity.collectionsOrgs = orgs;
//			}, function error(msg) {
//				console.error(msg);
//			});
		
		var urlCollectionsOrgs = '/service/followItem!queryFollowItemByFollowType';
		var params = {
			'FOLLOW_TYPE': 'ORG'
//			'FOLLOW_TYPE': 'STAFF'
		};
		$http.post(urlCollectionsOrgs, params) 
			.success(function(data, status, headers, config) {
				var orgs = data.obj.orgFollowItem;
				entity.collectionsOrgs = orgs;
				// 触发过滤操作
				$scope.enterPress(null, 'btn');
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + urlCollectionsOrgs + ' wrong...');
			});

		// 搜索框 enter 触发搜索事件
		$scope.enterPress = function(e, trigType) {
			var params = {};

			if(trigType == 'btn' || e.keyCode === 13) {
				options.search = true;
				entity.searchResults = null;

				params.searchArea = entity.areaSelected;
				params.searchClassify = entity.classifySelected;
				/* 后台根据输入值搜索
				var params_search= {ORG_UNIT_NAME:entity.searchKey,page:1,pagesize:50};
				
				orgSearchUrl = '/service/orgUnit!queryListOrgByNameOrShortNameByPage';

				$http.post(orgSearchUrl, params_search)
					.success(function(data, status, headers, config) {
						data = data.obj;
						var iDataLen = data.length;
						var collectionsOrgs = entity.collectionsOrgs;
						var iLen = collectionsOrgs.length;
						for(var i=0; i<iDataLen; i++) {
							for(var j=0; j<iLen; j++) {
								if(data[i].ID == collectionsOrgs[j].id) {
									data[i].isInCollection = true;
									break;
								}
							}
						}
						entity.searchResults = data;
					})
					.error(function(data, status, headers, config) {
						console.log('Get ' + orgSearchUrl + ' wrong...');
					});
				*/
				var data = entity.allOrgs;
				if(data != undefined) {
					if(entity.searchKey != undefined) {
						data = $filter('filter')(data, entity.searchKey);
					}
					if(entity.areaSelected != undefined) {
						data = $filter('filter')(data, {'ORG_UNIT_RGN': entity.areaSelected.ORG_UNIT_RGN});
					}
					if(entity.classifySelected != undefined) {console.info(entity.classifySelected);
						data = $filter('filter')(data, {'ORG_CLASS': entity.classifySelected.key});
					}				
			
					var iDataLen = data.length;
					var collectionsOrgs = entity.collectionsOrgs;
					var iLen = collectionsOrgs.length;
					for(var i=0; i<iDataLen; i++) {
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
				$scope.showDetailInfo(newVal);
			}			
		});

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
			var modalInstance = $modal.open({
				templateUrl: 'app/business/home/contactlist/confirm.html',
				controller: 'ConfirmCtrl',
				resolve: {
					modalParams: function() {
						var objParams = {
							user: org,
							strType: strType
						};

						return objParams;		
					}
				}
			});

			var modalInstance2 = null;

			modalInstance.result.then(function(rtnVal) {				
				if(rtnVal == 'confirm') {
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
							modalInstance2 = $modal.open({
								templateUrl: 'app/business/home/contactlist/result.html',
								controller: 'ConfirmResultCtrl',
								resolve: {
									modalParams: function() {
										var objParams = {
											user: org,
											strType: strType
										};
										
										return objParams;
									}
								}
							});

							$timeout(function() {
								modalInstance2.close();
								var searchResults = entity.searchResults;
								var iLen = searchResults.length;
								for(var i=0; i<iLen; i++) {
									if(searchResults[i].ID == followId) {
										searchResults[i].isInCollection = true;
										break;
									}
								}
							}, 1000);
						})
						.error(function(data, status, headers, config) {
							console.error(data);
						});
				}
			}, function(rtnVal) {
				console.log(rtnVal);
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
app.controller('ChildOrgsCtrl', ['$scope', '$http', 'OrgSearch', 
	function($scope, $http, OrgSearch) {
		$scope.orgs = [];
		
		var selectedOrg = OrgSearch.getOrg();
		$scope.selectedOrg = selectedOrg;
		
		$scope.$watch(function() {
			return OrgSearch.getOrg();
		}, function(newVal) {
			console.log(newVal);
		});
		
		var childOrgsUrl = '/service/orgUnit!queryNextContactTreeById';

		$http.post(childOrgsUrl, {ORG_ID:selectedOrg.ID})
			.success(function(data, status, headers, config) {
				$scope.orgs = data.obj;
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + childOrgsUrl + ' wrong...');
			});
			
		// 查看组织详细信息
		$scope.showDetailInfo = function(org) {
			OrgSearch.setOrg(org);
		};
		
		// 添加关注
		$scope.collectionConfirm = function(org, strType) {
			console.info('org:', org);
			console.info('strType:', strType);
		};
		
	}
]);

// 人员信息页签
app.controller('OrgStaffsCtrl', ['$scope', '$http', 'OrgSearch', 
	function($scope, $http, OrgSearch) {
		$scope.orgStaffs = [];
		
		var selectedOrg = OrgSearch.getOrg(),
			orgStaffsUrl = '/service/staffInfo!queryActStaffByOrgUnitId';

		$http.post(orgStaffsUrl, {ORG_UNIT_ID:selectedOrg.ID})
			.success(function(data, status, headers, config) {
				$scope.orgStaffs = data.obj;
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + orgStaffsUrl + ' wrong...');
			});
	}
]);

// 组织信息页签
app.controller('OrgInfoCtrl', ['$scope', '$http', 'OrgSearch', 
	function($scope, $http, OrgSearch) {
		$scope.orgInfo = {};
		var selectedOrg = OrgSearch.getOrg();
		
		var orgInfoUrl = '/service/orgUnit!queryOrgUnitInfoInCam?ID=' + selectedOrg.ID;

		$http.post(orgInfoUrl)
			.success(function(data, status, headers, config) {
				$scope.orgInfo = data.obj.orgUnit;
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + orgInfoUrl + ' wrong...');
			});
	}
]);

app.controller('StaffInfoCtrl', ['$scope', '$http', '$modalInstance', 'modalParams', '$modal', '$timeout', '$rootScope', 
 	function($scope, $http, $modalInstance, modalParams, $modal, $timeout, $rootScope) {
 		var staff = modalParams.user;
 		var collectionItem = modalParams.collectionItem;
console.info('StaffInfoCtrl --> ', collectionItem);
 		$scope.staffId = staff.ID;
 		var entity = $scope.entity = {};
 		var urlStaffInfo = '/service/staffInfo!queryStaffInfoAndTotalnameAndJobs?ID=' + staff.ID;
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
	     		entity.isInCollection = staff.isInCollection;
 				
 				$scope.entity = entity;
 			})
 			.error(function(data, status, headers, config) {
 				console.log('Get ' + urlStaffInfo + ' wrong...');
 			});
 		
 		$scope.collectionConfirm = function(staff, strType) {
 			var modalInstance = $modal.open({
				templateUrl: 'app/business/home/contactlist/confirm.html',
				controller: 'ConfirmCtrl',
				resolve: {
					modalParams: function() {
						var objParams = {
							user: staff,
							strType: strType
						};

						return objParams;		
					}
				}
			});

			var modalInstance2 = null;
			modalInstance.result.then(function(rtnVal) {				
				if(rtnVal == 'confirm') {
					var urlAddCollection = '',
						staffId = '',
						followType = '',
						followName = '',
						followId = '',
						params = {};
					if(strType == 'add') {
						urlAddCollection = '/service/followItem!saveEntity';
						staffId = $rootScope.userInfo.ID,
						followType = 'STAFF',
						followName = staff.NAME,
						followId = staff.ID,
						params = {
							'STAFF_ID': staffId,
							'FOLLOW_TYPE': followType,
							'NAME': followName,
							'FOLLOW_ITEM': followId
						};
					}
					
					if(strType == 'remove') {
						urlAddCollection = '/service/followItem!deleteEntity';
						var collectionItemId = collectionItem.ID;
						params = {
							'ID': collectionItemId
						};
					}
					
					$http.post(urlAddCollection, params)
						.success(function(data, status, headers, config) {
console.log('StaffInfo --> strType ', strType);					
							modalInstance2 = $modal.open({
								templateUrl: 'app/business/home/contactlist/result.html',
								controller: 'ConfirmResultCtrl',
								resolve: {
									modalParams: function() {
										var objParams = {
											user: staff,
											strType: strType
										};
										
										return objParams;
									}
								}
							});

							$timeout(function() {
								modalInstance2.close();
								if(strType == 'remove') {
									staff.isInCollection = false;
								} else {
									staff.isInCollection = true;
								}
							}, 1000);
						})
						.error(function(data, status, headers, config) {
							console.error(data);
						});
				}
			}, function(rtnVal) {
				console.log(rtnVal);
			});
 		};

 		// 返回
 		$scope.goBack = function() {
			$modalInstance.close();
// 			history.back();
 			// $scope.$apply();
 		};
 	}
 ]);