'use strict';

app.controller('contactListCtrl2', ['$scope', 
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

			console.log($scope.contactListTabs)
		};
	}
]);

app.controller('CollectionCtrl', ['$scope', '$http', '$timeout', '$filter', '$state', 
	function($scope, $http, $timeout, $filter, $state) {
		var urlCollectionsOrgs = 'data/bz/home/contactlist2/collections-orgs.json';
		var urlCollectionsPersons = 'data/bz/home/contactlist2/collections-persons.json';

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
		var personSearchUrl = 'data/bz/home/contactlist2/staffInfo-queryStaffInfoByNameByPage.json';

		entity.searchType = 'name';

		// 搜索框 enter 触发搜索事件
		$scope.enterPress = function(e) {
			var params = {};
			if(e.keyCode === 13) {
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
			}

			e.stopPropagation();
		};
		// 人员详细信息
		$scope.showDetailInfo = function(obj) {
			// $state.go('app.hr.staffInfo', { staffId: obj.id });
			var modalInstance = $modal.open({
				templateUrl: 'views/business/hr/staff/staff-info.html'
			})
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
				console.log(rtnVal);
				// if(rtnVal == 'confirm') {
				// 	modalInstance2 = $modal.open({
				// 		templateUrl: 'views/business/home/contactlist/result.html',
				// 	});
				// }
			}, function(rtnVal) {
				console.log(rtnVal)
			})
		};

		$scope.$watch('entity.searchKey', function(newVal) {
			// console.log(newVal);
		});
	}
]);

app.controller('ConfirmCtrl', ['$scope', '$modalInstance', 'modalParams', 
	function($scope, $modalInstance, modalParams) {
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
])

app.controller('OrgSearchCtrl', ['$scope', '$http', '$timeout', '$modal', 
	function($scope, $http, $timeout, $modal) {
		var entity = $scope.entity = {};
		var options = $scope.options = {
			search: false,
			showDetail: false
		};
		var orgAreaUrl = 'data/bz/home/contactlist2/orgUnit-query12BranchCourts.json';
		var orgClassifyUrl = 'data/bz/home/contactlist2/common-queryOptions-type-DICT_OPTION-DICT_CODE-HR_ORG_CLASS.json';
		var orgSearchUrl = 'data/bz/home/contactlist2/orgUnit-queryListOrgByNameOrShortNameByPage.json';
		var orgDetailUrl = 'data/bz/home/contactlist2/orgUnit-queryOrgUnitInfoInCam-id-1421924106089631410343354.json';

		$http.get(orgAreaUrl)
			.success(function(data, status, headers, config) {
				console.log(data);
				// entity.area = data.obj;
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + orgAreaUrl + ' wrong...');
			})

		$http.get(orgClassifyUrl)
			.success(function(data, status, headers, config) {
				console.log(data);
				// entity.classify = data.obj;
			})
			.error(function(data, status, headers, config) {
				console.log('Get ' + orgClassifyUrl + ' wrong...');
			})

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
			if(e.keyCode === 13) {
				options.search = true;
				entity.searchResults = null;

				params.searchArea = entity.areaSelected;
				params.searchClassify = entity.classifySelected;

				$http.get(orgSearchUrl)
					.success(function(data, status, headers, config) {
						if(params.searchArea == '北京' && params.searchClassify == '大科学中心') {
							$timeout(function() {
console.log(data)
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
			}

			e.stopPropagation();
		};

		$scope.showDetailInfo = function(org) {
			// var modalInstance = $modal.open({
			// 	templateUrl: 'views/business/hr/org/org-info.html'
			// })
			options.showDetail = true;
			$http.get(orgDetailUrl)
				.success(function(data, status, headers, config) {
console.log(data);
					$scope.orgInfo = data.obj;
				})
				.error(function(data, status, headers, config) {
					console.log('Get ' + orgDetailUrl + ' wrong...');
				})
		};
	}
]);

app.controller('OrgTreeCtrl', ['$scope', 
	function($scope) {
		
	}
]);

// 下级组织页签
app.controller('ChildOrgsCtrl', ['$scope', '$http', 
	function($scope, $http) {
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

