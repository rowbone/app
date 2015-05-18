'use strict';

app.controller('SweetAlertCtrl', ['$scope', 'SweetAlert', 'OperationService', 
  function($scope, SweetAlert, OperationService) {

    $scope.goBack = function() {
      OperationService.goBack();
    };

    $scope.interAction = function() {

      $scope.data = OperationService.interAction({
        'showConfirm': true,
        // 'actionUrl': 'views/demo/sweetalert/data/get-data.json',
        'actionUrl': '/home',
        'data': { 'name': 'abc', 'age': 8 },
        'isSuccessBack': false,
        // 'redirectState': 'app.home.contactlist2'
      });
    };

    $scope.interAction2 = function() {
      OperationService.interAction({
        'showConfirm': false,
        'actionUrl': '/home',
        'isSuccessBack': false
          // ,
          // 'redirectState': 'app.home.contactlist2'
      });
    };

    $scope.interAction22 = function() {
      var random = parseInt(10 * Math.random());
      var actionUrl = '';

      if (random % 2) {
        actionUrl = '/home';
      }

      OperationService.interAction({
        'showConfirm': true,
        'actionUrl': actionUrl,
        'isSuccessBack': false
          // ,
          // 'redirectState': 'app.home.contactlist2'
      });
    };

    $scope.interAction3 = function() {
      OperationService.interAction({
        'actionUrl': '/home',
        'isSuccessBack': true,
        'redirectState': 'app.home.contactlist2'
      });
    };

    $scope.interAction4 = function() {
      OperationService.interAction({
        'actionUrl': '/home',
        'isSuccessBack': false,
        'redirectState': 'app.home.contactlist2'
      });
    };

    $scope.interAction5 = function() {
      OperationService.interAction({
        'actionUrl': '/home',
        'isSuccessBack': false
      });
    };

    $scope.alertAction = function() {
      OperationService.alertAction('这里是提示信息');
    };

    $scope.promptAction = function() {
      var str = OperationService.promptAction();
      console.log('str-->', str);
    };
  }
]);

/*
 页面操作服务
 params: {
  confirmMsg: '',             // 调用后台接口前的提示信息
  successMsg: '',             // 操作成功时的提示信息
  errorMsg: '',               // 操作失败时的提示信息
  actionUrl: '',              // 操作对应的后台接口
  isSuccessBack: true,        // 操作成功是否返回
  redirectState: 'app.home'   // 操作成功的重定向地址(state跳转，isSuccessBack为false时起作用)
 }:
*/

// app.factory('foo', function(){
//   var thisIsPrivate = 'private';

//   function getPrivate() {
//     return thisIsPrivate;
//   }

//   return {
//     variable: 'ThisIsPublice',
//     getPrivate: getPrivate
//   }
// });

// app
// .config(['$provide', 
//   function($provide) {
//     $provide.decorator('$log', function($delegate) {
//       angular.forEach(['log', 'debug', 'info', 'warn', 'error'], 
//         function(o) {
//           $delegate[o] = decoratorLogger($delegate[o]);
//         });

//       function decoratorLogger(originalFn) {
//         return function() {
//           var args = Array.prototype.slice(arguments);
//           args.unshift(new Data().toISPString());
//           orgiginalFn.apply(null, args);
//         }
//       };
//     })
//   }
// ])
// .config(function($provide) {
//   $provide.decorator('foo', function($delegate) {
// console.log('in decorator');
//     $delegate.greet = function() {
//       return 'Hello, I am a new function of "foo"';
//     };

//     return $delegate;
//   });
// });

app.service('OperationService', ['$http', '$state', '$timeout', 'SweetAlert', 'DataService',
  function($http, $state, $timeout, SweetAlert, DataService) {
    var userTimer = 2000,
      options = {
        confirmMsg: '是否确认操作？',
        successMsg: '操作成功！',
        errorMsg: '操作失败！'
      },
      swalParams = {
        text: '',
        confirmButtonText: '确认',
        confirmButtonColor: '#19A9D5',
        cancelButtonColor: '#19A9D5',
        cancelButtonText: '取消',
        closeOnConfirm: true,
        closeOnCancel: true
      },
      swalUserParams = {};


    // 调用后台的接口
    var interFunc = function(params) {
      DataService.postData(params.actionUrl, params.data)
        .then(function(data) {
          swalUserParams = {
            title: options.successMsg,
            type: 'success',
            timer: userTimer
          };
          // 不提供 showConfirm 参数，或者 showConfirm 不为 false 时，提示
          if(angular.isUndefined(params.showConfirm) || params.showConfirm != false) {
            SweetAlert.swal(angular.extend({}, swalParams, swalUserParams));
          }
          // 不提供 isSuccessBack 参数或者 isSuccessBack 不为 false时，操作成功返回
          if (angular.isUndefined(params.isSuccessBack) || params.isSuccessBack != false) {
            history.back();
          } else {
            if (angular.isDefined(params.redirectState)) {
              $timeout(function() {
                $state.go(params.redirectState);
              }, userTimer);
            } else {
              // stay
              return data;
            }
          }
        }, function(msg) {
          swalUserParams = {
            title: options.errorMsg,
            type: 'error',
            timer: userTimer
          }
          SweetAlert.swal(angular.extend({}, swalParams, swalUserParams));
        });
    };
    // 与后台接口的操作方法
    this.interAction = function(params) {
      if (angular.isUndefined(params)) {
        console.error('请提供操作对应的参数');
        return false;
      }
      if (angular.isUndefined(params.actionUrl)) {
        console.error('请提供操作对应的后台接口');
        return false;
      }
      // 不提供 showConfirm 参数，或者 showConfirm 不为 false 时，提示
      if(angular.isUndefined(params.showConfirm) || params.showConfirm != false) {
        swalUserParams = {
          'title': options.confirmMsg,
          'type': 'warning',
          'showConfirmButton': true,
          'showCancelButton': true,
          'closeOnConfirm': false
        };
        SweetAlert.swal(angular.extend({}, swalParams, swalUserParams),
          function(isConfirm) {
            if (isConfirm) {
              interFunc(params);
            } else {
              // swal.close();
              SweetAlert.close();
              // swalUserParams = {
              //   title: '取消操作',
              //   type: 'info',
              //   timer: userTimer
              // };
              // SweetAlert.swal(angular.extend({}, swalParams, swalUserParams));
            }
          }
        );
      } else {
        // 直接调用后台接口
        interFunc(params);
      }
    };

    // Alert
    this.alertAction = function(params) {
      if (angular.isObject(params)) {
        swalUserParams = {
          title: params.alertMsg,
          type: params.type
        };
      } else if (angular.isString(params)) {
        swalUserParams = {
          title: params,
          type: 'info'
        };
      } else {
        // 
      }
      SweetAlert.swal(angular.extend({}, swalParams, swalUserParams));
    };

    // Prompt
    this.promptAction = function(params) {
      swalUserParams = {
        title: '输入提示',
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        // animation: "pop",
        inputPlaceholder: "请输入金额"
      };
      var abc = SweetAlert.swal(angular.extend({}, swalParams, swalUserParams), 
        function(inputVal) {
          if(inputVal === false) {
            return false;
          }
          if(inputVal === '') {
            swal.showInputError('请输入金额');
            return false;
          }
          swal.close();

          return inputVal;
        }
      );

      return abc;
    };

    // 返回
    this.goBack = function() {
      swalUserParams = {
          title: "确定放弃？",
          text: "放弃后将回退到上一个页面！",
          type: "warning"
      };
      SweetAlert.swal(angular.extend({}, swalParams, swalUserParams), function() {
        history.back();
      });
    };

  }
]);
