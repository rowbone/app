'use strict';

app.controller('AreaSelCtrl', ['$scope', '$http', '$filter', 
  function($scope, $http, $filter) {
    $scope.entity = {
      area: '广东',
      area2: '32010000'
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