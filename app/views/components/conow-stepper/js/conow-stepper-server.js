'use strict';

// conow-stepper directive
app.directive('conowStepper', ['$http',
  function($http) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        ngModel: '=',
        step: '=',
        decimals: '=',
        min: '=',
        max: '=',
        unitName: '=',
        iconPrev: '@iconPrev',
        iconNext: '@iconNext',
        theme: '@theme'
      },
      templateUrl: 'js/directives/conow-stepper/conow-stepper-tpl.html',
      link: function(scope, elem, attrs) {
        // stepper 文字显示框
        var $stepperInput = elem.find('.stepper-input');

        // default options
        var options = scope.options = {
            step: 1,
            decimals: 0,
            min: null,
            max: null,
            unitName: '',
            iconPrev: 'ion-minus',
            iconNext: 'ion-plus'
          },
          vm = scope.vm = {};

        // 按照规则格式化数值
        var generateVal = function(inputVal) {
          return parseFloat(inputVal).toFixed(options.decimals);
        };

        // 格式化数值并加上单位[已废弃]
        var generateValStr = function(inputVal) {
          return parseFloat(inputVal).toFixed(options.decimals) + options.unitName;
        };

        // 数据大小判断，格式化
        var numberCheck = function(inputVal) {

          inputVal = parseFloat(inputVal);

          if (!inputVal) {
            inputVal = 0;
          }

          if (options.max && (inputVal > options.max)) {
            inputVal = options.max;
          } else if (options.max === 0 && (inputVal > options.max)) {
            inputVal = 0;
          }

          if (options.min && (inputVal < options.min)) {
            inputVal = options.min;
          } else if (options.min === 0 && (inputVal < options.min)) {
            inputVal = 0;
          }

          return generateVal(inputVal);
        };

        var init = function() {
          // options init
          var step = parseFloat(scope.step),
            decimals = parseFloat(scope.decimals),
            min = parseFloat(scope.min),
            max = parseFloat(scope.max);

          options.step = step ? step : options.step;
          options.decimals = (decimals >= 0) ? decimals : options.decimals;
          options.min = (min || min == 0) ? min : null;
          options.max = (max || max == 0) ? max : null;
          options.unitName = scope.unitName || options.unitName;
          if (angular.isDefined(scope.theme) && angular.equals(scope.theme, 'page')) {
            options.iconPrev = 'ci-previouspage';
            options.iconNext = 'ci-nextpage';
          }
          if (angular.isDefined(scope.iconPrev)) {
            options.iconPrev = scope.iconPrev;
          }
          if (angular.isDefined(scope.iconNext)) {
            options.iconNext = scope.iconNext;
          }

          // data init
          vm.inputVal = generateVal(scope.ngModel);
        };

        // function init
        init();

        // number数加
        scope.addNum = function(e) {
          var inputVal = parseFloat(vm.inputVal);

          if (!inputVal) {
            inputVal = 0;
          }

          inputVal += options.step;

          if (options.max && (inputVal > options.max)) {
            inputVal = options.max;
          } else if (options.max === 0 && (inputVal > options.max)) {
            inputVal = 0;
          }

          inputVal = generateVal(inputVal);

          vm.inputVal = inputVal;
          scope.ngModel = inputVal;
          e.stopPropagation();
        };

        // number数减
        scope.minusNum = function(e) {
          var inputVal = parseFloat(vm.inputVal);

          if (!inputVal) {
            inputVal = 0;
          }

          inputVal -= options.step;

          if (options.min && (inputVal < options.min)) {
            inputVal = options.min;
          } else if (options.min === 0 && (inputVal < options.min)) {
            inputVal = 0;
          }

          inputVal = generateVal(inputVal);

          vm.inputVal = inputVal;
          scope.ngModel = inputVal;
          e.stopPropagation();
        };

        scope.numberBlur = function(e) {
          e.preventDefault();

          var inputVal = parseFloat(vm.inputVal);

          if (!inputVal) {
            inputVal = 0;
          }

          if (options.max && (inputVal > options.max)) {
            inputVal = options.max;
          } else if (options.max === 0 && (inputVal > options.max)) {
            inputVal = 0;
          }

          if (options.min && (inputVal < options.min)) {
            inputVal = options.min;
          } else if (options.min === 0 && (inputVal < options.min)) {
            inputVal = 0;
          }

          inputVal = generateVal(inputVal);

          vm.inputVal = inputVal;
          scope.ngModel = inputVal;
        };

        scope.numberKeydown = function(e) {
          // todo:not allowed to input other charactor except numbers
        };

        // $watch to make $parent ng-model effect
        //            scope.$watch('vm.inputVal', function(newVal, oldVal) {
        //              scope.ngModel = newVal;
        //            });

        // 外部通过 "设值" 的方式改变 ngModel 的值
        scope.$watch(function() {
          return scope.ngModel;
        }, function(newVal, oldVal) {
          newVal = numberCheck(newVal);

          vm.inputVal = newVal;
          scope.ngModel = newVal;
        }, true);

        // 动态修改最大值和最小值
        scope.$watch('max', function(newVal, oldVal) {
          options.max = newVal;
        });

        scope.$watch('min', function(newVal, oldVal) {
          options.min = newVal;
        });

      }
    };
  }
]);

//// conow-sign directive
//app.directive('conowsign',['$http', function($http) {
//    return {
//        restrict: 'AE',
//        replace: true,
//        scope:{
//          numeric:'@',
//          number:'=' ,
//          addend:'='
//        },
//        templateUrl:'js/directives/conow-signs/sign.html',
//        controller:'signCtrl',
//        /* compile: function(element, attributes) {
//          return function(scope, element, attrs,ctrl,transcludeFn) {
//
//          };
//        }*/
//        link:function(scope,element,attrs){
//        }
//    };
//}]);
//
//// direcitve controller
//app.controller('signCtrl',['$scope',
//          function($scope){ 
//  $scope.numeric1 = 'decimals:'+$scope.numeric;
//  //number数加一天
//  $scope.addnum = function(){
//    if(!$scope.number){
//      $scope.number=0;
//    }
//    $scope.number = parseFloat($scope.number)+$scope.addend;
//    $scope.number = $scope.number.toFixed(parseInt($scope.numeric));
//  };
//  //number数减一天
//      $scope.minusnum = function(){
//        if($scope.number==null){
//          $scope.number=0;
//        }
//        if($scope.number>=1){
//        $scope.number =parseFloat($scope.number-$scope.addend);
//        $scope.number = $scope.number.toFixed($scope.numeric);
//        }
//      };
//        
//  }]);