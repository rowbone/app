'use strict';

app.controller('contactListCtrl', ['$scope', '$http', 
  function($scope, $http) {

  	var options = $scope.options = {
  		collectionPersonUrl: 'data/bz/home/contactlist/collection-person.json',
  		collectionPersonMsg: '您目前还没有任何联系人',
  		collectionPersonAdd: '添加联系人',
  		collectionPersonNone: false,
  		collectionOrgUrl: 'data/bz/home/contactlist/collection-org.json',
  		collectionOrgMsg: '您目前还没有任何组织'
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
				console.log(data);
		  })
  }
]);