// config

var app =
    angular.module('app')
    .config(
        ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
            function($controllerProvider, $compileProvider, $filterProvider, $provide) {

                // lazy controller, directive and service
                app.controller = $controllerProvider.register;
                app.directive = $compileProvider.directive;
                app.filter = $filterProvider.register;
                app.factory = $provide.factory;
                app.service = $provide.service;
                app.constant = $provide.constant;
                app.value = $provide.value;
            }
        ])
    .config(['$translateProvider',
        function($translateProvider) {
            $translateProvider.useStaticFilesLoader({
                prefix: 'vendor/libs/l10n/',
                suffix: '.json'
            });
            // Default language
            $translateProvider.preferredLanguage('zh_CN');
            $translateProvider.useLocalStorage();
        }
    ])
    .config(['$httpProvider',
        function($httpProvider) {
            $httpProvider.interceptors.push(function() {
                var interceptor = {
                    'request': function(config) {
                        var url = config.url;
                        if ((url.indexOf) && url.indexOf('service') > 0) {
                            config.url = baseUrl + url;
                        }
                        config.headers["X-Requested-With"] = "angular";
                        config.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";

                        if (config.data) {
                            var obj = config.data;
                            var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
                            if (isjson) {
                                config.transformRequest = function(data) {
                                    return $.param(data, true);
                                }
                            }
                        }
                        // 成功的请求方法
                        return config; // 或者 $q.when(config);
                    },
                    'response': function(response) {
                        var result = response.data;
                        if (result.success === false) {
                            if (result.message == "system.isNotLogin" || result.message == "system.isOtherLogin") {
                                if (document.location.href.indexOf("/access/signin") > 0) {
                                    return response;
                                }
                                if (!window.messageShow) {
                                    window.messageShow = true;
                                    if (result.message == "system.isNotLogin") {
                                        arp.alert("登录超时，请重新登录！");
                                    } else {
                                        arp.alert("您的帐号已在其他地点登录！");
                                    }
                                }
                                document.location.href = baseUrl;
                            } else if (result.obj == "ERROR") {
                                arp.alert(result.message);

                                //    var deferred = $q.defer();
                                //    var promise=deferred.promise;

                            }
                        }
                        // 响应成功
                        return response; // 或者 $q.when(config);
                    },
                    'requestError': function(rejection) {
                        // 请求发生了错误，如果能从错误中恢复，可以返回一个新的请求或promise
                        return response; // 或新的promise
                        // 或者，可以通过返回一个rejection来阻止下一步
                        // return $q.reject(rejection);
                    },
                    'responseError': function(rejection) {
                        // 请求发生了错误，如果能从错误中恢复，可以返回一个新的响应或promise
                        return rejection; // 或新的promise
                        // 或者，可以通过返回一个rejection来阻止下一步
                        // return $q.reject(rejection);
                    }
                };
                return interceptor;
            });

        }
    ]);
