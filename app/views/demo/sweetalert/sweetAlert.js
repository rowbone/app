'use strict';

app.controller('SweetAlertCtrl', ['$scope', 'SweetAlert', 'OperationService',
  function($scope, SweetAlert, OperationService) {

    $scope.interAction = function() {
      $scope.data = OperationService.interAction({
        'confirmMsg': '是否确认?',
        'successMsg': '读取数据成功',
        'errorMsg': '读取数据出错!',
        // 'actionUrl': 'views/demo/sweetalert/data/get-data.json',
        'actionUrl': '/home',
        'isSuccessBack': false,
        // 'redirectState': 'app.home.contactlist2'
      });

      console.log($scope.data);
    };

    $scope.interAction2 = function() {
      OperationService.interAction({
        // 'successMsg': '读取数据成功',
        'errorMsg': '读取数据出错!',
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
        // 'successMsg': '读取数据成功',
        'errorMsg': '读取数据出错!',
        'actionUrl': actionUrl,
        'isSuccessBack': false
          // ,
          // 'redirectState': 'app.home.contactlist2'
      });
    };

    $scope.interAction3 = function() {
      OperationService.interAction({
        'confirmMsg': '是否确认?',
        'successMsg': '读取数据成功',
        'errorMsg': '读取数据出错!',
        'actionUrl': '/home',
        'isSuccessBack': true,
        'redirectState': 'app.home.contactlist2'
      });
    };

    $scope.interAction4 = function() {
      OperationService.interAction({
        'confirmMsg': '是否确认?',
        'successMsg': '读取数据成功',
        'errorMsg': '读取数据出错!',
        'actionUrl': '/home',
        'isSuccessBack': false,
        'redirectState': 'app.home.contactlist2'
      });
    };

    $scope.interAction5 = function() {
      OperationService.interAction({
        'confirmMsg': '是否确认?',
        'successMsg': '读取数据成功',
        'errorMsg': '读取数据出错!',
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
  redirectState: 'app.home'   // 操作成功的重定向地址(state跳转，isSuccessBack为false或者不提供时)
 }:
*/
app.service('OperationService', ['$http', '$state', '$timeout', 'SweetAlert', 'DataService',
  function($http, $state, $timeout, SweetAlert, DataService) {
    var userTimer = 2000,
      swalParams = {
        // title: '操作提示',
        text: '',
        confirmButtonText: '确认',
        confirmButtonColor: '#19A9D5',
        cancelButtonColor: '',
        cancelButtonText: '取消'
      },
      swalUserParams = {};


    // 调用后台的接口
    var interFunc = function(params) {
      DataService.postData(params.actionUrl, {
          'name': 'abc'
        })
        .then(function(data) {
          console.info('interFunc-->', data);
          swalUserParams = {
            title: params.successMsg,
            type: 'success',
            timer: userTimer
          };
          if (angular.isDefined(params.successMsg)) {
            SweetAlert.swal(angular.extend({}, swalParams, swalUserParams));
          }
          if (angular.isUndefined(params.isSuccessBack) || params.isSuccessBack) {
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
            title: params.errorMsg || '操作失败！',
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
      if (angular.isDefined(params.confirmMsg)) {
        swalUserParams = {
          'title': params.confirmMsg,
          'type': 'warning',
          'showConfirmButton': true,
          'showCancelButton': true,
          'closeOnConfirm': false,
          'closeOnCancel': false
        };
        SweetAlert.swal(angular.extend({}, swalParams, swalUserParams),
          function(isConfirm) {
            if (isConfirm) {
              return interFunc(params);
            } else {
              swalUserParams = {
                title: '取消操作',
                type: 'info',
                timer: userTimer
              };
              SweetAlert.swal(angular.extend({}, swalParams, swalUserParams));
            }
          }
        );
      } else {
        // 直接调用后台接口
        return interFunc(params);
      }
    };

    // Alert
    this.alertAction = function(params) {
      if (angular.isObject(params)) {
        swalUserParams = {
          title: params.alertMsg
        }
      } else if (angular.isString(params)) {
        swalUserParams = {
          title: params
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
          console.info('inputVal-->', inputVal);
          if(inputVal === false) {
            return false;
          }
          if(inputVal === '') {
            swal.showInputError('请输入金额');
            return false;
          }

          return inputVal;
        }
      );

      return abc;
    };

  }
]);
