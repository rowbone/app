'use strict';

app.controller('AreaSelCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.entity = {
      area: '广东',
      area2: '44000000'
    };
  }
]); 


app.directive('conowArea', ['$modal', '$parse', '$interval', '$http', 
  function($modal, $parse, $interval, $http) {
    return {
      restrict: 'A',
      require: '?ngModel',
      // templateUrl: 'views/components/conow-area/tpls/area_tpl.html',
      link: function(scope, elem, attrs, ctrl) {
        // 地区 CODE 转换获取地区名称
        elem.val('');
        var handler = $interval(function() {
          if(!angular.equals(ctrl.$modelValue, NaN)) {
            $interval.cancel(handler);

            $http.get('data/bz/region-map.js')
              .success(function(data, status) {
                data = scope.$eval(data);
                elem.val(data[ctrl.$viewValue][0]);
              })
              .error(function(data, status) {
                console.log('Load region.js data wrong...');
              })
          }
        }, 10);

        elem.bind('click', function(e) {
          e.preventDefault();

          var modalInstance = $modal.open({
            templateUrl: 'views/components/conow-area/tpls/area-tpl.html',
            controller: 'AreaTreeCtrl'
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

app.controller('ConowAreaCtrl', ['$scope', 
  function($scope) {
    console.log($scope.ngModel);
  }
])
app.controller('AreaTreeCtrl', ['$scope', '$timeout', '$http', '$modalInstance',  
  function($scope, $timeout, $http, $modalInstance) {
    var tree = $scope.my_tree = {};

    var selectedData;

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