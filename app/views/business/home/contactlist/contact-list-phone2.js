'use strict';

// OrgSearch service 用于保存点击的组织
app.service('OrgSearch', function(){
	var selectedOrg = '';

	this.setOrg = function(org) {
		selectedOrg = org;
	};

	this.getOrg = function() {
		return selectedOrg;
	}
});
// 人员分组过滤器
app.filter('userGroup', ['$filter', 
	function($filter) {
		return function(input, groupCode) {
			if(!angular.isArray(input)) {
				console.error('Input must be an array.')
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
				value.groupCode = value.groupCode.toUpperCase();
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
			var url = 'data/bz/area.json';
			DataService.getData(url)
				.then(function success(data) {
					console.log(data);
				}, function error(msg) {
					console.log(msg);
				}, function notification(notification) {
					console.info(notification)
				})
				// 当调用了 reject 回调函数时，catch 会被自动忽略
				.catch(function(msg) {
					console.error(msg)
				});
		};

	}
]);

// 关注
app.controller('CollectionCtrl', ['$scope', '$http', '$timeout', '$filter', '$state', '$modal', 'DataService', 
	function($scope, $http, $timeout, $filter, $state, $modal, DataService) {
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
				var personsGroup = $filter('userGroup')(persons, 'groupCode');
				collections.persons = persons;
				collections.personsGroup = personsGroup;
			}, function error(msg) {
				console.error(msg);
			});

		// $http.get(urlCollectionsOrgs) 
		// 	.success(function(data, status, headers, config) {
		// 		var orgs = data.obj;
		// 		collections.orgs = orgs;
		// 	})
		// 	.error(function(data, status, headers, config) {
		// 		console.log('Get ' + urlCollectionsOrgs + ' wrong...');
		// 	});

		// $http.get(urlCollectionsPersons) 
		// 	.success(function(data, status, headers, config) {
		// 		var persons = data.obj;
		// 		collections.persons = persons;
		// 	})
		// 	.error(function(data, status, headers, config) {
		// 		console.log('Get ' + urlCollectionsPersons + ' wrong...');
		// 	});

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

		$scope.collectionPersonFilter = function(group, subLabel) {
			group.selectedSub = subLabel;
		};

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

	}
]);

// 已关注搜索弹出层 controller
app.controller('CollectionSearchModalCtrl', ['$scope', '$modalInstance', 'modalParams', '$filter', 
	function($scope, $modalInstance, modalParams, $filter) {
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
				entity.filteredPersons = $filter('orderBy')($filter('filter')(entity.collectionsPersons, newVal), 'groupCode');
				entity.filteredOrgs = $filter('orderBy')($filter('filter')(entity.collectionsOrgs, newVal), 'groupCode');
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
				console.log(entity.area);
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
			console.log(entity.areaSelected)
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
				console.log(OrgSearch.getOrg());
				$scope.selectedOrg = OrgSearch.getOrg();
			}, true);

			OrgSearch.setOrg(org);

			$http.get(orgDetailUrl)
				.success(function(data, status, headers, config) {
					$scope.orgInfo = data.obj;
				})
				.error(function(data, status, headers, config) {
					console.log('Get ' + orgDetailUrl + ' wrong...');
				})
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
app.controller('ChildOrgsCtrl', ['$scope', '$http', 'OrgSearch',
	function($scope, $http, OrgSearch) {
console.log(OrgSearch.getOrg())
		$scope.orgs = [];

		var childOrgsUrl = 'data/bz/home/contactlist2/orgUnit-queryNextContactTreeById.json';

		$http.get(childOrgsUrl)
			.success(function(data, status, headers, config) {
console.log(data.obj);
				$scope.orgs = data.obj;
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + childOrgsUrl + ' wrong...');
			})

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
console.log(data.obj);
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

