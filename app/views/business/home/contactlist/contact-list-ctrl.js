'use strict';

app.controller('contactListCtrl', ['$scope', '$http', '$rootScope', 
  function($scope, $http, $rootScope) {

  	var options = $scope.options = {
  		page: '1',				// 用数字不用 boolean 值，为了后期增加页面时方便扩展
  		headerBtn: '1',		// 用数字不用 boolean 值，为了后期增加按钮时方便扩展
  		collectionPersonUrl: 'data/bz/home/contactlist/collection-person.json',
  		collectionPersonNoneMsg: '您目前还没有任何联系人',
  		collectionPersonAdd: '添加联系人',
  		collectionPersonNone: false,
  		collectionOrgUrl: 'data/bz/home/contactlist/collection-org.json',
  		collectionOrgNoneMsg: '您目前还没有任何组织',
  		collectionOrgAdd: '添加组织',
  		collectionOrgNone: false,
  		areaUrl: 'data/bz/home/contactlist/area.json',
  		areaNoneMsg: '未获取到区域信息',
  		typeUrl: 'data/bz/home/contactlist/type.json',
  		typeNoneMsg: '未获取到分类信息',
  		userSearch: false,
  		orgSearch: false
  	};

  	var entity = $scope.entity = {};  	
	
		$http.get(options.collectionPersonUrl)
		  .success(function(data, status, headers, config) {
				console.log(data);

				if(data.length == 0) {
					options.collectionPersonNone = true;
				} else {
					options.collectionPersonNone = false;
				}
				entity.collectionPerson = data;
		  })
		  .error(function(data, status, headers, config) {
				console.log('Get collection-person.json wrong...');
		  });

		 $http.get(options.collectionOrgUrl)
		 	.success(function(data, status, headers, config) {
		 		console.log(data);

		 		if(data.length == 0) {
		 			options.collectionOrgNone = true;
		 		} else {
		 			options.collectionOrgNone = false;
		 		}
		 		entity.collectionOrg = data;
		 	})
		 	.error(function(data, status, headers, config) {
		 		console.log('Get collection-org.json wrong...')
		 	});

		// 头部展示第一个按钮
		$scope.showBtn1 = function() {
			options.headerBtn = 1;
		};

		$scope.showBtn2 = function() {
			options.headerBtn = 2;
		};

		// 展示收藏页
		$scope.showPage1 = function() {
			options.page = 1;
			options.headerBtn = 1;
		};

		$scope.showPage2 = function() {
			options.page = 2;
			options.headerBtn = 1;
console.log(entity.areas);
			if (!entity.areas) {
    		$http.get(options.areaUrl)
	        .success(function(data, status, headers, config) {
            console.log(data);
            if (data.length == 0) {
              console.log(options.areaNoneMsg);
            } else {
              entity.areas = data;
            }
	        })
	        .error(function(data, status, headers, config) {
            console.log('Get area.json wrong...');
	        });
			}

			if(!entity.orgTypes) {
				$http.get(options.typeUrl)
					.success(function(data, status, headers, config) {
						if(data.length == 0) {
							console.log(options.typeNoneMsg);
						} else {
							entity.orgTypes = data;
						}
					})
					.error(function(data, status, headers, config) {
						console.log('Get type.json wrong...');
					});
			}

			console.log(entity.areas);

		};

		$scope.searchFunc = function() {
			console.log(options)
			// 第二页，找人按钮
			if(options.page == 2 && options.headerBtn == 1) {
				options.userSearch = true;	
				options.orgSearch = false;			
			}
			if(options.page == 2 && options.headerBtn == 2) {
				options.userSearch = false;
				options.orgSearch = true;
			}
		};
  }
]);