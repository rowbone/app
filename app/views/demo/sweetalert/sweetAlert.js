'use strict';

app.controller('SweetAlertCtrl', ['$scope', 'SweetAlert', 'OperationService', 
  function($scope, SweetAlert, OperationService) {
    // 返回
    $scope.goBack = function() {
      OperationService.goBack();
    };

    var successFunc = function() {
      console.log('success....');
    };

    var failFunc = function() {
      console.log('fail....');
    };

    $scope.interAction = function() {

      OperationService.interAction({
        'confirmTitle': '是否确认',
        'confirmText': 'abc',
        'successTitle': '',
        'actionUrl': '/home',
        'data': { 'name': 'abc', 'age': 8 },
        'isSuccessBack': false,
        'redirectState': 'app.home.contactlist2',
        successFunc: successFunc,
        failFunc: failFunc
      });
    };

    $scope.interAction2 = function() {
      OperationService.interAction({
        'confirmTitle': '',
        'successTitle': '',
        'actionUrl': '/home',
        'isSuccessBack': false,
        successFunc: successFunc,
        failFunc: failFunc
          // ,
          // 'redirectState': 'app.home.contactlist2'
      });
    };

    $scope.interAction22 = function() {
      var random = parseInt(10 * Math.random());
      var actionUrl = '';

      if (random % 2) {
        actionUrl = '/home';
      } else {
        actionUrl = '/home/error';
      }

      OperationService.interAction({
        'actionUrl': actionUrl,
        'isSuccessBack': false,
        successFunc: successFunc,
        failFunc: failFunc
          // ,
          // 'redirectState': 'app.home.contactlist2'
      });
    };

    $scope.interAction3 = function() {
      OperationService.interAction({
        'actionUrl': '/home',
        'isSuccessBack': true,
        'redirectState': 'app.home.contactlist2',
        successFunc: successFunc,
        failFunc: failFunc
      });
    };

    $scope.interAction4 = function() {
      OperationService.interAction({
        'actionUrl': '/home',
        'isSuccessBack': false,
        'redirectState': 'app.home.contactlist2',
        successFunc: successFunc,
        failFunc: failFunc
      });
    };

    $scope.interAction5 = function() {
      OperationService.interAction({
        'actionUrl': '/home',
        'isSuccessBack': false,
        successFunc: successFunc,
        failFunc: failFunc
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
  confirmTitle: '',
  successMsg: '',             // 操作成功时的提示信息
  successTitle: '',
  errorMsg: '',               // 操作失败时的提示信息
  errorTitle: '', 
  actionUrl: '',              // 操作对应的后台接口
  isSuccessBack: true,        // 操作成功是否返回
  redirectState: 'app.home'   // 操作成功的重定向地址(state跳转，isSuccessBack为false时起作用)
 }:
*/

app.service('OperationService', ['$http', '$state', '$timeout', 'SweetAlert', 'DataService',
  function($http, $state, $timeout, SweetAlert, DataService) {
    var userTimer = 2000,
      options = {
        isShowConfirm: false,
        confirmTitle: '是否确认操作？',
        confirmText: '',
        isShowSuccess: false,
        successTitle: '操作成功！',
        successText: '',
        isShowError: true,
        errorTitle: '操作失败！',
        errorText: '',
        actionUrl: '',
        paramsData: {},
        isSuccessBack: true,
        redirectState: '',
        successFunc: null,
        failFunc: null
      },
      swalParams = {
        confirmButtonText: '确认',
        confirmButtonColor: '#19A9D5',
        cancelButtonColor: '#19A9D5',
        cancelButtonText: '取消',
        closeOnConfirm: true,
        closeOnCancel: true
      },
      swalUserParams = {},
      optionsDefault = angular.copy(options);

    // 初始化方法
    var init = function(params) {
      options = angular.copy(optionsDefault);

      if (angular.isUndefined(params)) {
        console.error('请提供操作对应的参数');
        return false;
      }
      if (angular.isUndefined(params.actionUrl)) {
        console.error('请提供操作对应的后台接口');
        return false;
      }
      if(angular.isUndefined(params.confirmTitle)) {
        options.isShowConfirm = true;
      } else if(params.confirmTitle == '') {
        options.isShowConfirm = false;
      } else {
        options.isShowConfirm = true;
        options.confirmTitle = params.confirmTitle;
      }
      if(angular.isUndefined(params.successTitle)) {
        options.isShowSuccess = true;
      } else if(params.successTitle == '') {
        options.isShowSuccess = false;
      } else {
        options.isShowSuccess = true;
        options.successTitle = params.successTitle;
      }
      if(angular.isDefined(params.errorTitle)) {
        options.errorTitle = params.errorTitle;
      }
      options.confirmText = params.confirmText || '';
      options.successText = params.successText || '',
      options.errorText = params.errorText || '';

      options.actionUrl = params.actionUrl || options.actionUrl;
      options.paramsData = params.data || options.paramsData;

      if(angular.isDefined(params.isSuccessBack) && params.isSuccessBack == false) {
        options.isSuccessBack = false;
        options.redirectState = params.redirectState || options.redirectState;
      } else {
        options.isSuccessBack = true;
      }

      if(angular.isDefined(params.successFunc) && angular.isFunction(params.successFunc)) {
        options.successFunc = params.successFunc;
      }
      if(angular.isDefined(params.failFunc) && angular.isFunction(params.failFunc)) {
        options.failFunc = params.failFunc;
      }

      return true;
    };
    // 调用后台的接口
    var interFunc = function() {
      DataService.postData(options.actionUrl, options.paramsData)
        .then(function(data) {
console.log('data-->', data);
          if(data.success) {
            if(options.isShowSuccess) {
              swalUserParams = {
                title: options.successTitle,
                text: options.successText,
                timer: userTimer
              };
              SweetAlert.swal(angular.extend({}, swalParams, swalUserParams));
            } else {
              // 
            }
            if(angular.isFunction(options.successFunc)) {
              (options.successFunc)();
            }
            if(options.isSuccessBack) {
              $timeout(function() {
                history.back();
              }, userTimer);
            } else {
              if(options.redirectState != '') {
                $timeout(function() {
                  $state.go(options.redirectState);
                }, userTimer);
              }
            }
          } else {            
            swalUserParams = {
              title: options.errorTitle,
              text: options.errorText,
              type: 'error',
              timer: userTimer
            }
            SweetAlert.swal(angular.extend({}, swalParams, swalUserParams));

            if(angular.isFunction(options.failFunc)) {
              (options.failFunc)();
            }
          }
        }, function(msg) {
          swalUserParams = {
            title: options.errorTitle,
            text: options.errorText,
            type: 'error',
            timer: userTimer
          }
          SweetAlert.swal(angular.extend({}, swalParams, swalUserParams));

          if(angular.isFunction(options.failFunc)) {
            (options.failFunc)();
          }
        });
    };

    // 与后台接口的操作方法
    this.interAction = function(params) {
      // 
      if(!init(params)) {
        return false;
      }

      if(options.isShowConfirm) {
        swalUserParams = {
          'title': options.confirmTitle,
          'text': options.confirmText,
          'type': 'warning',
          'showConfirmButton': true,
          'showCancelButton': true,
          // 'closeOnConfirm': false
          'closeOnConfirm': options.isShowSuccess ? false : true
        };
        SweetAlert.swal(angular.extend({}, swalParams, swalUserParams),
          function(isConfirm) {
console.info('isConfirm-->', isConfirm)
            if (isConfirm) {
              interFunc();
            } else {
              // 
            }
          }
        );
      } else {
        // 直接调用后台接口
        interFunc();
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
