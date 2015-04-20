'use strict';

app.controller('AreaSelCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.entity = {};
  }
]); 


app.directive('conowArea', ['$modal', function($modal) {
  return {
    restrict: 'A',
    // templateUrl: 'views/components/conow-area/tpls/area_tpl.html',
    link: function(scope, elem, attrs) {

      elem.bind('click', function(e) {
        e.preventDefault();

        var modalInstance = $modal.open({
          templateUrl: 'views/components/conow-area/tpls/area-tpl.html',
          controller: 'AreaTreeCtrl'
        });

        modalInstance.result.then(function(rtnVal) {
          if(rtnVal && rtnVal.label) {
            scope.entity.area2 = rtnVal.label;
          }
        }, function(rtnVal) {
          console.log(rtnVal);
        });
      });
    }
  }
}]);

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