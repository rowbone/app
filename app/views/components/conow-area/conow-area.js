'use strict';

app.controller('AreaSelCtrl', ['$scope', '$http', '$filter', 
  function($scope, $http, $filter) {
    var entity = $scope.entity = {
      area: '广东',
      area2: '32010000'
    };

    var url = 'data/components/area/region.js';
    $http.get(url)
      .success(function(data, status, headers, config) {
        // console.log(data);
        var arr = [];
        var aData = [];
        if(typeof data === 'string') {
          data = $scope.$eval(data);
        }
        // 生成 object array 类型的数据 --> arr
        angular.forEach(data, function(value, key) {
          this.push({
            "code": key,
            "name": value[0],
            "spell": value[1],
            "simple_spell": value[2]
          });
        }, arr);

        entity.arr = arr;
      })
      .error(function(data, status, headers, config) {
        console.log('Get ' + url + ' data wrong...');
      });

    $scope.test = function() {

      entity.city = $filter('orderBy')($filter('areaFilter')(entity.arr, 'city'), 'spell');
      // var arrIndex = $filter('cityGroup')($filter('orderBy')($filter('areaFilter')(entity.arr, 'city'), 'spell'));
      var arrIndex = $filter('cityGroup')(entity.city);
      var arr = [];
      var arrGroup = ['A-E', 'F-J', 'K-O', 'P-T', 'U-Z'];
      for(var i=1; i<arrIndex.length; i++) {
        var label = arrGroup[i - 1];
        arr.push({
          'label': label,
          'spell': label,
          'simple_spell': label,
          'children': entity.city.slice(arrIndex[i-1], arrIndex[i])
        });
      }
      entity.cityGroup = arr;
    };
  }
]); 

// 对市一级数据进行分组
app.filter('cityGroup', function() {
  return function(input, letterSplit) {
    var arr = [0];
    var arrSplit = ['f', 'k', 'p', 'w'];
    for(var i=0; i<arrSplit.length; i++) {
      for(var j=0; j<input.length; j++) {
        if(input[j].spell.charAt(0) == arrSplit[i]) {
          // 有的字母没有对应的市一级名称，此行代码可获取到对应的字母和开始index
          // arr.push(arrSplit[i] + ':' + j);
          arr.push(j);
          break;
        }
      }
    }
    arr.push(input.length);

    return arr;
  }
});

app.service('CityGroupService', ['', function(){
  
}])

// 根据参数分别获取省、市、区的数据
app.filter('areaFilter', function() {
  return function(input, type) {
    var arr = [];
    var code = '';
    var regExpCity = /0{4}$/;
    var regExpProvince = /0{6}$/;
    angular.forEach(input, function(value, key) {
      code = value.code;
      if(type == 'county' && !regExpCity.test(code)) {
        this.push(value);
      } else if(type == 'city' && regExpCity.test(code) && !regExpProvince.test(code)) {
        this.push(value);
      } else if (type == 'province' && regExpProvince.test(code)) {
        this.push(value);
      }
    }, arr);

    return arr;
  }
})

app.directive('conowArea', ['$modal', '$parse', '$interval', '$http', 
  function($modal, $parse, $interval, $http) {
    return {
      restrict: 'A',
      require: '?ngModel',
      // templateUrl: 'views/components/conow-area/tpls/area_tpl.html',
      link: function(scope, elem, attrs, ctrl) {
        // 地区 CODE 转换获取地区名称
        elem.val('');

        $http.get('data/components/area/cities-map.json')
          .success(function(data, status) {
            // data = scope.$eval(data);
            var children = [];
            var handler = $interval(function() {
              if (!angular.equals(ctrl.$modelValue, NaN)) {
                $interval.cancel(handler);
                // label 用于跳出外层循环
                label: for (var i = 0; i < data.length; i++) {
                    children = data[i].children;
                    for (var j = 0; j < children.length; j++) {
                      if (children[j].CODE == ctrl.$viewValue) {
                        elem.val(children[j].NAME);
                        break label;
                      }
                    }
                  }
                  // elem.val(data[ctrl.$viewValue][0]);
              }
            }, 100);
          })
        .error(function(data, status) {
          console.log('Load region-map.json data wrong...');
        });

        elem.bind('click', function(e) {
          e.preventDefault();

          var modalInstance = $modal.open({
            templateUrl: 'views/components/conow-area/tpls/area-tpl.html',
            controller: 'AreaTreeCtrl',
            resolve: {
              modalParams: function() {
                var options = {};
                var selectLevel = attrs.selectLevel;
                if(selectLevel === undefined || selectLevel === '') {
                  options.selectLevel = 2;
                } else {
                  options.selectLevel = 1;
                }

                return options;
              }
            }
          });

          modalInstance.result.then(function(rtnVal) {
            if(rtnVal && rtnVal.label) {
              var value = rtnVal.label;
              elem.val(value);
              ctrl.$setViewValue(rtnVal.CODE);
            }
          }, function(rtnVal) {
            console.log(rtnVal);
          });
        });
      }
    }
  }
]);

// app.controller('ConowAreaCtrl', ['$scope', 
//   function($scope) {
//     console.log($scope.ngModel);
//   }
// ]);

app.controller('AreaTreeCtrl', ['$scope', '$timeout', '$http', '$modalInstance', 'modalParams',
  function($scope, $timeout, $http, $modalInstance, modalParams) {
    var tree = $scope.my_tree = {};

    var selectedData;

    $scope.treeOptions = modalParams;

    $scope.my_tree_handler = function(branch) {
      selectedData = branch;
    };

    $scope.confirm = function() {
      $modalInstance.close(selectedData);
    };

    $scope.close = function() {
      console.log('close');
      $modalInstance.dismiss('close');
    };

    $scope.cancel = function() {
      console.log('cancel');
      $modalInstance.dismiss('cancel');
    };

  }
]);