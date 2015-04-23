'use strict';

app.controller('AreaSelCtrl', ['$scope', '$http', '$filter', 
  function($scope, $http, $filter) {
    $scope.entity = {
      area: '广东',
      area2: '44000000'
    };

    $http.get('data/components/area/cities.json')
      .success(function(data, status, headers, config) {
        var iLen = data.length;
        var arr1 = [], arr2 = [], arr3 = [], arr4 = [], arr5 = [], arr6 = [];

        for(var i=0; i<iLen; i++) {
          // 
        }
      })
      .error(function(data, status, headers, config) {
        console.log('Load cities.json data wrong...')
      })

    // $http.get('data/bz/region.json')
    //   .success(function(data, status) {
    //     var iLen = data.length;
    //     var arrCities = [];
    //     var arrMunicipalitiesCode = ['11000000', '31000000', '12000000', '50000000'];
    //     var strMunicipalitiesCode = arrMunicipalitiesCode.toString();
    //     var indexGroup = ['abcde', 'fghij', 'klmno', 'pqrst', 'uvwxy', 'z'];
    //     // 获取所有 "市" 一级的城市名称 arrCities
    //     for(var i=0; i<iLen; i++) {
    //       // console.log(data[i].children);
    //       if(strMunicipalitiesCode.indexOf(data[i].CODE) > -1) {
    //         delete data[i]['children'];
    //         arrCities = arrCities.concat(data[i]);
    //       } else {
    //         arrCities =  arrCities.concat(data[i].children);
    //       }
    //     }
    //     // 按照拼音对其排序
    //     var arr = $filter('orderBy')(arrCities, 'SPELL');
    //     console.log(arr)
    //     $scope.regionMap = arrCities;

    //     $http.post('components', {data: arr})
    //       .success(function(data, status, headers, config) {
    //         console.log(data);
    //       })
    //       .error(function(data, status, headers, config) {
    //         console.log('post error');
    //       })
    //   })
    //   .error(function(data, status) {
    //     console.log('Load region-map.js wrong...');
    //   })
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

        $http.get('data/bz/region-map.js')
          .success(function(data, status) {
            data = scope.$eval(data);

            var handler = $interval(function() {
              if(!angular.equals(ctrl.$modelValue, NaN)) {
                $interval.cancel(handler);
                elem.val(data[ctrl.$viewValue][0]);
              }
            }, 100);
          })
          .error(function(data, status) {
            console.log('Load region-map.js data wrong...');
          })

        // var handler = $interval(function() {
        //   if(!angular.equals(ctrl.$modelValue, NaN)) {
        //     $interval.cancel(handler);

        //     $http.get('data/bz/region-map.js')
        //       .success(function(data, status) {
        //         data = scope.$eval(data);
        //         elem.val(data[ctrl.$viewValue][0]);
        //       })
        //       .error(function(data, status) {
        //         console.log('Load region.js data wrong...');
        //       })
        //   }
        // }, 10);

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