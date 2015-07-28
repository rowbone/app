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
        console.log('alertHtml callbackFunc-->', data);
      };

      var params = {
        yesConfirmFunc: function() {console.log('yes..........')},
        noConfirmFunc: function() {console.log('no..........')},
        callback: callbackFunc,
        yesUrl: '/home',
        noUrl: '/error',
        confirmTitle: '这里是操作提示！',
        isSuccessBack: 'false',
        redirectState: 'app.components.stepper'
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

    $scope.staffId = '123';

    $scope.interAction4 = function() {
      OperationService.interAction({
        'actionUrl': '/home',
        'isSuccessBack': false,
        'redirectState': 'app.components.countrySel',
        'redirectParams': {'staffId': $scope.staffId },
        successFunc: successFunc,
        errorFunc: errorFunc,
        // successTitle: '',
      });
    };
    
    // 操作成功自动重定向
    $scope.directRedirect = function() {
      OperationService.interAction({
        'actionUrl': '/home',
        'isSuccessBack': false,
        'redirectState': 'app.conowArea',
        'successTitle': ''
      });
    }
    
    // 点击确认操作后才进行重定向操作
    $scope.confirmBeforeRedirect = function() {
      OperationService.interAction({
        'actionUrl': '/home',
        'isSuccessBack': false,
        'redirectState': 'app.conowArea',
        'redirectParams': { 'staffId': $scope.staffId }
      });
    };
    
    // 重定向传参
    $scope.redirectWithParams = function() {
      OperationService.interAction({
        'actionUrl': '/home',
        'isSuccessBack': false,
        'redirectState': 'app.conowArea',
        'redirectParams': { 'staffId': $scope.staffId }
      });
    }

    var confirmFunc = function() {
      console.log('This is the confirm function');
    };

    var cancelFunc = function() {
      swal({
        title: '取消成功',
        type: 'warning',
        confirmButtonText: '确定',
        timer: 2000
      });
    };

    $scope.interAction5 = function() {
      OperationService.interAction({
        'actionUrl': '/home',
        'isSuccessBack': false,
        successFunc: successFunc,
        errorFunc: errorFunc,
        confirmFunc: confirmFunc,
        cancelFunc: cancelFunc
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

    $scope.timerNull = function() {
      OperationService.interAction({
        'actionUrl': '/home',
        'isSuccessBack': false,
        'timer': null,
        'successFunc': successFunc,
        'errorFunc': errorFunc
      });
    };

  }
]);
