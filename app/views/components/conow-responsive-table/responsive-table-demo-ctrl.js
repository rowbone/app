'use strict';

app.controller('responsiveTableDemoCtrl', ['$scope', 'ngTableParams', '$filter', '$timeout', '$interval', 'DataService', '$parse', 
	function($scope, ngTableParams, $filter, $timeout, $interval, DataService, $parse) {
    var data = $scope.data = [];
    var options = $scope.options = {
      multiSelect: 'true'
    };

    var vm = $scope.vm = {
      'searchKey': '',
      'selected': []
    };

    $scope.filterFn = function(filterObj, searchKey) {

      return (filterObj.name.indexOf(vm.searchKey) > -1) || (filterObj.sex.indexOf(vm.searchKey) > -1)
    };

    $scope.getSelectedData = function() {
      vm.selectedData = $scope.tableParams.getSelectedData();
    };
    
    // 处理 table 数据
    var tableDataDeal = function(dataSrc, params) {
      var orderedData = angular.copy(dataSrc);

      orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
      orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;

      orderedData = $filter('filter')(orderedData, vm.searchKey);

      return orderedData;
    };

    // $scope.tableData = [];
    vm.sum = {
      'name': 'abc'
    };

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
          name: 'asc'
        },
        isMultiSel: false,
        isShowSearch: true,

        noDataTip: '没有数据时，我要显示这个！'
    }, {
        total: 0, // length of data
        // filterDelay: 0,   // filter delay time
        // counts: [10, 25, 50, 100],
        getData: function($defer, params) {

          if($scope.tableData) {
            var orderedData = $scope.tableData;

            orderedData = tableDataDeal(orderedData, params);

            params.total(orderedData.length);

            var page = params.page();
            var count = params.count();

            $defer.resolve(orderedData.slice((page - 1) * count, page * count));
          } else {
            var url = 'views/components/conow-responsive-table/data/users.json';
            // var url = '/dataGenerate/users';
            DataService.getData(url)
              .then(function(data) {

                $scope.tableData = data;

                var orderedData = $scope.tableData;

                orderedData = tableDataDeal(orderedData, params);

                params.total(orderedData.length);
                // set count to all data's length to void pagination
                // params.count(orderedData.length);

                var page = params.page();
                var count = params.count();

                $defer.resolve(orderedData.slice((page - 1) * count, page * count));
                // $defer.resolve(orderedData);
              }, function(msg) {
                console.error('msg-->', msg);
              });
          }
          

        }
    });

    /**
     * 单个搜索
     */
    // $scope.$watch('vm.searchKey', function() {
    //   $scope.tableParams.reload();
    // });

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

      console.log('checkboxSel');
      e.stopPropagation();
    };

    $scope.tableParams2 = new ngTableParams({
      page: 1,
      count: 10
    }, {
      getData: function($defer, params) {
        var url = 'views/components/conow-responsive-table/data/pagination1.json';
        console.log(params.page());
          
        var pageParams = {
          page: params.page(),      // params.page() 方法获取当前点击的页码
          pagesize: 10,
          ORG_UNIT_ID: '1421924106089631410343354'
        };

        DataService.getData(url)
          .then(function(data) {
            console.log(data);

            // params.settings.counts([]);

            params.total(data.pageInfo.count);

            $defer.resolve(data.obj);
          }, function(msg) {
            console.error(msg);
          });
      }
    });

        
	}
]);