'use strict';

// OrgSearch service 用于保存点击的组织
app.service('OrgSearch', function(){
	var selectedOrg = null;

	this.setOrg = function(org) {
		selectedOrg = org;
	};

	this.getOrg = function() {
		return selectedOrg;
	}
});
// 已关注 service，保存已关注的人员和组织
app.service('CollectionService', ['$http', 
	function($http) {
		var orgs = [],
		persons = [],
		params = {},
		urlCollections = '/service/followItem!queryFollowItemByFollowType',
		isLoading = true;
		
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
  				// isLoading = false;
  				var collections = data.obj;
  				orgs = collections.orgFollowItem;
  				persons = collections.staffFollowItem;
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
			// if(isLoading) {
				
			// }
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
// 人员分组过滤器
app.filter('userGroup', ['$filter', 
	function($filter) {
		return function(input, groupCode) {
			if(!angular.isArray(input)) {
				console.error('Input must be an array.')
				return input;
			}

			var groupCode = groupCode;
			var arrData = input;
			var arrLabels = ['A - E', 'F - J', 'K - O', 'P - T', 'U - Z'];
			var arrSplit = ['ABCDE', 'FGHIJ', 'KLMNO', 'PQRST', 'UVWXYZ'];
			var arrSplitLower = ['abcde', 'fghij', 'klmno', 'pqrst', 'uvwxyz'];
			var arr = [[], [], [], [], []];

			var arrRtn = [];
			// 如果没有传递分组字段，则用 'name' 字段
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
				})
			}

			return arrRtn;
		}
	}
]);

// 通讯录 controller
app.controller('contactListCtrl2', ['$scope', '$http', 'DataService', 
	function($scope, $http, DataService) {
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

			console.log($scope.contactListTabs)
		};

		$scope.test = function() {
			// var url = 'data/bz/area.json';
			// DataService.getData(url)
			// 	.then(function success(data) {
			// 		console.log(data);
			// 	}, function error(msg) {
			// 		console.log(msg);
			// 	}, function notification(notification) {
			// 		console.info(notification)
			// 	})
			// 	// 当调用了 reject 回调函数时，catch 会被自动忽略
			// 	.catch(function(msg) {
			// 		console.error(msg)
			// 	});

			var url = '/home/?email=abc';
			var params = {
				'name': 'abc',
				'age': 12
			};
			$http.post(url, params)
				.success(function(data) {
					console.log(data)
				})
			// DataService.postData(url, params)
			// 	.then(function(data) {
			// 		console.info(data); 
			// 	}, function(msg) {
			// 		console.error(msg);
			// 	})
		};

	}
]);

