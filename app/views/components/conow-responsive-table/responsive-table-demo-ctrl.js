'use strict';

app.controller('responsiveTableDemoCtrl', ['$scope', 'ngTableParams', '$filter', '$timeout', '$interval', 'DataService', 
	function($scope, ngTableParams, $filter, $timeout, $interval, DataService) {
    var data = $scope.data = [];
    var options = $scope.options = {
      multiSelect: 'true'
    };

    var vm = $scope.vm = {
      'searchKey': '',
      'selected': []
    };

    $scope.filterFn = function(filterObj, keyWord) {
      // return 
      console.log(111111)
      console.log(filterObj, keyWord);

      return filterObj;
    };
    
    // $interval(function() {
    //   $scope.tableParams.reload();
    // }, 3000);

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,           // count per page
        // sorting: {
        //   name: 'asc'
        // }
    }, {
        total: 0, // length of data
        filterDelay: 0,   // filter delay time
        // groupBy: 'name',
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


              $scope.tableParams.total(data.length);

              var orderedData = data;

              orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : data;
              orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : data;
              // orderedData = $filter('filter')(orderedData, vm.searchKey);
              // orderedData = $filter('filter')(orderedData, {'name': vm.searchKey} || {'age': vm.searchKey});
              orderedData = $filter('filter')(orderedData, filterFn);

              params.total(orderedData.length);

              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }, function(msg) {
              console.error('msg-->', msg);
            });

        }
    });

    /**
     * 单个搜索
     */
    $scope.$watch('vm.searchKey', function() {
      $scope.tableParams.reload();
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

    /**
     * 判断行数据是否包含在已选择数组
     */
    $scope.indexInSelectedArr = function(row) {
      var selectedArr = vm.selected;

      for(var i=0; i<selectedArr.length; i++) {
        if(angular.equals(row, selectedArr[i])) {
          return i;
        }
      }

      return -1;
    };

    // 行点击事件触发
    $scope.changeSelection = function(row, e) {
      e.preventDefault();

      var selectedArr = vm.selected;
      
      var index = $scope.indexInSelectedArr(row);

      if(options.multiSelect === 'true') {
        if(index < 0) {
          vm.selected.push(row);
        } else {
          vm.selected.splice(index, 1);
        }
      } else {
        if(index < 0) {
          var arr = [];
          arr.push(row);

          vm.selected = arr;          
        } else {
          vm.selected = [];
        }
      }      

      e.stopPropagation();
    };

    $scope.checkboxSel = function(e) {
      e.preventDefault();

      console.log('checkboxSel')
      e.stopPropagation();
    };

        
	}
]);