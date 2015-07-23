'use strict';

/*
  http://blog.51yip.com/jsjquery/1607.html
  http://www.cnblogs.com/dajianshi/category/625851.html
  http://www.cnblogs.com/dajianshi/p/4071598.html
  http://hudeyong926.iteye.com/blog/2073488
*/

app.controller('stepperDemoCtrl', ['$scope', 'conowModals', 
  function($scope, conowModals) {
    var vm = $scope.vm = {
      defaultValue: 5,
      decimals: 1,
      step: 0.2,
      min: 0,
      max: 25,
      unit1: '',
      unit2: '人',
      unit3: '分钟',
      unit4: '百万元'
    };

    $scope.changeVal = function(newVal) {
      vm.defaultValue = newVal;
    };

    $scope.jsonData = {'name': 'abc', 'age': 12};

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

    vm.unit = '万元';

    $scope.confirm = function(e) {
      e.preventDefault();

      $conowModalInstance.close();
    };

  }
]);

// conow-stepper directive
app.directive('conowStepper',['$timeout', 
  function($timeout) {
    return {
        restrict: 'AE',
        // replace: true,
        // require: '?^ngModel',
        scope: {
            ngModel: '=',
            step: '=',
            decimals: '=',
            min: '=',
            max: '=',
            unitName: '='
        },
        templateUrl: 'views/components/conow-stepper/tpls/conow-stepper.html',
        // controller: 'stepperCtrl',
        link: function(scope, elem, attrs) {
          
          // stepper 文字显示框
          var $stepperInput = elem.find('.stepper-input');

          // default options
          var options = scope.options = {
            step: 1,
            decimals: 0,
            min: null,
            max: null,
            unitName: ''
          }

          var vm = scope.vm = {};

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

            // data init
            vm.inputVal = generateVal(scope.ngModel);
          };

          // function init
          init();

          // number数加
          scope.addNum = function() {
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

            vm.inputVal = generateVal(inputVal);
          };

          // number数减
          scope.minusNum = function() {
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

            vm.inputVal = generateVal(inputVal);
          };

          scope.numberBlur = function(e) {
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

            vm.inputVal = generateVal(inputVal);
          };

          scope.numberKeydown = function(e) {
            // todo:not allowed to input other charactor except numbers
          };

          // $watch to make $parent ng-model effect
          // scope.$watch('vm.inputVal', function(newVal, oldVal) {
          //   console.log('vm.inputVal')
          //   scope.ngModel = newVal;
          // });

          // 外部通过 "设值" 的方式改变 ngModel 的值
          // scope.$watch(function() {
          //   return scope.ngModel;
          // }, function(newVal, oldVal) {
          //   if(options.doubleTrig) {
          //     return;
          //   }
          //   newVal = numberCheck(newVal);
          //   scope.ngModel = newVal;
          //   vm.inputVal = newVal;
          // }, true);

        }
    };
}]);

// // direcitve controller
// app.controller('stepperCtrl',['$scope',
//   function($scope) {
//     // default options
//     var options = $scope.options = {
//       step: 1,
//       decimals: 0,
//       min: null,
//       max: null,
//       unitName: ''
//     }

//     var vm = $scope.vm = {};

//     var generateValStr = function(inputVal) {
//       return parseFloat(inputVal).toFixed(options.decimals) + options.unitName;
//     };

//     var init = function() {
//       // options init
//       var step = parseFloat($scope.step),
//         decimals = parseFloat($scope.decimals),
//         min = parseFloat($scope.min),
//         max = parseFloat($scope.max);

//       options.step = step ? step : options.step;
//       options.decimals = (decimals >= 0) ? decimals : options.decimals;
//       options.min = (min || min == 0) ? min : null;
//       options.max = (max || max == 0) ? max : null;
//       options.unitName = $scope.unitName || options.unitName;

//       // data init
//       vm.inputVal = generateValStr($scope.ngModel);

//       console.log(vm.inputVal)
//     }
//     // options init
//     init();

//     // number数加
//     $scope.addNum = function() {
//       var inputVal = parseFloat(vm.inputVal);

//       if(!inputVal) {
//         inputVal = 0;
//       }

//       inputVal += options.step;

//       if(options.max && (inputVal > options.max)) {
//         inputVal = options.max;
//       } else if(options.max === 0 && (inputVal > options.max)) {
//         inputVal = 0;
//       }

//       vm.inputVal = generateValStr(inputVal);
//     };

//     // number数减
//     $scope.minusNum = function() {
//       var inputVal = parseFloat(vm.inputVal);

//       if(!inputVal) {
//         inputVal = 0;
//       }

//       inputVal -= options.step;

//       if(options.min && (inputVal < options.min)) {
//         inputVal = options.min;
//       } else if(options.min === 0 && (inputVal < options.min)) {
//         inputVal = 0;
//       }

//       vm.inputVal = generateValStr(inputVal);
//     };

//     $scope.numberBlur = function(e) {
//       e.preventDefault();

//       var inputVal = parseFloat(vm.inputVal);

//       if(!inputVal) {
//         inputVal = 0;
//       }

//       if(options.max && (inputVal > options.max)) {
//         inputVal = options.max;
//       } else if(options.max === 0 && (inputVal > options.max)) {
//         inputVal = 0;
//       }

//       if(options.min && (inputVal < options.min)) {
//         inputVal = options.min;
//       } else if(options.min === 0 && (inputVal < options.min)) {
//         inputVal = 0;
//       }

//       vm.inputVal = generateValStr(inputVal);
//       // 
//     };

//     $scope.numberKeydown = function(e) {
//       // todo:not allowed to input other charactor except numbers
//     };

//     // $watch to make $parent ng-model effect
//     $scope.$watch('vm.inputVal', function(newVal, oldVal) {
//       $scope.ngModel = newVal;
//     });
  		 	
//   }
// ]);
