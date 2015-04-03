/*global angular,alert,conowValidator*/
// (function () {
//     "use strict";
//     // var app = angular.module("demoApp", ["w5c.validator", "ui.bootstrap"]);
//     // window.app = app;

//     app.config(["conowValidatorProvider", function (conowValidatorProvider) {

//         // 全局配置
//         conowValidatorProvider.config({
//             blurTrig: false,
//             showError: true,
//             removeError: true

//         });

//         conowValidatorProvider.setRules({
//             email: {
//                 required: "输入的邮箱地址不能为空",
//                 email: "输入邮箱地址格式不正确"
//             },
//             username: {
//                 required: "输入的用户名不能为空",
//                 pattern: "用户名必须输入字母、数字、下划线,以字母开头",
//                 conowuniquecheck:"输入用户名已经存在，请重新输入"
//             },
//             password: {
//                 required: "密码不能为空",
//                 minlength: "密码长度不能小于{minlength}",
//                 maxlength: "密码长度不能大于{maxlength}"
//             },
//             repeatPassword: {
//                 required: "重复密码不能为空",
//                 repeat: "两次密码输入不一致"
//             },
//             number: {
//                 required: "数字不能为空"
//             },
//             identitycard: {
//                 required: '身份证号码不能为空',
//                 pattern: '身份证号码格式不正确'
//             }
//         });
//     }]);
// })();

    app.service('ClickService', ['$http', function($http){
      this.properties = {
        'name': 'abc',
        'age': 8
      };

      this.clickFunc = function() {
        var self = this;
        console.log('service clickFunc');
        self.properties.name = 'new name';
      };

      this.reset = function() {
        var self = this;
        self.properties = {
          'name': 'abc',
          'age': 8
        };
      }
    }]);

    // app.filter('preSubstr', function() {
    //     return function(input, num) {
    //       return input.substring(num -1);
    //     };
    // });

    app.filter('strDate', function($filter) {
      return function(input, mode) {
        if(angular.isDate(input)) {
          return $filter('date')(input, mode);
        }

        return $filter('date')(new Date(input), mode)
      };
    });

    // app.filter('strFromTo', function() {
    //   return function(input, from, to) {
    //     from = parseInt(from)
    //     if(from - to > 0) {
    //       // from > to

    //     }
    //     if(input.length <= from) {
    //       console.log()
    //     }
    //   };
    // });

    app.controller("validateCtrl", ["$scope", "$http", '$state', 'ClickService', function ($scope, $http, $state, ClickService) {

        $scope.test = function() {
          console.log('testing');
          ClickService.clickFunc();
        };

        $scope.go = function() {
          $state.go('app.form.simpleForm');
        };

        $scope.$watch(function() {
          return ClickService.properties;
        }, function(newVal, oldVal) {
          console.log(newVal);
          $scope.entity.ClickServiceProperty = newVal.name;
        }, true);

        var vm = $scope.vm = {
            htmlSource: "",
            showErrorType: 1
        };

        $scope.saveEntity = function (form) {
            //do somethings for bz
            console.log($scope.entity);
            alert("Save Successfully!!!");
        };

        //每个表单的配置，如果不设置，默认和全局配置相同
        vm.validateOptions = {
            blurTrig: true,
            isExists: true
        };

        $scope.entity = {
            "email": "abc@email.com",
            "name": "",
            "name": "abce",
            "number": 12, 
            "password": "11111",
            "repeatPassword": "11111",
            "url": "http://www.baidu.com",
            "datetime": '2015-03-08 01:02:03.0',
            'memo': '备注',
            'ClickServiceProperty': ClickService.properties.name
        };
    }]);