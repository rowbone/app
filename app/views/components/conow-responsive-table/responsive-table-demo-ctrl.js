'use strict';

app.controller('responsiveTableDemoCtrl', ['$scope', 'ngTableParams', '$filter', '$timeout', '$interval', 'DataService', 
	function($scope, ngTableParams, $filter, $timeout, $interval, DataService) {
    var data = $scope.data = [];
    var options = $scope.options = {
      multiSelect: false
    };
    
    // $interval(function() {
    //   $scope.tableParams.reload();
    // }, 3000);

    $scope.tableParams = new ngTableParams({
        filterDelay: 0,   // filter delay time
        page: 1,            // show first page
        count: 10,           // count per page
        // sorting: {
        //   name: 'asc'
        // }
    }, {
        total: 0, // length of data
        getData: function($defer, params) {

          var url = 'views/components/conow-responsive-table/data/users.json';
          // var url = '/dataGenerate/users';
          DataService.getData(url)
            .then(function(data) {
              data = data;

              var random = parseInt(10 * Math.random(0, 1));
              if(random % 2) {
                data.unshift({'name': 'abc', 'age': 3});
              } else {
                data.unshift({'name': 'aaa', 'age': 2});
              }

              params.total(data.length);

              var orderedData = data;

              orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : data;
              orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : data;

              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }, function(msg) {
              console.error('msg-->', msg);
            });

        }
    });

    // $scope.userEditClick = function(user, e) {
    //   e.preventDefault();

    //   console.log(user);
    //   user.$edit = !user.$edit;

    //   e.stopPropagation();
    // };

    $scope.dataChange = function() {
      // data = data.unshift({'name': 'abc', 'age': 3});
      data = [{'name': 'abc', 'age': 3}];

      $scope.tableParams.reload();
    };

    // 行点击事件触发
    $scope.changeSelection = function(row, e) {
      e.preventDefault();

      console.log('one row click')
      // console.log(row);
      var tableData = $scope.tableParams.data;
console.log(tableData)
      for(var i=0; i<tableData.length; i++) {
        $scope.tableParams.data[i].$selected = false;
      }
      row.$selected = true;

      e.stopPropagation();
    }

        
	}
]);