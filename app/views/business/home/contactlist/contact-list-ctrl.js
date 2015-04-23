'use strict';

app.controller('contactListCtrl', ['$scope', '$http', 
  function($scope, $http) {

  	var options = $scope.options = {
  		page: '1',				// 用数字不用 boolean 值，为了后期增加页面时方便扩展
  		headerBtn: '1',		// 用数字不用 boolean 值，为了后期增加按钮时方便扩展
  		collectionPersonUrl: 'data/bz/home/contactlist/collection-person.json',
  		collectionPersonMsg: '您目前还没有任何联系人',
  		collectionPersonAdd: '添加联系人',
  		collectionPersonNone: false,
  		collectionOrgUrl: 'data/bz/home/contactlist/collection-org.json',
  		collectionOrgMsg: '您目前还没有任何组织',
  		collectionOrgAdd: '添加组织',
  		collectionOrgNone: false,
  		radioAreaUrl: 'data/bz/home/contactlist/radio-area.json'
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

		 $http.get(options.radioAreaUrl)
		 	.success(function(data, status, headers, config) {
		 		if(data.length == 0) {
		 			// 
		 		} else {
		 			entity.radioArea = data;
		 		}
		 	})
		 	.error(function(data, status, headers, config) {
		 		console.log('wrong')
		 	});
  }
]);