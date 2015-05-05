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

app.controller('CollectionCtrl', ['$scope', 
	function($scope) {
		var options = $scope.options = {
			collectionNone: false
		};

		var collections = $scope.collections = {
			persons: [],
			orgs: []
		};

		if(collections.persons.length > 0 || collections.orgs.length > 0) {
			options.collectionNone = false;
		} else {
			options.collectionNone = true;
		}

		// 添加收藏
		$scope.addCollection = function() {
			var iTabsLen = $scope.contactListTabs.length;
			for(var i=0; i<iTabsLen; i++) {
				$scope.contactListTabs[i] = false;
			}
			$scope.contactListTabs[1] = true;
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

				params.searchKey = entity.searchKey;
				params.searchType = entity.searchType;

				$http.get(personSearchUrl)
					.success(function(data, status, headers, config) {
						console.log(data);
						$timeout(function() {
							entity.searchResults = data.obj;
						}, 2000);
					})
					.error(function(data, status, headers, config) {
						console.log('Get ' + personSearchUrl + ' wrong...');
					})
			}

			e.stopPropagation();
		};
		// 添加关注确认
		$scope.collectionConfirm = function(user) {
console.log(user);
			var modalInstance = $modal.open({
				templateUrl: 'views/business/home/contactlist/confirm.html',
				controller: 'ConfirmCtrl'
			});

			modalInstance.result.then(function(rtnVal) {
				console.log(rtnVal);
			}, function(rtnVal) {
				console.log(rtnVal)
			})
		};

		$scope.$watch('entity.searchKey', function(newVal) {
			// console.log(newVal);
		});
	}
]);

app.controller('ConfirmCtrl', ['$scope', '$modalInstance', 
	function($scope, $modalInstance) {
		$scope.confirm = function() {
			$modalInstance.close('confirm');
		};

		$scope.cancel = function() {
			$modalInstance.close('cancel');
		};
	}
])

app.controller('OrgSearchCtrl', ['$scope', 
	function($scope) {
		var entity = $scope.entity = {};

		entity.area = ['北京', '上海', '广州', '沈阳', '南京', '成都', '兰州', '武汉', '西安', '长春', '昆明', '新疆'];
		entity.classify = ['大科学中心', '创新研究院', '卓越创新中心', '特色研究所', '其他'];

		$scope.areaSelect = function(obj) {
			entity.areaSelected = obj;
		};

		$scope.classifySelect = function(obj) {
			entity.classifySelected = obj;
		};
	}
]);

app.controller('OrgTreeCtrl', ['$scope', 
	function($scope) {
		
	}
])