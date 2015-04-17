'use strict';

app.controller('AreaSelCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.entity = {};

    $http.get('data/bz/region.json')
      .success(function(data, status) {
        if(data.obj) {
          $scope.treeDataShow = data.obj;
        } else {
          $scope.treeDataShow = data;
        }
      })
      .error(function(data, status) {
        console.log('load treeData wrong....');
      });

  }
]); 


app.directive('conowArea', ['$modal', function($modal) {
  return {
    restrict: 'A',
    // templateUrl: 'views/components/conow-area/tpls/area_tpl.html',
    link: function(scope, elem, attrs) {
      console.log('conowAreaTree linking...')

      elem.bind('click', function(e) {
        e.preventDefault();

        var modalInstance = $modal.open({
          templateUrl: 'views/components/conow-area/tpls/area-tpl.html',
          controller: 'AreaTreeCtrl',
          resolve: {
            params: function() {
              var objParams = {
                treeDataShow: scope.$eval(attrs.treeDataShow)
              };

              return objParams;
            }
          }
        });

        modalInstance.result.then(function(rtnVal) {
          console.log(rtnVal)
          scope.entity.area2 = rtnVal.label;
        }, function(rtnVal) {
          console.log(rtnVal);
        });
      });
    }
  }
}]);

app.controller('AreaTreeCtrl', ['$scope', '$timeout', '$http', '$modalInstance', 'params', 
  function($scope, $timeout, $http, $modalInstance, params) {
    var tree = $scope.my_tree = {};

    var selectedData;

    $scope.treeDataShow = params.treeDataShow;

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