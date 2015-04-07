/*! conowValidator v2.3.7 2015-01-19 */
angular.module("conow.validator", ["ng"])
  .provider('conowValidator', [function () {
    var defaultRules = {
      required      : "该选项不能为空",
      maxlength     : "该选项输入值长度不能大于{maxlength}",
      minlength     : "该选项输入值长度不能小于{minlength}",
      email         : "输入邮件的格式不正确",
      repeat        : "两次输入不一致",
      pattern       : "该选项输入格式不正确",
      number        : "必须输入数字",
      conowuniquecheck: "该输入值已经存在，请重新输入",
      url           : "输入URL格式不正确",
      max           : "该选项输入值不能大于{max}",
      min           : "该选项输入值不能小于{min}"
    },
    elemTypes = ['text', 'password', 'email', 'number', 'url', ['textarea'], ['select'], ['select-one']];

    var validatorFn = function () {
        this.elemTypes = elemTypes;
        this.rules = [];
        this.isEmpty = function (object) {
            if (!object) {
                return true;
            }
            if (object instanceof Array && object.length === 0) {
                return true;
            }
            return false;
        };
        this.getShowObj = function(elem) {
          var $elem = angular.element(elem),
              $formGroup = $elem,
              isHasInputGroup = false;

          while(!($formGroup.hasClass('form-group'))) {
            $formGroup = $formGroup.parent();
            if($formGroup.hasClass('input-group')) {
              isHasInputGroup = true;
              break;
            }
          }
          if(isHasInputGroup) {
            return $elem.parent();
          } else {
            return $elem;
          }
        };
        this.defaultShowError = function (elem, errorMessages) {
            // var $elem = angular.element(elem),
                // $parent = $elem.parent(),
                // $group = $parent.parent();

            $group = this.getShowObj(elem);

            // if(!this.isEmpty($group) && $group[0].tagName === "FORM"){
            //     $group = $parent;
            // }
            // if(!this.isEmpty($parent) && $parent.hasClass('input-group')) {
            //     $group = $parent;
            // }
            // if (!this.isEmpty($group) && !$group.hasClass("has-error")) {
            //     $group.addClass("has-error");
            //     // 修改 input-group 的提示问题 2015-4-3
            //     // $elem.addClass("has-error");
            //     $group.after('<span class="conow-error">' + ((errorMessages[0] == undefined) ? '' : errorMessages[0]) + '</span>');
            // }
            if(!$group.hasClass('has-error')) {
              $group.addClass('has-error');
              $group.after('<span class="conow-error">' + ((errorMessages[0] == undefined) ? '' : errorMessages[0]) + '</span>');
            }
        };
        this.defaultRemoveError = function (elem) {
            // var $elem = angular.element(elem),
                // $parent = $elem.parent(),
                // $group = $parent.parent();

            var $group = this.getShowObj(elem);

            // if(!this.isEmpty($group) && $group[0].tagName === "FORM"){
            //     $group = $parent;
            // }
            // if(!this.isEmpty($parent) && $parent.hasClass('input-group')) {
            //     $group = $parent;
            // }
            // if (!this.isEmpty($group) && $group.hasClass("has-error")) {
            //     $group.removeClass("has-error");
            //     // $elem.next(".conow-error").remove();
            //     $group.next(".conow-error").remove();
            // }
            if($group.hasClass('has-error')) {
              $group.removeClass('has-error');
              $group.next('.conow-error').remove();
            }
        };
        this.options = {
            blurTrig   : true,
            showError  : true,
            removeError: true
        }
    };

    validatorFn.prototype = {
        constructor     : validatorFn,
        config          : function (options) {
            this.options = angular.extend(this.options, options);
        },
        setRules        : function (rules) {
            this.rules = rules;
        },
        getErrorMessage : function (validationName, elem) {
            var msgTpl = null;
            if (!this.isEmpty(this.rules[elem.name]) && !this.isEmpty(this.rules[elem.name][validationName])) {
                msgTpl = this.rules[elem.name][validationName];
            }
            switch (validationName) {
                case "maxlength":
                    if (msgTpl !== null) {
                        return msgTpl.replace("{maxlength}", elem.getAttribute("ng-maxlength"));
                    }
                    return defaultRules.maxlength.replace("{maxlength}", elem.getAttribute("ng-maxlength"));
                case "minlength":
                    if (msgTpl !== null) {
                        return msgTpl.replace("{minlength}", elem.getAttribute("ng-minlength"));
                    }
                    return defaultRules.minlength.replace("{minlength}", elem.getAttribute("ng-minlength"));
                case "max":
                    if (msgTpl !== null) {
                        return msgTpl.replace("{max}", elem.getAttribute("max"));
                    }
                    return defaultRules.max.replace("{max}", elem.getAttribute("max"));
                case "min":
                    if (msgTpl !== null) {
                        return msgTpl.replace("{min}", elem.getAttribute("min"));
                    }
                    return defaultRules.min.replace("{min}", elem.getAttribute("min"));
                default :
                {
                    if (msgTpl !== null) {
                        return msgTpl;
                    }
                    if (defaultRules[validationName] === null) {
                        throw new Error("该验证规则(" + validationName + ")默认错误信息没有设置！");
                    }
                    return defaultRules[validationName];
                }

            }
        },
        getErrorMessages: function (elem, errors) {
            var elementErrors = [];
            for (var err in errors) {
                if (errors[err]) {
                    var msg = this.getErrorMessage(err, elem);
                    elementErrors.push(msg);
                }
            }
            return elementErrors;
        },
        showError       : function (elem, errorMessages, options) {
            var useOptions = angular.extend({}, this.options, options);
            angular.element(elem).removeClass("valid").addClass("error");
            // // 校验不通过时，自动focus到对应元素
            // elem.focus();
            if (useOptions.showError === false) {
                return;
            }
            if (angular.isFunction(useOptions.showError)) {
                return useOptions.showError(elem, errorMessages);
            }
            if (useOptions.showError === true) {
                return this.defaultShowError(elem, errorMessages);
            }
        },
        removeError     : function (elem, options) {
            var useOptions = angular.extend({}, this.options, options);
            angular.element(elem).removeClass("error").addClass("valid");
            if (useOptions.removeError === false) {
                return;
            }
            if (angular.isFunction(useOptions.removeError)) {
                return useOptions.removeError(elem);
            }
            if (useOptions.removeError === true) {
                return this.defaultRemoveError(elem);
            }
        }
    };

    var validator = new validatorFn();

    /**
     * 配置验证属性
     * @param options
     */
    this.config = function (options) {
        validator.config(options);
    };

    /**
     * 设置验证规则，提示信息
     * @param rules
     */
    this.setRules = function (rules) {
        validator.setRules(rules);
    };

    /**
     * 设置默认规则
     * @param rules
     */
    this.setDefaultRules = function (rules) {
        defaultRules = angular.extend(defaultRules, rules);
    };

    /**
     * get method
     * @returns {validatorFn}
     */
    this.$get = function () {
        return validator;
    }
  }]);