// 关注
app.controller('CollectionCtrl', ['$scope', '$http', '$timeout', '$filter', '$state', '$modal', 'DataService', 'OrgSearch', 
	function($scope, $http, $timeout, $filter, $state, $modal, DataService, OrgSearch) {
		var urlCollectionsOrgs = 'data/bz/home/contactlist2/collections-orgs.json',
				urlCollectionsPersons = 'data/bz/home/contactlist2/collections-persons.json',

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

		DataService.getData(urlCollectionsOrgs)
			.then(function success(data) {
				var orgs = data.obj;
				collections.orgs = orgs;
			}, function error(msg) {
				console.error(msg);
			})

		DataService.getData(urlCollectionsPersons)
			.then(function success(data) {
				var persons = data.obj;
				var personsGroup = $filter('userGroup')(persons, 'GROUPCODE');
				collections.persons = persons;
				collections.personsGroup = personsGroup;
			}, function error(msg) {
				console.error(msg);
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
		};
		// 点击 subLabel 过滤 person
		$scope.collectionPersonFilter = function(group, subLabel) {
			group.selectedSub = subLabel;
		};
		// 打开搜索弹出层
		$scope.openSearchModal = function() {
			var modalInstance = $modal.open({
				templateUrl: 'views/business/home/contactlist/collectionSearchModal.html',
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
							templateUrl: 'views/business/hr/staff/staff-info.html',
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
			OrgSearch.setOrg({ "ID": orgFollowItem.FOLLOW_ITEM });
		};

	}
]);

// 已关注搜索弹出层 controller
app.controller('CollectionSearchModalCtrl', ['$scope', '$modalInstance', 'modalParams', '$filter', 
	function($scope, $modalInstance, modalParams, $filter) {
		var entity = $scope.entity = {},
				options = $scope.options = {
					search: false
				};

		entity.collectionsPersons = modalParams.collectionsPersons;
		entity.collectionsOrgs = modalParams.collectionsOrgs;

		$scope.$watch('entity.searchKey', function(newVal) {
			if(newVal == ''){
				options.search = false;
			} else {
				entity.filteredPersons = $filter('orderBy')($filter('filter')(entity.collectionsPersons, newVal), 'groupCode');
				entity.filteredOrgs = $filter('orderBy')($filter('filter')(entity.collectionsOrgs, newVal), 'groupCode');
			}
		});
		// 查看详情 [服务器端是直接发起聊天]
		$scope.showDetail = function(obj, showType) {
			console.info(obj, showType);
			$modalInstance.close({
				objEntity: obj,
				showType: showType
			});
		};

	}
]);

// 找人
app.controller('PersonSearchCtrl', ['$scope', '$http', '$timeout', '$modal', 
	function($scope, $http, $timeout, $modal) {
		var entity = $scope.entity = {};
		var options = $scope.options = {
			search: false
		};
		var personSearchUrl = 'data/bz/home/contactlist2/staffInfo-queryStaffInfoByNameByPage.json';

		entity.searchType = 'name';

		// 搜索框 enter 触发搜索事件
		$scope.enterPress = function(e) {
			var params = {};
			// if(e.keyCode === 13) {
				options.search = true;
				entity.searchResults = null;

				params.searchKey = entity.searchKey;
				params.searchType = entity.searchType;

				$http.get(personSearchUrl)
					.success(function(data, status, headers, config) {
						if(params.searchKey == '张' && params.searchType == 'name') {
							$timeout(function() {
								entity.searchResults = data.obj;
							}, 2000);
						} else {
							$timeout(function() {
								entity.searchResults = [];
							}, 2000);
						}
					})
					.error(function(data, status, headers, config) {
						console.log('Get ' + personSearchUrl + ' wrong...');
					})
			// }

			e.stopPropagation();
		};
		// 人员详细信息
		$scope.showDetailInfo = function(obj) {
			// $state.go('app.hr.staffInfo', { staffId: obj.id });
			var modalInstance = $modal.open({
				templateUrl: 'views/business/hr/staff/staff-info.html',
				controller: 'StaffInfoCtrl'
			});
		};
		// 添加关注确认
		$scope.collectionConfirm = function(user) {
			var modalInstance = $modal.open({
				templateUrl: 'views/business/home/contactlist/confirm.html',
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
				if(user.inCollection) {
					return;
				}
				if(rtnVal == 'confirm') {
					user.inCollection = true;
					modalInstance2 = $modal.open({
						templateUrl: 'views/business/home/contactlist/result.html',
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

app.controller('OrgSearchCtrl', ['$scope', '$http', '$timeout', '$modal', 'OrgSearch', 'DataService', 
	function($scope, $http, $timeout, $modal, OrgSearch, DataService) {
		var entity = $scope.entity = {};
		var options = $scope.options = {
			search: false,
			showDetail: false
		};
		var orgAreaUrl = 'data/bz/home/contactlist2/orgUnit-query12BranchCourts.json';
		var orgClassifyUrl = 'data/bz/home/contactlist2/common-queryOptions-type-DICT_OPTION-DICT_CODE-HR_ORG_CLASS.json';
		var orgSearchUrl = 'data/bz/home/contactlist2/orgUnit-queryListOrgByNameOrShortNameByPage.json';
		var orgDetailUrl = 'data/bz/home/contactlist2/orgUnit-queryOrgUnitInfoInCam-id-1421924106089631410343354.json';

		DataService.getData(orgAreaUrl)
			.then(function(data) {
				entity.area = data.obj;
			}, function(msg) {
				console.log(msg);
			});

		// DataService.getData(orgClassifyUrl)
		// 	.then(function(data) {
		// 		entity.classify = data.obj.split(';');
		// 		console.log(entity.classify)
		// 	}, function(msg) {
		// 		console.log(msg);
		// 	});

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
			// if(e.keyCode === 13) {
				options.search = true;
				entity.searchResults = null;

				params.searchArea = entity.areaSelected.ORG_UNIT_RGN;
				params.searchClassify = entity.classifySelected;

				$http.get(orgSearchUrl)
					.success(function(data, status, headers, config) {
						if(params.searchArea == '北京' && params.searchClassify == '大科学中心') {
							$timeout(function() {
								entity.searchResults = data.obj;
							}, 2000);
						} else {
							$timeout(function() {
								entity.searchResults = [];
							}, 2000);
						}
					})
					.error(function(data, status, headers, config) {
						console.log('Get ' + orgSearchUrl + ' wrong...');
					})
			// }

			e.stopPropagation();
		};
		// 查看组织详细信息
		$scope.showDetailInfo = function(org) {
			options.showDetail = true;
			
			$scope.selectedOrg = org;

			$scope.$watch(function() {
				return OrgSearch.getOrg();
			}, function() {
				$scope.selectedOrg = OrgSearch.getOrg();
			}, true);

			OrgSearch.setOrg(org);

			DataService.getData(orgDetailUrl)
				.then(function(data) {
					console.log(data);
					$scope.orgAndFatherOrgs = data.obj.orgUnit.orgAndFatherOrgs;
				}, function(msg) {
					console.error(msg);
				});

		};

		// 添加关注确认
		$scope.collectionConfirm = function(org) {
			var modalInstance = $modal.open({
				templateUrl: 'views/business/home/contactlist/confirm.html',
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
						templateUrl: 'views/business/home/contactlist/result.html',
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

// 下级组织页签
app.controller('ChildOrgsCtrl', ['$scope', '$http', 'OrgSearch', 'DataService', 
	function($scope, $http, OrgSearch, DataService) {
console.log(OrgSearch.getOrg())
		$scope.orgs = [];

		var childOrgsUrl = 'data/bz/home/contactlist2/orgUnit-queryNextContactTreeById.json';
		var orgInfoUrl = 'data/bz/home/contactlist2/orgUnit-queryOrgUnitInfoInCam-id-1421924106089631410343354.json';

		// $http.get(childOrgsUrl)
		// 	.success(function(data, status, headers, config) {
		// 		$scope.orgs = data.obj;
		// 	})
		// 	.error(function(data, status, headers, config) {
		// 		console.log('Get ' + childOrgsUrl + ' wrong...');
		// 	})

		DataService.getData(childOrgsUrl)
			.then(function(data) {
				$scope.orgs = data.obj;
			}, function(msg) {
				console.error(msg);
			});
		// DataService.getData(orgInfoUrl)
		// 	.then(function(data) {
		// 		console.log(data);
		// 		$scope.orgAndFatherOrgs = data.obj.orgUnit.orgAndFatherOrgs;
		// 		console.log($scope.orgAndFatherOrgs)
		// 	}, function(msg) {
		// 		console.error(msg);
		// 	});

		$scope.showDetailInfo = function(org) {
			console.log(org);
			OrgSearch.setOrg(org);
		};
	}
]);

// 人员信息页签
app.controller('OrgStaffsCtrl', ['$scope', '$http', 
	function($scope, $http) {
		$scope.orgStaffs = [];

		var orgStaffsUrl = 'data/bz/home/contactlist2/staffInfo-queryActStaffByOrgUnitId.json';

		$http.get(orgStaffsUrl)
			.success(function(data, status, headers, config) {
				$scope.orgStaffs = data.obj;
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + orgStaffsUrl + ' wrong...');
			})
	}
]);

// 组织信息页签
app.controller('OrgInfoCtrl', ['$scope', '$http', 
	function($scope, $http) {
		$scope.orgInfo = {};

		var orgInfoUrl = 'data/bz/home/contactlist2/orgUnit-queryOrgUnitInfoInCam-id-1421924106089631410343354.json';

		$http.get(orgInfoUrl)
			.success(function(data, status, headers, config) {
console.log(data.obj);
				$scope.orgInfo = data.obj.orgUnit;
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + orgInfoUrl + ' wrong...');
			})
	}
]);

// 组织的所有信息弹出层 controller
app.controller('OrgInfoAllCtrl',  ['$scope', '$http', '$modalInstance', '$modal', '$timeout', '$rootScope', 'CollectionService', 'OrgSearch', '$modalStack', 
    function($scope, $http, $modalInstance, $modal, $timeout, $rootScope, CollectionService, OrgSearch, $modalStack) {
		var org = OrgSearch.getOrg();
		
		var func = function(org) {
		    var orgDetailUrl = '/service/orgUnit!queryOrgUnitInfoInCam?ID=';
			
			// 组织面包屑
			$http.post(orgDetailUrl + org.ID)
				.success(function(data, status, headers, config) {
					$scope.orgAndFatherOrgs = data.obj.orgUnit.orgAndFatherOrgs;
				})
				.error(function(data, status, headers, config) {
					console.log(data);
				});
		};
		
		$scope.showOrgInfo = function(org) {			
			OrgSearch.setOrg(org);
		};

		$scope.$watch(function() {
			return OrgSearch.getOrg();
		}, function(newVal) {
			console.log(newVal);
			func(newVal);
		});
		
		// 返回通讯录
		$scope.backContactlist = function() {
//			$modalInstance.close();
			$modalStack.dismissAll();
		};
		
		$scope.cancel = function() {
//			$modalInstance.close();
			$modalStack.dismissAll();
		};
		
	}
]);

// 获取用户信息
app.controller('StaffInfoCtrl', ['$scope', '$stateParams', '$http', '$modalInstance', 
	function($scope, $stateParams, $http, $modalInstance){
		console.log($stateParams);
		var entity = $scope.entity = {};
		entity.color = 'blue';
		var urlStaffInfo = 'data/bz/home/contactlist2/staffInfo-queryStaffInfoAndTotalnameAndJobs-ID-1422945768950299610293279.json';
		$http.get(urlStaffInfo)
			.success(function(data, status, headers, config) {
				console.log(data);
				$scope.entity = data.obj;
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + urlStaffInfo + ' wrong...');
			})

		// 返回
		$scope.goBack = function() {console.log('goBack')
			$modalInstance.close();
			// history.back();
			// $scope.$apply();
		};
	}
]);

