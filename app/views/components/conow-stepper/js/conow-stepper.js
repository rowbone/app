'use strict';

app.controller('stepperDemoCtrl', ['$scope', 'conowModals', 
  function($scope, conowModals) {
    var vm = $scope.vm = {
      defaultValue: 5,
      decimals: 1,
      step: 0.2,
      min: 0,
      max: 25
    };

    $scope.openModal = function(e) {
      e.preventDefault();

      var modalInstance = conowModals.open({
        size: 'full',
        templateUrl: 'views/components/conow-stepper/stepper-modal-demo-tpl.html',
        title: '选择',
        controller: 'stepperModalCtrl', 
        resolve: {
          modalParams: function() {
            return {
              vm: vm
            }
          }
        }
      });

      modalInstance.result.then(function(data) {
        console.log(data);
      }, function(msg) {
        console.info('msg-->', msg);
      });
    };
    
  }
]);

app.controller('stepperModalCtrl', ['$scope', 'modalParams', '$conowModalInstance', 
  function($scope, modalParams, $conowModalInstance) {

    var vm = $scope.vm = modalParams.vm;
  }
]);

// conow-stepper directive
app.directive('conowStepper',['$http', 
  function($http) {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            ngModel: '=',
            step: '=',
            decimals: '=',
            min: '=',
            max: '='
        },
        templateUrl: 'views/components/conow-stepper/tpls/conow-stepper.html',
        controller: 'stepperCtrl',
        link: function(scope,element,attrs) {
          //
        }
    };
}]);

// direcitve controller
app.controller('stepperCtrl',['$scope',
  function($scope) {
    // default options
    var options = $scope.options = {
      step: 1,
      decimals: 0,
      min: null,
      max: null
    }

    var vm = $scope.vm = {};

    var init = function() {
      var step = parseFloat($scope.step),
        decimals = parseFloat($scope.decimals),
        min = parseFloat($scope.min),
        max = parseFloat($scope.max);

      options.step = step ? step : options.step;
      options.decimals = (decimals >= 0) ? decimals : options.decimals;
      options.min = (min || min == 0) ? min : null;
      options.max = (max || max == 0) ? max : null;
    }
    // options init
    init();

    vm.inputVal = parseFloat($scope.ngModel).toFixed(options.decimals);

    // number数加
    $scope.addNum = function() {
      var inputVal = parseFloat(vm.inputVal);

      if(!inputVal) {
        inputVal = 0;
      }

      inputVal += options.step;

      if(options.max && (inputVal > options.max)) {
        inputVal = options.max;
      } else if(options.max === 0 && (inputVal > options.max)) {
        inputVal = 0;
      }

      vm.inputVal = inputVal.toFixed(options.decimals);
    };

    // number数减
    $scope.minusNum = function() {
      var inputVal = parseFloat(vm.inputVal);

      if(!inputVal) {
        inputVal = 0;
      }

      inputVal -= options.step;

      if(options.min && (inputVal < options.min)) {
        inputVal = options.min;
      } else if(options.min === 0 && (inputVal < options.min)) {
        inputVal = 0;
      }

      vm.inputVal = inputVal.toFixed(options.decimals);
    };

    $scope.numberBlur = function(e) {
      e.preventDefault();

      var inputVal = parseFloat(vm.inputVal);

      if(!inputVal) {
        inputVal = 0;
      }

      if(options.max && (inputVal > options.max)) {
        inputVal = options.max;
      } else if(options.max === 0 && (inputVal > options.max)) {
        inputVal = 0;
      }

      if(options.min && (inputVal < options.min)) {
        inputVal = options.min;
      } else if(options.min === 0 && (inputVal < options.min)) {
        inputVal = 0;
      }

      vm.inputVal = inputVal.toFixed(options.decimals);
      // 
    };

    $scope.numberKeydown = function(e) {
      // todo:not allowed to input other charactor except numbers
    };

    // $watch to make $parent ng-model effect
    $scope.$watch('vm.inputVal', function(newVal, oldVal) {
      $scope.ngModel = newVal;
    });
  		 	
  }
]);
