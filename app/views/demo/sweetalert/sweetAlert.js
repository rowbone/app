'use strict';

app.controller('SweetAlertCtrl', ['$scope', 'SweetAlert', 'OperationService', 
  function($scope, SweetAlert, OperationService) {

    // 返回
    $scope.goBack = function() {
      OperationService.goBack();
    };

    var successFunc = function(data) {
      console.log('success....');
      console.log(data);
    };

    var errorFunc = function(data) {
      console.log('error....');
      console.log(data);
    };

    var cancelFunc = function() {
      console.log('This is the cancel callback function...');
    };

    $scope.alertHtml = function() {
      var callbackFunc = function(data) {
        // console.log('This is the alertHtml callback function... -->', msg);

        console.log('alertHtml callbackFunc-->', data);
      };

      var params = {
        callback: callbackFunc,
        yesUrl: '/home',
        noUrl: '/home',
        confirmTitle: '这里是操作提示！'
      };
      OperationService.alertHtml(params);
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
        errorFunc: errorFunc,
        cancelFunc: cancelFunc
      });
    };

    $scope.interAction2 = function() {
      OperationService.interAction({
        'confirmTitle': '',
        'successTitle': '',
        'actionUrl': '/home',
        'isSuccessBack': false,
        successFunc: successFunc,
        errorFunc: errorFunc
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
        errorFunc: errorFunc
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
        errorFunc: errorFunc,
        confirmBtnText: '是',
        cancelBtnText: '否'
      });
    };

    $scope.interAction4 = function() {
      OperationService.interAction({
        'actionUrl': '/home',
        'isSuccessBack': false,
        'redirectState': 'app.home.contactlist2',
        successFunc: successFunc,
        errorFunc: errorFunc
      });
    };

    $scope.interAction5 = function() {
      OperationService.interAction({
        'actionUrl': '/home',
        'isSuccessBack': false,
        successFunc: successFunc,
        errorFunc: errorFunc
      });
    };

    $scope.alertAction = function() {
      // OperationService.alertAction('这里是提示信息');
      OperationService.alertAction({
        alertMsg: '这里是提示信息',
        type: 'info',
        successFunc: successFunc
      });
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
  confirmTitle: '',             // 调用后台接口前的提示信息
  confirmText: '',
  successTitle: '',             // 操作成功时的提示信息
  successText: '',
  errorTitle: '',               // 操作失败时的提示信息
  errorText: '', 
  actionUrl: '',              // 操作对应的后台接口
  data: {},                   // 提交到后台的数据
  isSuccessBack: true,        // 操作成功是否返回
  redirectState: 'app.home'   // 操作成功的重定向地址(state跳转，isSuccessBack为false时起作用)
  successFunc: func,          // 操作成功的回调方法
  errorFunc: func              // 操作失败的回调方法
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
        errorFunc: null,
        confirmBtnText: '确认',
        cancelBtnText: '取消'
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
      // 再次确认提示
      if(angular.isUndefined(params.confirmTitle)) {
        options.isShowConfirm = true;
      } else if(params.confirmTitle == '') {
        options.isShowConfirm = false;
      } else {
        options.isShowConfirm = true;
        options.confirmTitle = params.confirmTitle;
      }
      // 操作成功提示
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
      // 后台接口以及数据
      options.actionUrl = params.actionUrl || options.actionUrl;
      options.paramsData = params.data || options.paramsData;
      // 操作成功返回/重定向
      if(angular.isDefined(params.isSuccessBack) && params.isSuccessBack == false) {
        options.isSuccessBack = false;
        options.redirectState = params.redirectState || options.redirectState;
      } else {
        options.isSuccessBack = true;
      }
      // 操作成功/失败/取消回调方法
      if(angular.isDefined(params.successFunc) && angular.isFunction(params.successFunc)) {
        options.successFunc = params.successFunc;
      }
      if(angular.isDefined(params.errorFunc) && angular.isFunction(params.errorFunc)) {
        options.errorFunc = params.errorFunc;
      }
      if(angular.isDefined(params.cancelFunc) && angular.isFunction(params.cancelFunc)) {
        options.cancelFunc = params.cancelFunc;
      }
      // 提示按钮文字
      if(angular.isDefined(params.confirmBtnText) && params.confirmBtnText != '') {
        options.confirmBtnText = params.confirmBtnText;
      }
      if(angular.isDefined(params.cancelBtnText) && params.cancelBtnText != '') {
        options.cancelBtnText = params.cancelBtnText;
      }

      return true;
    };
    // 调用后台的接口
    var interFunc = function() {
      DataService.postData(options.actionUrl, options.paramsData)
        .then(function(data) {
          if(data.success) {
            if(options.isShowSuccess) {
              swalUserParams = {
                title: options.successTitle,
                text: options.successText,
                type: 'success',
                timer: userTimer
              };
              SweetAlert.swal(angular.extend({}, swalParams, swalUserParams));
            } else {
              // 
            }
            if(angular.isFunction(options.successFunc)) {
              (options.successFunc)(data);
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

            if(angular.isFunction(options.errorFunc)) {
              (options.errorFunc)(data);
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

          if(angular.isFunction(options.errorFunc)) {
            (options.errorFunc)(msg);
          }
        });
    };

    // 与后台接口的操作方法
    this.interAction = function(params) {
      var rtnVal = null;
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
          'closeOnConfirm': options.isShowSuccess ? false : true,
          'confirmButtonText': options.confirmBtnText,
          'cancelButtonText': options.cancelBtnText
        };
        SweetAlert.swal(angular.extend({}, swalParams, swalUserParams),
          function(isConfirm) {
            if (isConfirm) {
              interFunc();
            } else {
              // 
              if(angular.isFunction(options.cancelFunc)) {
                (options.cancelFunc)();
              }
            }
          }
        );
      } else {
        // 直接调用后台接口
        interFunc();
      }
    };

    var func = function() {
      console.log('This is hasDoneFunction test');
    };

    // 弹框中有 html 代码
    this.alertHtml = function(params) {
console.log('in alertHtml-->', params);
      // var alertText = '<span class="text-md font-bold">更新所有重复日志?</span><label class="i-checks m-l-sm"><input type="radio" tabIndex="3" name="isConfirm" value="yes" checked="false" /><i></i>是</label><label class="i-checks m-l-sm"><input type="radio" tabIndex="3" name="isConfirm" value="no" checked="false" /><i></i>否</label>';
      var alertTextPrefix = '<span class="text-md font-bold">';
      var alertTextAfter = '</span><label class="i-checks m-l-sm"><input type="radio" tabIndex="3" name="isConfirm" value="yes" checked="false" /><i></i>是</label><label class="i-checks m-l-sm"><input type="radio" tabIndex="3" name="isConfirm" value="no" checked="false" /><i></i>否</label>';
      var alertText = params.confirmText || '更新所有重复日志?';
      alertText = alertTextPrefix + alertText + alertTextAfter;

      swalUserParams = {
        title: params.confirmTitle || '操作确认',
        text: alertText,
        html: true,
        showCancelButton: true
        // ,
        // allowOutsideClick: true,
        // hasDoneFunction: func,
      };

      SweetAlert.swal(angular.extend({}, swalParams, swalUserParams),
        function(isConfirm) {
          if(isConfirm === 'yes') {
            if(params.yesUrl) {
              DataService.postData(params.yesUrl)
                .then(function(data) {
                  console.log('yes...');
                  console.log(data);
          
                  if(params.callback && angular.isFunction(params.callback)) {
                    (params.callback)(data);
                  }
                }, function(msg) {
                  console.log(msg);
                });
            }
          } else if(isConfirm === 'no') {
            if(params.noUrl) {
              DataService.postData(params.noUrl)
                .then(function(data) {
                  console.log('no')
                  console.log(data);

                  if(angular.isDefined(params.successTitle) && params.successTitle === '') {
                    // 
                  } else {
                    swalUserParams = {
                      type: 'success',
                      title: params.successTitle || '操作成功',
                      text: params.successText || '',
                      timer: timer
                    }

                    SweetAlert.swal(angular.extend({}, swalParams, swalUserParams));
                  }
        
                  // if(params.callback && angular.isFunction(params.callback)) {
                  //   (params.callback)(data);
                  // }
                }, function(msg) {
                  console.log(msg);
                    swalUserParams = {
                      type: 'error',
                      title: params.errorTitle || '操作失败',
                      text: params.errorTitle || '',
                      timer: timer
                    }

                    SweetAlert.swal(angular.extend({}, swalParams, swalUserParams));
                });
            }
          } else if(isConfirm === false) {
            console.log('cancel...');
          }
        });
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
      SweetAlert.swal(angular.extend({}, swalParams, swalUserParams), 
        function(isConfirm) {
          console.log('abc-->', isConfirm);
          (params.successFunc)();
        }
      );
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
