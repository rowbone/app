'use strict';

app.controller('stepperDemoCtrl', ['$scope', 
  function($scope) {
    var vm = $scope.vm = {
      defaultValue: 0,
      decimals: 1,
      step: 0.2,
      min: 2,
      max: 25
    };
    
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
      options.min = min ? min : null;
      options.max = max ? max : null;
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
      }

      if(options.min && (inputVal < options.min)) {
        inputVal = options.min;
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
