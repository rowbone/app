'use strict';

app.controller('responsiveTableDemoCtrl', ['$scope', 'ngTableParams', '$filter', '$timeout', '$interval', 
	function($scope, ngTableParams, $filter, $timeout, $interval) {
    
		var data = $scope.data = [
      {name: "Moroni", age: 50},
      {name: "Tiancum", age: 43},
      {name: "Jacob", age: 27},
      {name: "Nephi", age: 29},
      {name: "Enos", age: 34},
      {name: "Tiancum", age: 43},
      {name: "Jacob", age: 27},
      {name: "Nephi", age: 29},
      {name: "Enos", age: 34},
      {name: "Tiancum", age: 43},
      {name: "Jacob", age: 27},
      {name: "Nephi", age: 29},
      {name: "Enos", age: 34},
      {name: "Tiancum", age: 43},
      {name: "Jacob", age: 27},
      {name: "Nephi", age: 29},
      {name: "Enos", age: 34}
    ];
    
    

        $interval(function() {console.log('$timeout')
          // $scope.users = [{name: "Moroni", age: 50}];
          console.log('in reload...');

          // data = [{name: '123', age: 8}];
          $scope.tableParams.reload();
        }, 3000);

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10           // count per page
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {
                $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

        // $scope.$watch('$scope.$data', function(newVal, oldVal) {
        //   console.log('newVal-->', newVal);
        // }, true);

        // $scope.userEditClick = function(user, e) {
        //   e.preventDefault();

        //   console.log(user);
        //   user.$edit = !user.$edit;

        //   e.stopPropagation();
        // };

        
	}
]);