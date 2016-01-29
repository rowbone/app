/*! conowValidator v2.3.7 2015-01-19 */
angular.module("conow.validator", ["ng"])
    .provider('conowValidator', [

        function() {
            var defaultRules = {
                    required: "该选项不能为空",
                    maxlength: "该选项输入值长度不能大于{maxlength}",
                    minlength: "该选项输入值长度不能小于{minlength}",
                    email: "输入邮件的格式不正确",
                    repeat: "两次输入不一致",
                    pattern: "该选项输入格式不正确",
                    number: "必须输入数字",
                    conowuniquecheck: "该输入值已经存在，请重新输入",
                    url: "输入URL格式不正确",
                    max: "该选项输入值不能大于{max}",
                    min: "该选项输入值不能小于{min}",
                    idCard: "输入身份证格式不正确",
                    eitherOr: "该选项必填一个"
                },
                elemTypes = ['text', 'password', 'email', 'number', 'url', ['textarea'],
                    ['select'],
                    ['select-one']
                ];

            var validatorFn = function() {
                this.elemTypes = elemTypes;
                this.rules = [];
                this.isEmpty = function(object) {
                    if (!object) {
                        return true;
                    }
                    if (object instanceof Array && object.length === 0) {
                        return true;
                    }
                    return false;
                };
                // this.getShowObj = function(elem) {
                //   var $elem = angular.element(elem),
                //       $formGroup = $elem,
                //       isHasInputGroup = false;

                //   while(!($formGroup.hasClass('form-group'))) {
                //     $formGroup = $formGroup.parent();
                //     if($formGroup.hasClass('input-group')) {
                //       isHasInputGroup = true;
                //       break;
                //     }
                //   }
                //   if(isHasInputGroup) {
                //     return $elem.parent();
                //   } else {
                //     return $elem;
                //   }
                // };
                this.defaultShowError = function(elem, errorMessages) {
                    var $elem = angular.element(elem),
                        $parent = $elem.parent(),
                        $group = $parent.parent();


                    var arrMsgs = $.grep(errorMessages, function(n) {
                        return (n);
                    });
                    var errorMessage = ((arrMsgs[0] == undefined) ? '' : arrMsgs[0]);

                    var htmlStr = '<span class="conow-error"><i class="error-icon ci-warning text-lg"></i>';

                    if (errorMessage) {
                        htmlStr += '<span class="error-msg"><span class="arrow top"></span>' +
                            '<span class="error-msg-inner">' + errorMessage + '</span></span>';
                    }
                    htmlStr += '</span>';

                    var $error = angular.element(htmlStr);

                    $elem.parent().css('position', 'relative').addClass("validateErrorBox");
                    $elem.next(".conow-error").remove();
                    $elem.after($error);
                    $error.find('error-icon').css('line-height', $elem.height());
                    if (parseInt($elem.parent().css('padding-right')) > 0) {
                        $error.css('right', 10 + parseInt($elem.parent().css('padding-right')));
                    }
                    $error.position({
                        top: $elem.position().top
                    });
                    // $error.offset({top: $elem.offset().top, left: $elem.offset().left + $elem.width()});

                };
                this.defaultRemoveError = function(elem) {
                    var $elem = angular.element(elem),
                        $parent = $elem.parent(),
                        $group = $parent.parent();
                    $elem.parent().removeClass("validateErrorBox");
                    $elem.next(".conow-error").remove();


                };
                this.options = {
                    blurTrig: true,
                    showError: true,
                    removeError: true
                };
            };

            validatorFn.prototype = {
                constructor: validatorFn,
                config: function(options) {
                    this.options = angular.extend(this.options, options);
                },
                setRules: function(rules) {
                    this.rules = rules;
                },
                getErrorMessage: function(validationName, elem) {
                    var msgTpl = null;
                    var elem = typeof elem.attr == 'function' ? elem[0] : elem;
                    if (!this.isEmpty(this.rules[elem.name]) && !this.isEmpty(this.rules[elem.name][validationName])) {
                        msgTpl = this.rules[elem.name][validationName];
                    }
                    switch (validationName) {
                        case "maxlength":
                            if (msgTpl !== null) {
                                return msgTpl.replace("{maxlength}", elem.getAttribute("ng-maxlength") || elem.getAttribute("maxlength"));
                            }
                            return defaultRules.maxlength.replace("{maxlength}", elem.getAttribute("ng-maxlength") || elem.getAttribute("maxlength"));
                        case "minlength":
                            if (msgTpl !== null) {
                                return msgTpl.replace("{minlength}", elem.getAttribute("ng-minlength") || elem.getAttribute("minlength"));
                            }
                            return defaultRules.minlength.replace("{minlength}", elem.getAttribute("ng-minlength") || elem.getAttribute("minlength"));
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
                        default:
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
                getErrorMessages: function(elem, errors) {
                    var elementErrors = [];
                    for (var err in errors) {
                        if (errors[err]) {
                            var msg = this.getErrorMessage(err, elem);
                            elementErrors.push(msg);
                        }
                    }
                    return elementErrors;
                },
                showError: function(elem, errorMessages, options) {
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
                removeError: function(elem, options, warningOptions) {
            		if(warningOptions && !warningOptions.isValid) {
                		return;
                	}
                	
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
            this.config = function(options) {
                validator.config(options);
            };

            /**
             * 设置验证规则，提示信息
             * @param rules
             */
            this.setRules = function(rules) {
                validator.setRules(rules);
            };

            /**
             * 设置默认规则
             * @param rules
             */
            this.setDefaultRules = function(rules) {
                defaultRules = angular.extend(defaultRules, rules);
            };

            /**
             * get method
             * @returns {validatorFn}
             */
            this.$get = function() {
                return validator;
            };
        }
    ]);

angular.module("conow.validator")
    .directive("conowFormValidate", ['$parse', '$compile', '$timeout', 'conowValidator', '$injector', 'conowTabsService',
        function($parse, $compile, $timeout, conowValidator, $injector, conowTabsService) {
            return {
                // require: ['?conowTabs'],
                controller: ['$scope', '$element', '$attrs', '$injector', 'conowTabsService', 
                    function($scope, $elem, $attrs, $injector, conowTabsService) {
                        var self = this;

                        self.conowTabsService = conowTabsService;

                        this.needBindKeydown = false;

                        this.form = null;
                    	this.formElement = $elem;
                        this.submitSuccessFn = null;
                        this.fields = [];
                        this.doValidate = function(success) {
                            if (angular.isFunction(this.form.doValidate)) {
                                this.form.doValidate();
                            }
                            if (this.form.$valid && angular.isFunction(success)) {
                                $scope.cnSubmitProcessing = true;
                                $scope.$apply($scope.cnSubmitProcessing);
                                $scope.$apply(function() {
                                    success($scope);
                                });
                                $scope.cnSubmitProcessing = false;
                                $scope.$apply($scope.cnSubmitProcessing);
                                $scope.cnSubmitDisabled = false;
                                $scope.$apply($scope.cnSubmitDisabled);
                            }
                        },

                        // this method will be exposed to directives that require conowFormValidate
                        this.addField = function(field, fieldName) {
                            // this.fields.push(field);
                            // bind events for this single field
                            this.bindEventForSingleField(field, fieldName);
                        };

                        // 为单个输入控件绑定校验事件
                        this.bindEventForSingleField = function(elem, asyncFieldName) {
                            var $elem = angular.element(elem),
                                formName = this.formElement.attr('name'),
                                formElem = this.formElement[0],
                                elemName = asyncFieldName || elem.name;
                            self = this;

                            // 只验证输入类表单控件
                            if (conowValidator.elemTypes.toString().indexOf(elem.type) == -1) return;

                            // 处理异常参数
                            if (conowValidator.isEmpty(elemName)) return;

                            // $viewValue属性保存着更新视图所需的实际字符串。
                            var $viewValueName = formName + "." + elemName + ".$viewValue";

                            this.fields.push(elem);

                            // 监控输入框的value值当有变化时移除错误信息
                            // 可以修改成当输入框验证通过时才移除错误信息，只要监控$valid属性即可
                            $scope.$watch("[" + $viewValueName + "," + (this.fields.length - 1) + "]", function(newValue) {
                                var $elem = self.fields[newValue[1]];
                                //if($elem === document.activeElement && ( $elem.type || $elem.href )) {
                                if( $elem.type || $elem.href ) {
                                	$scope[formName].$errors = [];
                                    conowValidator.removeError($elem, self.options);
                                }
                                
                            }, true);

                            // 光标移走的时候触发验证信息
                            if (this.options.blurTrig) {
                                $elem.bind("blur", function(e) {
                                    self.blurHandler(e);
                                });
                            }

                        },

                        // 光标离开事件处理函数
                        this.blurHandler = function(e) {
                            if (!this.options.blurTrig) {
                                return;
                            }
                            var targetInput = e.target;
                            var self = this,
                                $elem = angular.element(targetInput),
                                formName = this.formElement.attr('name');
                            $timeout(function() {
                                if (!$scope[formName][targetInput.name].$valid) {
                                	var errorMessages = [];

                                	// 如果自定义规则错误，且是弱控制
                                	var customRuleOptions = {
				                		isValid: $scope.$eval($elem.attr('custom-rule-valid')),
				                		msg: $elem.attr('custom-rule-msg'),
				                		ignore: $scope.$eval($elem.attr('custom-rule-ignore')) || true
				                	}
                                	if(customRuleOptions && customRuleOptions.isValid == false && !$scope[formName][targetInput.name].$error.required) {
                                		
                                		errorMessages = [customRuleOptions.msg];
                                	} else {
                                		errorMessages = conowValidator.getErrorMessages(targetInput, $scope[formName][targetInput.name].$error);	
                                	}
                                    
                                    conowValidator.showError($elem, errorMessages, self.options);
                                } else {
                                	var customRuleOptions;
                                	if($elem.attr('custom-rule-valid')) {
	                                	customRuleOptions = {
					                		isValid: $scope.$eval($elem.attr('custom-rule-valid')),
					                		msg: $elem.attr('custom-rule-msg'),
					                		ignore: $scope.$eval($elem.attr('custom-rule-ignore')) || true
					                	}
                                	}
                                    conowValidator.removeError($elem, self.options, customRuleOptions);
                                }
                            }, 50);
                        };
                    }
                ],
                link: function(scope, form, attr, ctrl) {
                    // $timeout(function(){
                    // var formElem = form[0],
                    var formElem = form.find(':input:not(button)'),

                        formName = form.attr("name"),
                        formSubmitFn = $parse(attr.conowSubmit),
                        options = scope.$eval(attr.conowFormValidate);

                    ctrl.form = scope[attr.name];
                    conowValidator.currentForm = form;

                    // conowFormValidate has value,watch it
                    if (attr.conowFormValidate) {
                        scope.$watch(attr.conowFormValidate, function(newValue) {
                            if (newValue) {
                                options = angular.extend({}, conowValidator.options, newValue);
                            }
                        }, true);
                    }

                    options = angular.extend({}, conowValidator.options, options);
                    ctrl.options = options;

                    // 初始化验证规则，并实时监控输入值的变化
                    // form.length 获取 form 中的元素个数；form[i]/form.elements[i] 获取页面的单个元素；
                    for (var i = 0; i < formElem.length; i++) {
                        var elem = formElem[i];
                        ctrl.bindEventForSingleField(elem);
                    }
                    // }, 0);

                    //触发验证事件
                    var doValidate = function() {
                        scope.cnSubmitDisabled = true;
                        scope.$apply(scope.cnSubmitDisabled);
                        var errorMessages = [];
                        var errors = [];
                        var currentForm = scope[formName];
                        //循环验证
                        //formElem = form.find(':input:not(button)');
                        formElem = form.find('[ng-model][name]:visible');
                        for (var i = 0; i < formElem.length; i++) {
                            var elem = angular.element(formElem[i]);
                            var elemName = elem.attr('name');

                            // if elemName is empty, break for loop
                            if(!elemName || (!currentForm[elemName]) ) continue;
                            //if (conowValidator.elemTypes.toString().indexOf(elem.type) > -1 && !conowValidator.isEmpty(elem.name) && !elem.hasClass('ignore-validation') && !elem.parents('.ignore-validation').length) {
                            //if (conowValidator.elemTypes.toString().indexOf(elem.type) > -1 && !conowValidator.isEmpty(elem.name)) {
                                if (currentForm[elemName].$valid) {
                                    elem.removeClass("error").addClass("valid");
                                    continue;
                                } else {
                                    var elementErrors = conowValidator.getErrorMessages(elem, currentForm[elemName].$error);
                                    errorMessages.push(elementErrors[0]);
                                    errors.push({
                                        field: elem[0],
                                        msg: elementErrors[0]
                                    });
                                    conowValidator.removeError(elem[0], options);
                                    conowValidator.showError(elem[0], elementErrors, options);
                                    // // 提交时单个提示
                                    // break;
                                }
                            //}
                        }
                        if (!conowValidator.isEmpty(errorMessages) && errorMessages.length > 0) {
                            currentForm.$errors = errorMessages;

                            // focus to the first error field
                            errors[0].field.focus();
                        } else {
                            currentForm.$errors = [];
                        }
                        if (!scope.$$phase) {
                            scope.$apply(currentForm.$errors);
                        }
                        if (!currentForm.$valid) {
                            scope.cnSubmitDisabled = false;
                            scope.$apply(scope.cnSubmitDisabled);

                            var error = currentForm.$error.required[0],
                                input = angular.element('[name="' + error.$name + '"]'),
                                $tabContent = input.closest('.tab-content'),
                                $tabPanes = $tabContent.find('.tab-pane');
                                $tabPane = input.closest('.tab-pane'),
                                tabName = $tabContent.attr('only'),
                                tabIndex = $tabPane.index($tabPanes),
                                i = 0,
                                iLen = $tabPanes.length;

                            // tabs 跳转：对应的 tab-content 必须提供 only 属性
                            if(angular.isDefined(tabName) && tabIndex > -1) {
                                $timeout(function() {
                                    ctrl.conowTabsService.getNumTabs(tabName, tabIndex);

                                    $timeout(function() {
                                        formElem = $tabPane.find('[ng-model][name]');
                                        for (var i = 0; i < formElem.length; i++) {
                                            var elem = angular.element(formElem[i]);
                                            var elemName = elem.attr('name');

                                            // if elemName is empty, break for loop
                                            if(!elemName || (!currentForm[elemName]) ) continue;
                                            //if (conowValidator.elemTypes.toString().indexOf(elem.type) > -1 && !conowValidator.isEmpty(elem.name) && !elem.hasClass('ignore-validation') && !elem.parents('.ignore-validation').length) {
                                            //if (conowValidator.elemTypes.toString().indexOf(elem.type) > -1 && !conowValidator.isEmpty(elem.name)) {
                                                if (currentForm[elemName].$valid) {
                                                    elem.removeClass("error").addClass("valid");
                                                    continue;
                                                } else {
                                                    var elementErrors = conowValidator.getErrorMessages(elem, currentForm[elemName].$error);
                                                    errorMessages.push(elementErrors[0]);
                                                    errors.push({
                                                        field: elem[0],
                                                        msg: elementErrors[0]
                                                    });
                                                    conowValidator.removeError(elem[0], options);
                                                    conowValidator.showError(elem[0], elementErrors, options);
                                                    // // 提交时单个提示
                                                    // break;
                                                }
                                            //}
                                        }
                                    });
                                }); 
                            }                           
                        }
                    };
                    scope[formName].doValidate = doValidate;
                    // conowSubmit is function

                    if (attr.conowSubmit && angular.isFunction(formSubmitFn)) {
                        form.bind("submit", function() {
                            doValidate();
                            if (scope[formName].$valid && angular.isFunction(formSubmitFn)) {
                                scope.$apply(function() {
                                    formSubmitFn(scope);
                                });
                            }
                        });
                        ctrl.needBindKeydown = true;
                    }
                    if (ctrl.needBindKeydown) {
                        form.bind("keydown keypress", function(event) {
                            if (event.which === 13) {
                                var currentInput = document.activeElement;
                                if (currentInput.type !== "textarea") {
                                    var button = form.find("button");
                                    if (button) {
                                        button[0].focus();
                                    }
                                    currentInput.focus();
                                    doValidate();
                                    event.preventDefault();
                                    if (scope[formName].$valid && angular.isFunction(ctrl.submitSuccessFn)) {
                                        scope.$apply(function() {
                                            ctrl.submitSuccessFn(scope);
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            };
        }
    ])
    .directive("conowSubmit", ['$parse',
        function($parse) {
            return {
                require: "^conowFormValidate",
                link: function(scope, element, attr, ctrl) {
                    var validSuccessFn = $parse(attr.conowSubmit);
                    element.bind("click", function() {
                        ctrl.doValidate(validSuccessFn);

                    });
                    //TODO 暂时去掉
                    // ctrl.needBindKeydown = true;
                    ctrl.submitSuccessFn = validSuccessFn;
                }
            };
        }
    ])
    .directive("conowRepeat", [

        function() {
            'use strict';
            return {
                require: "ngModel",
                link: function(scope, elem, attrs, ctrl) {
                    var otherInput = elem.inheritedData("$formController")[attrs.conowRepeat];

                    ctrl.$parsers.push(function(value) {
                        if (value === otherInput.$viewValue) {
                            ctrl.$setValidity("repeat", true);
                            return value;
                        }
                        ctrl.$setValidity("repeat", false);
                    });

                    otherInput.$parsers.push(function(value) {
                        ctrl.$setValidity("repeat", value === ctrl.$viewValue);
                        return value;
                    });
                }
            };
        }
    ])
    .directive("conowUniqueCheck", ['$timeout', '$http', 'conowValidator',
        function($timeout, $http, conowValidator) {
            return {
                require: "ngModel",
                link: function(scope, elem, attrs, ctrl) {
                    // 属性为对象时获取其值的方法（scope.$eval）
                    var attValues = scope.$eval(attrs.conowUniqueCheck),
                        url = attValues.url,
                        checkOnInit = attValues.checkOnInit ? attValues.checkOnInit : false;
                    // isExists = attValues.isExists;  // isExists 参数是 conow-unique-check 属性对象的一个属性。default is true

                    var doValidate = function() {
                        attValues = scope.$eval(attrs.conowUniqueCheck)
                        url = attValues.url;

                        // var isExistsAttr = attrs.isExists;  // 增加 isExists 的属性调用方式
                        $http.get(url, {isSilent: true}).success(function(data) {

                            var $elem = angular.element(elem),
                                formElem = $elem.closest('form'),
                                formName = formElem.attr("name"),
                                valid = (data.obj == null);

                            ctrl.$setValidity('conowuniquecheck', valid);
                            if (valid) {
                                // 有效
                                conowValidator.removeError($elem, conowValidator.options);
                            } else {
                                // 无效，输入数据与已存在数据重复
                                var errorMessages = conowValidator.getErrorMessages($elem, scope[formName][$elem.attr('name')].$error);
                                conowValidator.showError($elem, errorMessages, conowValidator.options);
                            }
                        });
                    };

                    // 检测是否在数据初次渲染时进行校验 - 都志会 
                    if (checkOnInit) {
                        $timeout(function() {
                            if (elem.val()) {
                                doValidate();
                            }
                        });
                    }
                    
                    var unBindWatcher = scope.$watch(attrs.ngModel, function(newVal) {
                    	if (newVal && checkOnInit) {
                             doValidate();
                             
                             unBindWatcher();
                         }
                    })

                    // // 每输入一个字符就提交校验
                    // scope.$watch(attrs.ngModel, function (newValue) {
                    //     if (newValue && ctrl.$dirty) {
                    //         doValidate();
                    //     }
                    // });

                    elem.bind("blur.conowUniqueCheck", function() {
                        $timeout(function() {
                            if (ctrl.$invalid && !ctrl.$error.conowuniquecheck) {
                                return;
                            }
                            doValidate();
                        });
                    });
                    elem.bind("focus.conowUniqueCheck", function() {
                        $timeout(function() {
                            ctrl.$setValidity('conowuniquecheck', true);
                        });
                    });
                    scope.$on('$destroy', function() {
                        elem.unbind("blur.conowUniqueCheck");
                        elem.unbind("focus.conowUniqueCheck");
                    });
                }
            };
        }
    ])
    .directive('asyncField', [
        // 为ng-repeat等动态生成的输入控件添加校验事件
        function() {
            return {
                require: "^conowFormValidate",
                link: function($scope, elem, attribs, ctrls) {
                    ctrls.addField(elem[0], attribs.name);
                }
            };
        }
    ])
    /**
     * 业务自定义规则
     * @param  {[type]} $timeout                  ng $timeout service
     * @param  {[type]} conowValidator			  conowValidator服务
     * @return {[type]}                           customRule directive
     */
    .directive('customRule',['$timeout','conowValidator', function($timeout,conowValidator){
		return {
			require: "ngModel",
			restrict: "A",
			// scope: {
			// 	customRule:'='
			// },
            link: function($scope, elem, attrs, ctrl) {

                // evaluate options dynamically
                var getOptions = function(attrs){
                	return {
                		isValid: $scope.$eval(attrs.customRuleValid),
                		msg: attrs.customRuleMsg,
                		ignore: attrs.customRuleIgnore!=='' ? $scope.$eval(attrs.customRuleIgnore) : true
                	}
                }

                var clearModelWatch;
                var targetElem = elem;

                // 监听强弱控制参数是否变化
                $scope.$watch(function() {
			        return $scope.$eval(attrs.customRuleIgnore);
			      }, function(ignore) {

			      	if(!ignore) {
		                // 如果是强控，设置字段校验是否通过
	                	clearModelWatch = $scope.$watch(function() {
					        // return ctrl.$modelValue;
	                		return $scope.$eval(attrs.customRuleValid);
	                		/*return {
	                			modelValue: ctrl.$modelValue,
	                			valid: $scope.$eval(attrs.customRuleValid)
	                		}*/
					      }, function(newVal) {
	                    	/*var options = getOptions(attrs);
	                        if (options.isValid) {
	                            ctrl.$setValidity("customRule", true);
	                        } else {
	                        	ctrl.$setValidity("customRule", false);	
	                        }*/
					    	  var options = getOptions(attrs);
					    	  if (newVal) {
		                            ctrl.$setValidity("customRule", true);
		                            conowValidator.removeError(targetElem, conowValidator.options,options);
		                        } else {
		                        	ctrl.$setValidity("customRule", false);
		                        	var errorMessages = options.msg || '未提供自定义信息';
		                            conowValidator.showError(targetElem, [errorMessages], conowValidator.options,options);
		                        }
					      });
			      	} else {
			      		if(clearModelWatch) {
			      			ctrl.$setValidity("customRule", true);
			      			clearModelWatch();
			      		}
			      	}

			      });

                elem.on('blur', function(e){
                    var targetInput = e.target;
                    var self = this,
                        $elem = angular.element(targetInput);
                    var options = getOptions(attrs);
                    $timeout(function() {
                        if (!options.isValid) {
                            var errorMessages = options.msg || '未提供自定义信息';
                            conowValidator.showError($elem, [errorMessages], conowValidator.options,options);
                        } else {
                            conowValidator.removeError($elem, conowValidator.options,options);
                        }
                    }, 50);
                })

            }
		}
    }])
    //二选一必填
    .directive('eitherOr', ['conowValidator',function(conowValidator) {
	    return {
	      require: 'ngModel',
	      link:  function($scope, $element, $attrs, ctrl) {
	                var validate = function(viewValue) {
	                var comparisonModel = $attrs.eitherOr;
		            if(!viewValue || !comparisonModel){
		              ctrl.$setValidity('eitherOr', true);
		            }
		            if(!(ctrl.$isEmpty(viewValue)&&ctrl.$isEmpty(comparisonModel)) ){
		            	conowValidator.removeError($element, conowValidator.options);
		            }
		            ctrl.$setValidity('eitherOr', !(ctrl.$isEmpty(viewValue)&&ctrl.$isEmpty(comparisonModel)) );
		            return viewValue;
	              };
	     
	              ctrl.$parsers.unshift(validate);
	              ctrl.$formatters.push(validate);
	     
		          $attrs.$observe('eitherOr', function(comparisonModel){
		            return validate(ctrl.$viewValue);
		          });
		        }
		    };
	  }
	])
    //身份证号验证
    .directive('idCard', [function () {
      return {
          require: "ngModel",
          link: function (scope, element, attr, ngModel) {
        	  function IdentityCodeValid(code) { 
                  var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
                  var tip = "";
                  var pass= true;
                  var len = code.length;
                  if(!code || !/(^\d{15}$)|(^\d{17}(\d|X)$)/i.test(code)){
                      tip = "身份证号格式错误";
                      pass = false;
                  }else if(!city[code.substr(0,2)]){
                      tip = "地址编码错误";
                      pass = false;
                  }
                  //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字  
                  if(len == '15')  
                  {  
                      var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;  
                      var arr_data = code.match(re_fifteen);  
                      var year = arr_data[2];  
                      var month = arr_data[3];  
                      var day = arr_data[4];  
                      var birthday = new Date('19'+year+'/'+month+'/'+day);  
                      pass = verifyBirthday('19'+year,month,day,birthday);  
                  }  
                  //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X  
                  if(len == '18')  
                  {  
                      var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;  
                      var arr_data = code.match(re_eighteen);  
                      var year = arr_data[2];  
                      var month = arr_data[3];  
                      var day = arr_data[4];  
                      var birthday = new Date(year+'/'+month+'/'+day);  
                      pass = verifyBirthday(year,month,day,birthday);  
                  }  
                  if(len == '15'){
                	  code = changeFivteenToEighteen(code);  
                  }
                //18位身份证需要验证最后一位校验位
                  if(code.length == 18){
                      code = code.split('');
                      //∑(ai×Wi)(mod 11)
                      //加权因子
                      var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                      //校验位
                      var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                      var sum = 0;
                      var ai = 0;
                      var wi = 0;
                      for (var i = 0; i < 17; i++)
                      {
                          ai = code[i];
                          wi = factor[i];
                          sum += ai * wi;
                      }
                      var last = parity[sum % 11];
                      if(parity[sum % 11] != code[17]){
                          tip = "校验位错误";
                          pass =false;
                      }
                  }
                  return pass;
              }
        	  //校验日期  
        	  var verifyBirthday = function(year,month,day,birthday)  
        	  {  
        	      var now = new Date();  
        	      var now_year = now.getFullYear();  
        	      //年月日是否合理  
        	      if(birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day)  
        	      {  
        	          //判断年份的范围（3岁到100岁之间)  
        	          var time = now_year - year;  
        	          if(time >= 3 && time <= 100)  
        	          {  
        	              return true;  
        	          }  
        	          return false;  
        	      }  
        	      return false;  
        	  };   
        	 //15位转18位身份证号  
        	  var changeFivteenToEighteen = function(card)  
        	  {  
        	      if(card.length == '15')  
        	      {  
        	          var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);  
        	          var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');  
        	          var cardTemp = 0, i;    
        	          card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);  
        	          for(i = 0; i < 17; i ++)  
        	          {  
        	              cardTemp += card.substr(i, 1) * arrInt[i];  
        	          }  
        	          card += arrCh[cardTemp % 11];  
        	          return card;  
        	      }  
        	      return card;  
        	  };  
              var customValidator = function (value) {
                  var validity = ngModel.$isEmpty(value) || IdentityCodeValid(value);
                  ngModel.$setValidity("idCard", validity);
                  return value;
              };
              ngModel.$formatters.push(customValidator);
              ngModel.$parsers.push(customValidator);
          }
      };
  }])
	/**
	 * 监听model数据是否有效
	 * @param  {[type]}
	 * @return {[type]}
	 */
	.directive('validityWatcher', ['conowValidator', function (conowValidator) {
	    return {
	        require: ['^form', 'ngModel'],
	        restrict: "A",
	        link: function (scope, element, attr, ctrlArr) {

	            if (!attr.name) {
	                throw "validityWather must be set on an element that has a 'name' attribute";
	            }
	            var form = ctrlArr[0];
	            var ngModel = ctrlArr[1];
	            var errorMessages = [];

	            //watch the current form's validation for the current field name
	            scope.$watch(
	            	function() { return ngModel.$valid; }, 
	            	function(isValid){
						if (isValid != undefined && form.$dirty && ngModel.$dirty) {
							if(isValid) {
								conowValidator.removeError(element[0], conowValidator.options);
							} else {
								var elementErrors = conowValidator.getErrorMessages(element, form[element.attr('name')].$error);
                                    errorMessages.push(elementErrors[0]);
                                conowValidator.removeError(element[0], conowValidator.options);
                                conowValidator.showError(element[0], elementErrors, conowValidator.options);
							}
		                    //emit an event upwards 
		                    /*scope.$emit("valBubble", {
		                        isValid: isValid,       // if the field is valid
		                        element: element,       // the element that the validation applies to
		                        expression: this.exp,   // the expression that was watched to check validity
		                        scope: scope,           // the current scope
		                        ctrl: ctrl              // the current controller
		                    });*/
		                }
	            	}
	            );
	        }
	    };
	}])
	
    .directive('numeric', ['$locale', '$parse',

        function($locale, $parse) {
            // Usage:
            //     <input type="text" decimals="3" min="-20" max="40" formatting="false" ></input>
            // Creates:
            // 
            var directive = {
                link: link,
                require: 'ngModel',
                restrict: 'A'
            };
            return directive;


            function link(scope, el, attrs, ngModelCtrl) {
                var decimalSeparator = $locale.NUMBER_FORMATS.DECIMAL_SEP;
                var groupSeparator = $locale.NUMBER_FORMATS.GROUP_SEP;

                // Create new regular expression with current decimal separator.
                var NUMBER_REGEXP = "^\\s*(\\-|\\+)?(\\d+|(\\d*(\\.\\d*)))\\s*$";
                var regex = new RegExp(NUMBER_REGEXP);

                var formatting = true;
                var groupFormatting = false;
                var maxInputLength = 16; // Maximum input length. Default max ECMA script.
                var max; // Maximum value. Default undefined.
                var min; // Minimum value. Default undefined.
                var decimals = 2; // Number of decimals. Default 2.
                var lastValidValue; // Last valid value.
                var negative = false;

                var options = {};

                // Create parsers and formatters.
                ngModelCtrl.$parsers.push(parseViewValue);
                ngModelCtrl.$parsers.push(minValidator);
                ngModelCtrl.$parsers.push(maxValidator);
                ngModelCtrl.$formatters.push(formatViewValue);

                el.bind('blur.numeric', onBlur); // Event handler for the leave event.
                el.bind('focus.numeric', onFocus); // Event handler for the focus event.

                // Put a watch on the min, max and decimal value changes in the attribute.
                options = scope.$eval(attrs.numeric);
                min = options.min || min;
                max = options.max || max;
                decimals = options.decimals === 0 ? 0 : (options.decimals || decimals);
                groupFormatting = options.groupFormatting || groupFormatting;
                negative = options.negative || negative;

                /*if(negative){
                  NUMBER_REGEXP = "^\\s*(\\-|\\+)?(\\d+|(\\d*(\\.\\d*)))\\s*$";
                }*/

                scope.$watch(function(){
                	var options = scope.$eval(attrs.numeric);
                	return options.min;
                }, onMinChanged);
                scope.$watch(function(){
                	var options = scope.$eval(attrs.numeric); 
                	return options.max;
                }, onMaxChanged);
                scope.$watch(function(){
                	var options = scope.$eval(attrs.numeric); 
                	return options.decimals;
                }, onDecimalsChanged);
                scope.$watch(function(){
                	var options = scope.$eval(attrs.numeric); 
                	return options.formatting;
                }, onFormattingChanged);

                // Setup decimal formatting.
                if (decimals > -1) {
                    ngModelCtrl.$parsers.push(function(value) {
                        return (value) ? round(value) : value;
                    });
                    ngModelCtrl.$formatters.push(function(value) {
                        return (value) ? formatPrecision(value) : value;
                    });
                }

                function onMinChanged(value) {
                    if (!angular.isUndefined(value)) {
                        min = parseFloat(value);
                        lastValidValue = minValidator(ngModelCtrl.$modelValue);
                        ngModelCtrl.$setViewValue(formatPrecision(lastValidValue));
                        ngModelCtrl.$render();
                    }
                }

                function onMaxChanged(value) {
                    if (!angular.isUndefined(value)) {
                        max = parseFloat(value);
                        maxInputLength = calculateMaxLength(max);
                        lastValidValue = maxValidator(ngModelCtrl.$modelValue);
                        ngModelCtrl.$setViewValue(formatPrecision(lastValidValue));
                        ngModelCtrl.$render();
                    }
                }

                function onDecimalsChanged(value) {
                    if (!angular.isUndefined(value)) {
                        decimals = parseFloat(value);
                        maxInputLength = calculateMaxLength(max);
                        if(ngModelCtrl.$modelValue == null){
                        	ngModelCtrl.$modelValue = '';
                        }
                        lastValidValue = ngModelCtrl.$modelValue;
                        ngModelCtrl.$setViewValue(formatPrecision(lastValidValue));
                        ngModelCtrl.$render();
                    }
                }

                function onFormattingChanged(value) {
                    if (!angular.isUndefined(value)) {
                        formatting = (value !== false);
                        ngModelCtrl.$setViewValue(formatPrecision(lastValidValue));
                        ngModelCtrl.$render();
                    }
                }

                /**
                 * Round the value to the closest decimal.
                 */
                function round(value) {
                    var d = Math.pow(10, decimals);
                    return Math.round(value * d) / d;
                }

                /**
                 * Format a number with the thousand group separator.
                 */
                function numberWithCommas(value) {
                    if (groupFormatting) {
                        var parts = value.toString().split(decimalSeparator);
                        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
                        return parts.join(decimalSeparator);
                    } else {
                        // No formatting applies.
                        return value;
                    }
                }
                
                function correctDecimal(value){
                	if (!(value || value === 0)) {
                        return '';
                    }
                    var formattedValue = parseFloat(value);
                    if(!isNaN(decimals)) formattedValue = formattedValue.toFixed(decimals);
                    formattedValue = formattedValue.toString().replace('.', decimalSeparator);
                    return formattedValue;
                }

                /**
                 * Format a value with thousand group separator and correct decimal char.
                 */
                function formatPrecision(value) {
                    var formattedValue = correctDecimal(value);
                    return numberWithCommas(formattedValue);
                }

                function formatViewValue(value) {
                    return ngModelCtrl.$isEmpty(value) ? '' : '' + value;
                }

                function parseFloatFixedDown(value) {
                    if (!(value || value === 0 )) {
                        return '';
                    }
                    // var formattedValue = parseFloat(value).toFixed(decimals);
                    
                    var formattedValue = parseFloat(value.replace(new RegExp(groupSeparator, 'g'), ''));
                    
                    if(isNaN(formattedValue)) {
                    	return ''
                    }
                    
                    if(!isNaN(decimals)){
                    	formattedValue = formattedValue.toFixed(decimals);
                    } 
                    
                    if (formattedValue.toString().indexOf('.') > -1 && (!isNaN(decimals)) ) {
                        var arrNumber = formattedValue.split('.');
                        formattedValue = arrNumber[0] + '.' + formattedValue.split('.')[1].substr(0, decimals);
                    }
                    return formattedValue;
                }

                /**
                 * Parse the view value.
                 */
                function parseViewValue(value) {
                    if (angular.isUndefined(value)) {
                        value = '';
                    }
                    value = value.toString().replace(decimalSeparator, '.');

                    // Handle leading decimal point, like ".5"
                    if (value.indexOf('.') === 0) {
                        value = '0' + value;
                        ngModelCtrl.$setViewValue(value);
                        ngModelCtrl.$render();
                        return value;
                    }

                    // Allow "-" inputs only when min < 0
                    if (value.indexOf('-') === 0) {
                        if (!min || min >= 0) {
                            value = null;
                            ngModelCtrl.$setViewValue(formatViewValue(lastValidValue));
                            ngModelCtrl.$render();
                            return lastValidValue;
                        } else if (value === '-') {
                            value = '';
                        }
                    }

                    var empty = ngModelCtrl.$isEmpty(value);
                    if (empty) {
                        lastValidValue = '';
                        //ngModelCtrl.$modelValue = undefined;
                    } else {
                        maxInputLength = calculateMaxLength(value);
                        if (regex.test(value) && (value.length <= maxInputLength)) {
                            if (value > max) {
                                lastValidValue = max;
                            } else if (value < min) {
                                lastValidValue = min;
                            } else {
                                // lastValidValue = (value === '') ? null : parseFloat(value);
                                lastValidValue = (value === '') ? null : parseFloatFixedDown(value);
                            }
                        } else {
                            // Render the last valid input in the field
                            lastValidValue = lastValidValue || parseFloatFixedDown(value);
                            ngModelCtrl.$setViewValue(formatViewValue(correctDecimal(lastValidValue)));
                            ngModelCtrl.$render();
                        }
                    }

                    return lastValidValue;
                }

                /**
                 * Calculate the maximum input length in characters.
                 * If no maximum the input will be limited to 16; the maximum ECMA script int.
                 */
                function calculateMaxLength(value) {
                    var length = 16;
                    if (!angular.isUndefined(value)) {
                        length = Math.floor(value).toString().length;
                    }
                    if (decimals > 0) {
                        // Add extra length for the decimals plus one for the decimal separator.
                        length += decimals + 1;
                    }
                    if(isNaN(decimals)) {
                    	length += 99;
                    }
                    if (min < 0) {
                        // Add extra length for the - sign.
                        length++;
                    }
                    return length;
                }

                /**
                 * Minimum value validator.
                 */
                function minValidator(value) {
                    if (!angular.isUndefined(min)) {
                        if (!ngModelCtrl.$isEmpty(value) && (value < min)) {
                            return min;
                        } else {
                            return value;
                        }
                    } else {
                        return value;
                    }
                }

                /**
                 * Maximum value validator.
                 */
                function maxValidator(value) {
                    if (!angular.isUndefined(max)) {
                        if (!ngModelCtrl.$isEmpty(value) && (value > max)) {
                            return max;
                        } else {
                            return value;
                        }
                    } else {
                        return value;
                    }
                }


                /**
                 * Function for handeling the blur (leave) event on the control.
                 */
                function onBlur() {
                    var value = ngModelCtrl.$modelValue;
                    if (!angular.isUndefined(value)) {
                        // Format the model value.
                        ngModelCtrl.$viewValue = formatPrecision(value);
                        ngModelCtrl.$render();
                    }
                }


                /**
                 * Function for handeling the focus (enter) event on the control.
                 * On focus show the value without the group separators.
                 */
                function onFocus() {
                    var value = ngModelCtrl.$modelValue;
                    lastValidValue = value;
                    if (!angular.isUndefined(value) && value != null) {
                        ngModelCtrl.$viewValue = value.toString().replace(".", decimalSeparator);
                        ngModelCtrl.$render();
                    }
                }
            }
        }
    ]);