angular.module("conow.validator")
  .directive("conowFormValidate", ['$parse', '$timeout', 'conowValidator', function ($parse, $timeout, conowValidator) {
      return {
          controller: ['$scope', function ($scope) {
              this.needBindKeydown = false;
              this.form = null;
              this.formElement = null;
              this.submitSuccessFn = null;
              this.doValidate = function(success){
                  if (angular.isFunction(this.form.doValidate)) {
                      this.form.doValidate();
                  }
                  if (this.form.$valid && angular.isFunction(success)) {
                      $scope.$apply(function () {
                          success($scope);
                      });
                  }
              }
          }],
          link      : function (scope, form, attr, ctrl) {
              var formElem = form[0],
                  formName = form.attr("name"),
                  formSubmitFn = $parse(attr.conowSubmit),
                  options = scope.$eval(attr.conowFormValidate);

              ctrl.form = scope[formName];
              ctrl.formElement = form;
              // conowFormValidate has value,watch it
              if (attr.conowFormValidate) {
                  scope.$watch(attr.conowFormValidate, function (newValue) {
                      if (newValue) {
                          options = angular.extend({}, conowValidator.options, newValue);
                      }
                  }, true)
              }
              
              options = angular.extend({}, conowValidator.options, options);

              // 初始化验证规则，并实时监控输入值的变化
              // form.length 获取 form 中的元素个数；form[i]/form.elements[i] 获取页面的单个元素；
              for (var i = 0; i < formElem.length; i++) {
                  var elem = formElem[i];
                  var $elem = angular.element(elem);
                  if (conowValidator.elemTypes.toString().indexOf(elem.type) > -1 && !conowValidator.isEmpty(elem.name)) {
                      // $viewValue属性保存着更新视图所需的实际字符串。
                      var $viewValueName = formName + "." + elem.name + ".$viewValue";
                      // 监控输入框的value值当有变化时移除错误信息
                      // 可以修改成当输入框验证通过时才移除错误信息，只要监控$valid属性即可
                      scope.$watch("[" + $viewValueName + "," + i + "]", function (newValue) {
                          var $elem = formElem[newValue[1]];
                          scope[formName].$errors = [];
                          conowValidator.removeError($elem, options);
                      }, true);

                      // 光标移走的时候触发验证信息
                      if (options.blurTrig) {
                          $elem.bind("blur", function () {
                              if (!options.blurTrig) {
                                  return;
                              }
                              var self = this;
                              var $elem = angular.element(this);
                              $timeout(function () {
                                  if (!scope[formName][self.name].$valid) {
                                      var errorMessages = conowValidator.getErrorMessages(self, scope[formName][self.name].$error);
                                      conowValidator.showError($elem, errorMessages, options);
                                  } else {
                                      conowValidator.removeError($elem, options);
                                  }
                              }, 50);
                          });
                      }
                  }
              }

              //触发验证事件
              var doValidate = function () {
                  var errorMessages = [];
                  //循环验证
                  for (var i = 0; i < formElem.length; i++) {
                      var elem = formElem[i];
                      if (conowValidator.elemTypes.toString().indexOf(elem.type) > -1 && !conowValidator.isEmpty(elem.name)) {
                          if (scope[formName][elem.name].$valid) {
                              angular.element(elem).removeClass("error").addClass("valid");
                              continue;
                          } else {
                              var elementErrors = conowValidator.getErrorMessages(elem, scope[formName][elem.name].$error);
                              errorMessages.push(elementErrors[0]);
                              conowValidator.removeError(elem, options);
                              conowValidator.showError(elem, elementErrors, options);
                              // // 提交时单个提示
                              // break;
                          }
                      }
                  }
                  if (!conowValidator.isEmpty(errorMessages) && errorMessages.length > 0) {
                      scope[formName].$errors = errorMessages;
                  } else {
                      scope[formName].$errors = [];
                  }
                  if (!scope.$$phase) {
                      scope.$apply(scope[formName].$errors);
                  }
              };
              scope[formName].doValidate = doValidate;
              // conowSubmit is function
              if (attr.conowSubmit && angular.isFunction(formSubmitFn)) {

                  form.bind("submit", function () {
                      doValidate();
                      if (scope[formName].$valid && angular.isFunction(formSubmitFn)) {
                          scope.$apply(function () {
                              formSubmitFn(scope);
                          });
                      }
                  });
                  ctrl.needBindKeydown = true;
              }
              if(ctrl.needBindKeydown){
                  form.bind("keydown keypress", function (event) {
                      if (event.which === 13) {
                          var currentInput = document.activeElement;
                          if (currentInput.type !== "textarea") {
                              var button = form.find("button");
                              if(button){
                                  button[0].focus();
                              }
                              currentInput.focus();
                              doValidate();
                              event.preventDefault();
                              if (scope[formName].$valid && angular.isFunction(ctrl.submitSuccessFn)) {
                                  scope.$apply(function () {
                                      ctrl.submitSuccessFn(scope);
                                  });
                              }
                          }
                      }
                  });
              }
          }
      };
  }])
  .directive("conowSubmit", ['$parse', function ($parse) {
      return{
          require : "^conowFormValidate",
          link    : function (scope, element, attr, ctrl) {
              var validSuccessFn = $parse(attr.conowSubmit);
              element.bind("click", function () {
                  ctrl.doValidate(validSuccessFn);
              });
              ctrl.needBindKeydown = true;
              ctrl.submitSuccessFn = validSuccessFn;
          }
      };
  }])
  .directive("conowRepeat", [function () {
      'use strict';
      return {
          require: "ngModel",
          link   : function (scope, elem, attrs, ctrl) {
              var otherInput = elem.inheritedData("$formController")[attrs.conowRepeat];

              ctrl.$parsers.push(function (value) {
                  if (value === otherInput.$viewValue) {
                      ctrl.$setValidity("repeat", true);
                      return value;
                  }
                  ctrl.$setValidity("repeat", false);
              });

              otherInput.$parsers.push(function (value) {
                  ctrl.$setValidity("repeat", value === ctrl.$viewValue);
                  return value;
              });
          }
      };
  }])
  .directive("conowUniqueCheck", ['$timeout', '$http', function ($timeout, $http) {
      return{
          require: "ngModel",
          link   : function (scope, elem, attrs, ctrl) {
              var doValidate = function () {
                  // 属性为对象时获取其值的方法（scope.$eval）
                  var attValues = scope.$eval(attrs.conowUniqueCheck),
                      url = attValues.url,
                      isExists = attValues.isExists;  // isExists 参数是 conow-unique-check 属性对象的一个属性。default is true

                  var isExistsAttr = attrs.isExists;  // 增加 isExists 的属性调用方式
                  $http.get(url).success(function (data) {
                      if (isExists === false || isExistsAttr === 'false') {
                          ctrl.$setValidity('conowuniquecheck', !(data.obj == null));
                      } else {
                          ctrl.$setValidity('conowuniquecheck', (data.obj == null));
                      }
                  });
              };

              // // 每输入一个字符就提交校验
              // scope.$watch(attrs.ngModel, function (newValue) {
              //     if (newValue && ctrl.$dirty) {
              //         doValidate();
              //     }
              // });

              elem.bind("blur.conowUniqueCheck", function () {
                  $timeout(function () {
                      if (ctrl.$invalid && !ctrl.$error.conowuniquecheck) {
                          return;
                      }
                      doValidate();
                  });
              });
              elem.bind("focus.conowUniqueCheck", function () {
                  $timeout(function () {
                      ctrl.$setValidity('conowuniquecheck', true);
                  });
              });
              scope.$on('$destroy', function () {
                  elem.unbind("blur.conowUniqueCheck");
                  elem.unbind("focus.conowUniqueCheck");
              });
          }
      };
  }]);