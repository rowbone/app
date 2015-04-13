app.controller('AreaTreeCtrl', ['$scope', '$timeout', '$http', '$modal', 
  function($scope, $timeout, $http, $modal) {
    var tree = $scope.my_tree = {};

    $scope.my_tree_handler = function(branch) {
      console.log('selected==' + branch.label);
    }

    $scope.showArea = function() {
      // return $scope.my_data = 
      $http.get('data/bz/area.json')
        .success(function(data, status) {
          console.log(data)
          $scope.my_data = data;
        })
        .error(function(data, status) {
          console.log('error...........')
        });
    };

    // 省市弹出层
    $scope.showAreaModal = function() {
      // 
      var modalInstance = $modal.open({
        templateUrl: 'views/demo/conow-area/areaModal.html',
        controller: 'AreaModalCtrl',
        backdrop: true,
        resolve: {
          tree_params: function() {
            return $scope.my_data;
          }
        }
      });

      modalInstance.result.then(function(rtnVal) {
        console.log(rtnVal);
      }, function(rtnVal) {
        console.log(rtnVal)
      });
    };

    return $scope.try_adding_a_branch = function() {
      var b;
      b = tree.get_selected_branch();
      return tree.add_branch(b, {
        label: 'New Branch',
        data: {
          something: 42,
          "else": 43
        }
      });
    };
  }
]);

app.controller('AreaModalCtrl', ['$scope', '$http', '$modalInstance', 'tree_params', '$timeout', 
  function($scope, $http, $modalInstance, tree_params, $timeout) {
  // 
  $scope.my_data = [];

  $scope.options = {
    doing_async: true
  };

  $timeout(function() {
    $http.get('data/bz/area.json')
      .success(function(data, status) {
        console.log(data)
        $scope.my_data = data;

        $scope.options.doing_async = false;
      })
      .error(function(data, status) {
        console.log('error...........')
        $scope.my_data = 'load data wrong.'
        $scope.options.doing_async = false;
      });
  }, 1000);

  $scope.confirm = function() {
    console.log('1111111111');
    $modalInstance.close($scope.selected);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel.........')
  };

  $scope.my_tree_handler = function(branch) {
    $scope.selected = branch.label;
  };

}])