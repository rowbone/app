
app.controller('footableCtrl', ['$scope', '$http', 'conowModals', 
    function($scope, $http, conowModals) {
	$scope.search = {};
	$scope.result = [];
	$scope.search1 = {};
	$scope.result1 = [];
	$scope.save = function(){
		arp.alert('你点击了保存');
	};
	
	$scope.selected = 
		[{
	           "TITLE": "请假审批",
	           "date":"2014-12-2 12:20",
	           "avatar": "img/person/person_photo_2.png",
	           "content":"有请假流程到你审批环节",
	           "url":"app.oa.chat"
	         }, {
		           "TITLE": "区文辉",
		           "date":"2014-10-1 12:20",
		           "avatar": "img/person/person_photo_3.png",
		           "content":"XXXXXXXX",
		           "url":"app.oa.chat"
		         }];
	
	$http.get('views/components/conow-footable/data/footable-list.json')
		.success(function(data, status, config, header) {
			console.log(data);
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
		});
	};
	$scope.jsons = {
			  "obj":[
			         {
			           "TITLE": "陈晓龙",
			           "date":"2014-12-2 12:20",
			           "avatar": "img/person/person_photo_1.png",
			           "content":"最近在忙什么呢？这里有干细胞的讲座",
			           "url":"app.oa.chat"
			         },
			         {
			           "TITLE": "吴六军",
			           "date":"2014-12-2 12:20",
			           "avatar": "img/person/person_photo_2.png",
			           "content":"去了一趟深圳，今天刚回来。",
			           "url":"app.oa.chat"
			         },
			         {
			           "TITLE": "请假审批",
			           "date":"2014-12-2 12:20",
			           "avatar": "img/person/person_photo_2.png",
			           "content":"有请假流程到你审批环节",
			           "url":"app.oa.chat"
			         },
			         {
			           "TITLE": "会议通知",
			           "date":"2014-10-1 12:20",
			           "avatar": "img/person/person_photo_2.png",
			           "content":"网络会议：本月总结工作会议",
			           "url":"app.oa.chat"
			         },
			         {
			           "TITLE": "区文辉",
			           "date":"2014-10-1 12:20",
			           "avatar": "img/person/person_photo_3.png",
			           "content":"XXXXXXXX",
			           "url":"app.oa.chat"
			         },
			         {
			           "TITLE": "张森玲",
			           "date":"2014-10-1 12:20",
			           "avatar": "img/person/person_photo_4.png",
			           "content":"陈小虎在你那吗？",
			           "url":"app.oa.chat"
			         },
			         {
			           "TITLE": "中科院内部新闻",
			           "date":"2014-10-1 12:20",
			           "avatar": "img/person/person_photo_3.png",
			           "content":"XX省纪委领导考察我院，对科研工作创",
			           "url":"app.oa.chat"
			         },
			         {
			           "TITLE": "流程通知",
			           "date":"2014-9-1 12:20",
			           "avatar": "img/person/person_photo_4.png",
			           "content":"您的出差报销已经审批通过，全额1234",
			           "url":"app.oa.chat"
			         },
			         {
			           "TITLE": "指南征集",
			           "date":"2014-9-1 12:20",
			           "avatar": "img/person/person_photo_2.png",
			           "content":"细胞生物学 生物技术和现代农业技术",
			           "url":"app.oa.chat"
			         },
			         {
			           "TITLE": "张三",
			           "date":"2014-9-1 12:20",
			           "avatar": "img/person/person_photo_2.png",
			           "content":"XXXXXXXX",
			           "url":"app.oa.chat"
			         },
			         {
			           "TITLE": "李四",
			           "date":"2014-9-1 12:20",
			           "avatar": "img/person/person_photo_2.png",
			           "content":"XXXXXXXX",
			           "url":"app.oa.chat"
			         },
			         {
			           "TITLE": "出差审批",
			           "date":"2014-12-11 16:20",
			           "avatar": "img/person/person_photo_2.png",
			           "content":"有出差流程到你审批环节",
			           "url":"app.fm.approve.tripReqApproveList"
			         },
			         {
			           "TITLE": "报销列表",
			           "date":"2014-12-1 12:20",
			           "avatar": "img/person/person_photo_4.png",
			           "content":"有报销流程到你审批环节",
			           "url":"app.fm.approve.expenseApproveList"
			         },
			         {
			           "TITLE": "通知公告公示",
			           "date":"2014-12-1 12:20",
			           "avatar": "img/person/person_photo_1.png",
			           "content":"有新的通知公告公示",
			           "url":"app.oa.messageList"
			         },
			         {
			           "TITLE": "通知发布",
			           "date":"2014-12-1 12:20",
			           "avatar": "img/person/person_photo_2.png",
			           "content":"有待发布的通知需要处理",
			           "url":"app.oa.noticeRelease"
			         },
			          {
			           "TITLE": "通知审批",
			           "date":"2014-12-1 12:20",
			           "avatar": "img/person/person_photo_3.png",
			           "content":"有待审批的通知需要处理",
			           "url":"app.oa.noticeAudit"
			         }
			       ]
			     }
}]);

// 响应式列表弹出层选择 controller
app.controller('footableSelCtrl', ['$scope', '$conowModalInstance', 'modalParams', '$http', 
    function($scope, $conowModalInstance, modalParams, $http) {
		console.log(modalParams);
		$scope.search = {};
		$scope.result = [];
		
		$scope.jsons = modalParams.jsons;
		$scope.selected = modalParams.selected; 
		
		$scope.save = function(){
			arp.alert('你点击了保存');
		};
		
		$scope.ok = function() {
			console.log('')
			$conowModalInstance.close($scope.selected);
		}
	}
])


