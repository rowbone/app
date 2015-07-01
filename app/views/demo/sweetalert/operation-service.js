/*
  * 页面操作服务
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
	      cancelBtnText: '取消',
	      confirmFunc: null,
	      cancelFunc: null
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

    // interAction 初始化方法
    var interInit = function(params) {
      // 重置 options
      options = angular.copy(optionsDefault);
      
      if (angular.isUndefined(params)) {
        console.error('请提供操作对应的参数');
        return false;
      }
      // 再次确认提示
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
      // 操作成功/失败回调方法
      if(angular.isDefined(params.successFunc) && angular.isFunction(params.successFunc)) {
        options.successFunc = params.successFunc;
      }
      if(angular.isDefined(params.errorFunc) && angular.isFunction(params.errorFunc)) {
        options.errorFunc = params.errorFunc;
      }
      // 提示按钮文字
      if(angular.isDefined(params.confirmBtnText) && params.confirmBtnText != '') {
        options.confirmBtnText = params.confirmBtnText;
      }
      if(angular.isDefined(params.cancelBtnText) && params.cancelBtnText != '') {
        options.cancelBtnText = params.cancelBtnText;
      }
      // 确认按钮点击后，操作后台接口前调用方法
      if(angular.isDefined(params.confirmFunc) && angular.isFunction(params.confirmFunc)) {
  	    options.confirmFunc = params.confirmFunc;
  	  }
      // 取消按钮点击操作方法
      if(angular.isDefined(params.cancelFunc) && angular.isFunction(params.cancelFunc)) {
        options.cancelFunc = params.cancelFunc;
      }

      return true;
    };

    // confirmAction 初始化方法
    var confirmInit = function(params) {};
    
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
              text: data.message || options.errorText,
              type: 'error',
              timer: userTimer
            };
            SweetAlert.swal(angular.extend({}, swalParams, swalUserParams));

            if(angular.isFunction(options.errorFunc)) {
              (options.errorFunc)(data);
            }
          }
        }, function(msg) {
          swalUserParams = {
            title: options.errorTitle,
            text: msg || options.errorText,
            type: 'error',
            timer: userTimer
          };
          SweetAlert.swal(angular.extend({}, swalParams, swalUserParams));

          if(angular.isFunction(options.errorFunc)) {
            (options.errorFunc)(msg);
          }
        });
    };

    // 与后台接口的操作方法
    this.interAction = function(params) {
      // 
      if(!interInit(params)) {
        return false;
      }

      if(options.isShowConfirm) {
        swalUserParams = {
          'title': options.confirmTitle,
          'text': options.confirmText,
          'type': 'warning',
          'showConfirmButton': true,
          'showCancelButton': true,
//          'closeOnConfirm': false
          'closeOnConfirm': options.isShowSuccess ? false : true,
          'confirmButtonText': options.confirmBtnText,
          'cancelButtonText': options.cancelBtnText
        };
        SweetAlert.swal(angular.extend({}, swalParams, swalUserParams),
          function(isConfirm) {
            if (isConfirm) {
              if(angular.isFunction(options.confirmFunc)) {
                (options.confirmFunc)();
              }
              interFunc();
            } else {console.log(options);console.log(options.cancelFunc)
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

    // 弹框中有 html 代码
    this.alertHtml = function(params) {
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
                    if(angular.isDefined(params.successTitle) && params.successTitle === '') {
                      // 
                    } else {
                      swalUserParams = {
                        type: 'success',
                        title: params.successTitle || '操作成功',
                        text: params.successText || '',
                        timer: userTimer
                      }

                      SweetAlert.swal(angular.extend({}, swalParams, swalUserParams));
                    }
          
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

                  if(angular.isDefined(params.successTitle) && params.successTitle === '') {
                    // 
                  } else {
                    swalUserParams = {
                      type: 'success',
                      title: params.successTitle || '操作成功',
                      text: params.successText || '',
                      timer: userTimer
                    }

                    SweetAlert.swal(angular.extend({}, swalParams, swalUserParams));
                  }
        
                   if(params.callback && angular.isFunction(params.callback)) {
                     (params.callback)(data);
                   }
                }, function(msg) {
                  console.log(msg);
                    swalUserParams = {
                      type: 'error',
                      title: params.errorTitle || '操作失败',
                      text: params.errorTitle || '',
                      timer: userTimer
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
      SweetAlert.swal(angular.extend({}, swalParams, swalUserParams));
    };
    
    // confirm
    this.confirmAction = function(params) {
      if (angular.isObject(params)) {
            swalUserParams = {
              title: params.alertMsg,
              type: params.type || 'warning',
              confirmButtonText: params.confirmButtonText || '确定',
              cancelBtnText: params.cancelBtnText || '取消',
              closeOnConfirm: true
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