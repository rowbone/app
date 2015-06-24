
app.controller('footableCtrl', ['$scope', '$http', 'conowModals', '$timeout', 'footableRefresh', 
    function($scope, $http, conowModals, $timeout, footableRefresh) {
	$scope.search = {};
	$scope.result = [];
	$scope.search1 = {};
	$scope.result1 = [];

	$scope.save1 = function(){
		console.log('in save1');

		var modalInstance = conowModals.open({
			templateUrl: 'views/components/conow-footable/tpl-modal.html',
			title: '弹出层',
			controller: 'footableModalCtrl',
			size: 'full'
		});

		modalInstance.result.then(function(data) {
			if(data === 'yes') {
				// refresh
				footableRefresh.setRefresh(true);
			} else if(data === 'no') {
				// no refresh
				footableRefresh.setRefresh(false);
			} else {
				// wrong return value
			}
		}, function(msg) {
			console.log('msg-->', msg);
		});
	};

	$scope.save2 = function(){
		console.log('in save2')

		var modalInstance = conowModals.open({
			templateUrl: 'views/components/conow-footable/tpl-modal.html',
			title: '弹出层',
			controller: 'footableModalCtrl',
			size: 'full'
		});

		modalInstance.result.then(function(data) {
			if(data === 'yes') {
				// refresh
				footableRefresh.setRefresh(true);
			} else if(data === 'no') {
				// no refresh
				footableRefresh.setRefresh(false);
			} else {
				// wrong return value
			}
		}, function(msg) {
			console.log('msg-->', msg);
		});
	};
	
	$scope.selected = [{
				"ID": "3",
		    "TITLE": "请假审批",
		    "date": "2014-12-2 12:20",
		    "avatar": "img/person/person_photo_2.png",
		    "content": "有请假流程到你审批环节",
		    "url": "app.oa.chat"
		}, {
				"ID": "5",
		    "TITLE": "区文辉",
		    "date": "2014-10-1 12:20",
		    "avatar": "img/person/person_photo_3.png",
		    "content": "XXXXXXXX",
		    "url": "app.oa.chat"
		}, {
				"ID": "16",
		    "TITLE": "通知审批",
		    "date": "2014-12-1 12:20",
		    "avatar": "img/person/person_photo_3.png",
		    "content": "有待审批的通知需要处理",
		    "url": "app.oa.noticeAudit"
		}];

	
	$http.get('views/components/conow-footable/data/footable-list.json')
		.success(function(data, status, config, header) {
			$scope.jsons2 = data;
		})
		.error(function(data) {
			console.log('error data-->', data);
		});
	
	$scope.showSelect = function() {
		
		var modalInstance = conowModals.open({
			templateUrl: 'views/components/conow-footable/footable-sel.html',
			controller: 'footableSelCtrl',
			title: '选择',
			size: 'lg',
			resolve: {
				modalParams: function() {
					return {
						'selected': $scope.selected,
						'jsons': $scope.jsons2
					};
				}
			}
		});
		
		modalInstance.result.then(function(data) {
			console.log('in result-->', data);

			console.log('demo selected-->', $scope.selected);
		});
	};
	$scope.jsons = {
			  "obj":[
			         {
			                 "ID": "1",
			                 "TITLE": "陈晓龙",
			                 "date": "2014-12-2 12:20",
			                 "avatar": "img/person/person_photo_1.png",
			                 "content": "最近在忙什么呢？这里有干细胞的讲座",
			                 "url": "app.oa.chat"
			             }, {
			                 "ID": "2",
			                 "TITLE": "吴六军",
			                 "date": "2014-12-2 12:20",
			                 "avatar": "img/person/person_photo_2.png",
			                 "content": "去了一趟深圳，今天刚回来。",
			                 "url": "app.oa.chat"
			             }, {
			                 "ID": "3",
			                 "TITLE": "请假审批",
			                 "date": "2014-12-2 12:20",
			                 "avatar": "img/person/person_photo_2.png",
			                 "content": "有请假流程到你审批环节",
			                 "url": "app.oa.chat"
			             }, {
			                 "ID": "4",
			                 "TITLE": "会议通知",
			                 "date": "2014-10-1 12:20",
			                 "avatar": "img/person/person_photo_2.png",
			                 "content": "网络会议：本月总结工作会议",
			                 "url": "app.oa.chat"
			             }, {
			                 "ID": "5",
			                 "TITLE": "区文辉",
			                 "date": "2014-10-1 12:20",
			                 "avatar": "img/person/person_photo_3.png",
			                 "content": "XXXXXXXX",
			                 "url": "app.oa.chat"
			             }, {
			                 "ID": "6",
			                 "TITLE": "张森玲",
			                 "date": "2014-10-1 12:20",
			                 "avatar": "img/person/person_photo_4.png",
			                 "content": "陈小虎在你那吗？",
			                 "url": "app.oa.chat"
			             }, {
			                 "ID": "7",
			                 "TITLE": "中科院内部新闻",
			                 "date": "2014-10-1 12:20",
			                 "avatar": "img/person/person_photo_3.png",
			                 "content": "XX省纪委领导考察我院，对科研工作创",
			                 "url": "app.oa.chat"
			             }, {
			                 "ID": "8",
			                 "TITLE": "流程通知",
			                 "date": "2014-9-1 12:20",
			                 "avatar": "img/person/person_photo_4.png",
			                 "content": "您的出差报销已经审批通过，全额1234",
			                 "url": "app.oa.chat"
			             }, {
			                 "ID": "9",
			                 "TITLE": "指南征集",
			                 "date": "2014-9-1 12:20",
			                 "avatar": "img/person/person_photo_2.png",
			                 "content": "细胞生物学 生物技术和现代农业技术",
			                 "url": "app.oa.chat"
			             }, {
			                 "ID": "10",
			                 "TITLE": "张三",
			                 "date": "2014-9-1 12:20",
			                 "avatar": "img/person/person_photo_2.png",
			                 "content": "XXXXXXXX",
			                 "url": "app.oa.chat"
			             }, {
			                 "ID": "11",
			                 "TITLE": "李四",
			                 "date": "2014-9-1 12:20",
			                 "avatar": "img/person/person_photo_2.png",
			                 "content": "XXXXXXXX",
			                 "url": "app.oa.chat"
			             }, {
			                 "ID": "12",
			                 "TITLE": "出差审批",
			                 "date": "2014-12-11 16:20",
			                 "avatar": "img/person/person_photo_2.png",
			                 "content": "有出差流程到你审批环节",
			                 "url": "app.fm.approve.tripReqApproveList"
			             }, {
			                 "ID": "13",
			                 "TITLE": "报销列表",
			                 "date": "2014-12-1 12:20",
			                 "avatar": "img/person/person_photo_4.png",
			                 "content": "有报销流程到你审批环节",
			                 "url": "app.fm.approve.expenseApproveList"
			             }, {
			                 "ID": "14",
			                 "TITLE": "通知公告公示",
			                 "date": "2014-12-1 12:20",
			                 "avatar": "img/person/person_photo_1.png",
			                 "content": "有新的通知公告公示",
			                 "url": "app.oa.messageList"
			             }, {
			                 "ID": "15",
			                 "TITLE": "通知发布",
			                 "date": "2014-12-1 12:20",
			                 "avatar": "img/person/person_photo_2.png",
			                 "content": "有待发布的通知需要处理",
			                 "url": "app.oa.noticeRelease"
			             }, {
			                 "ID": "16",
			                 "TITLE": "通知审批",
			                 "date": "2014-12-1 12:20",
			                 "avatar": "img/person/person_photo_3.png",
			                 "content": "有待审批的通知需要处理",
			                 "url": "app.oa.noticeAudit"
			             }
			       ]
			     }
}]);

// 响应式列表弹出层选择 controller
app.controller('footableSelCtrl', ['$scope', '$conowModalInstance', 'modalParams', '$http', 
    function($scope, $conowModalInstance, modalParams, $http) {
		$scope.search = {};
		$scope.result = [];
		
		$scope.jsons = modalParams.jsons;
		$scope.selected = modalParams.selected; 
		
		$scope.save = function(){
			alert('你点击了保存');
		};
		
		$scope.confirm = function() {console.log('confirm-->', $scope.selected);
			$conowModalInstance.close($scope.selected);
		};

	}
]);

// 弹出层操作 controller
app.controller('footableModalCtrl', ['$scope', '$conowModalInstance', 
	function($scope, $conowModalInstance) {

		$scope.isRefresh = 'no';

		$scope.confirm = function() {
			$conowModalInstance.close($scope.isRefresh);
		};

	}
]);