
angular.module('app')
    .factory('$$conowStackedMap', function () {
        return {
            createNew: function () {
                var stack = [];

                return {
                    add: function (key, value) {
                        stack.push({
                            key: key,
                            value: value
                        });
                    },
                    get: function (key) {
                        for (var i = 0; i < stack.length; i++) {
                            if (key == stack[i].key) {
                                return stack[i];
                            }
                        }
                    },
                    keys: function() {
                        var keys = [];
                        for (var i = 0; i < stack.length; i++) {
                            keys.push(stack[i].key);
                        }
                        return keys;
                    },
                    top: function () {
                        return stack[stack.length - 1];
                    },
                    remove: function (key) {
                        var idx = -1;
                        for (var i = 0; i < stack.length; i++) {
                            if (key == stack[i].key) {
                                idx = i;
                                break;
                            }
                        }
                        return stack.splice(idx, 1)[0];
                    },
                    removeTop: function () {
                        return stack.splice(stack.length - 1, 1)[0];
                    },
                    length: function () {
                        return stack.length;
                    }
                };
            }
        };
    })

    .directive('conowModalBackdrop', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'js/directives/conow-modal/backdrop.html',
            link: function (scope, element, attrs) {
                scope.backdropClass = attrs.backdropClass || '';

                scope.animate = false;

                //trigger CSS transitions
                $timeout(function () {
                    scope.animate = true;
                });
            }
        };
    }])

    .directive('conowModalWindow', ['$conowModalStack', '$timeout', function ($conowModalStack,$timeout) {
        return {
            restrict: 'EA',
            scope: {
                index: '@',
                animate: '='
            },
            replace: true,
            transclude: true,
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.templateUrl || 'js/directives/conow-modal/window.html';
            },
            link: function (scope, element, attrs) {
                element.addClass(attrs.windowClass || '');
                scope.size = attrs.size;
                scope.title = attrs.title;

                if(scope.size=='full'){
                    element.addClass('modal-full');
                }
                if(attrs.title){
                    element.addClass('body-top');
                }
                if(element.find('.modal-footer').length>0){
                    element.addClass('body-bottom');
                }
                $timeout(function () {
                    // trigger CSS transitions
                    scope.animate = true;

                    /**
                     * Auto-focusing of a freshly-opened modal element causes any child elements
                     * with the autofocus attribute to lose focus. This is an issue on touch
                     * based devices which will show and then hide the onscreen keyboard.
                     * Attempts to refocus the autofocus element via JavaScript will not reopen
                     * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
                     * the modal element if the modal does not contain an autofocus element.
                     */
                    if (!element[0].querySelectorAll('[autofocus]').length) {
                        element[0].focus();
                    }
                });

                scope.close = function (evt) {
                    var modal = $conowModalStack.getTop();
                    //console.log(evt.target);
                    //console.log(evt.currentTarget);

                    if (modal && modal.value.backdrop && modal.value.backdrop != 'static' && (evt.target === evt.currentTarget)) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        $conowModalStack.dismiss(modal.key, 'backdrop click');
                    }
                };

                scope.cancel = function () {
                    var modal = $conowModalStack.getTop();
                    if (modal && modal.value.backdrop && modal.value.backdrop != 'static') {
                        $conowModalStack.dismiss(modal.key, 'backdrop click');
                    }
                };

            }
        };
    }])

    .directive('conowModalTransclude', function () {
        return {
            link: function($scope, $element, $attrs, controller, $transclude) {
                $transclude($scope.$parent, function(clone) {
                    $element.empty();
                    $element.append(clone);
                });
            }
        };
    })

    .factory('$conowModalStack', ['$transition', '$timeout', '$document', '$compile', '$rootScope', '$$conowStackedMap',
        function ($transition, $timeout, $document, $compile, $rootScope, $$conowStackedMap) {

            var OPENED_MODAL_CLASS = 'modal-open';

            var backdropDomEl, backdropScope;
            var openedWindows = $$conowStackedMap.createNew();
            var $conowModalStack = {};

            function backdropIndex() {
                var topBackdropIndex = -1;
                var opened = openedWindows.keys();
                for (var i = 0; i < opened.length; i++) {
                    if (openedWindows.get(opened[i]).value.backdrop) {
                        topBackdropIndex = i;
                    }
                }
                return topBackdropIndex;
            }

            $rootScope.$watch(backdropIndex, function(newBackdropIndex){
                if (backdropScope) {
                    backdropScope.index = newBackdropIndex;
                }
            });

            function removeModalWindow(modalInstance) {

                var body = $document.find('body').eq(0);
                var modalWindow = openedWindows.get(modalInstance).value;

                //clean up the stack
                openedWindows.remove(modalInstance);

                //remove window DOM element
                removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, 300, function() {
                    modalWindow.modalScope.$destroy();
                    body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
                    checkRemoveBackdrop();
                });
            }

            function checkRemoveBackdrop() {
                //remove backdrop if no longer needed
                if (backdropDomEl && backdropIndex() == -1) {
                    var backdropScopeRef = backdropScope;
                    removeAfterAnimate(backdropDomEl, backdropScope, 150, function () {
                        backdropScopeRef.$destroy();
                        backdropScopeRef = null;
                    });
                    backdropDomEl = undefined;
                    backdropScope = undefined;
                }
            }

            function removeAfterAnimate(domEl, scope, emulateTime, done) {
                // Closing animation
                scope.animate = false;

                var transitionEndEventName = $transition.transitionEndEventName;
                if (transitionEndEventName) {
                    // transition out
                    var timeout = $timeout(afterAnimating, emulateTime);

                    domEl.bind(transitionEndEventName, function () {
                        $timeout.cancel(timeout);
                        afterAnimating();
                        scope.$apply();
                    });
                } else {
                    // Ensure this call is async
                    $timeout(afterAnimating);
                }

                function afterAnimating() {
                    if (afterAnimating.done) {
                        return;
                    }
                    afterAnimating.done = true;

                    domEl.remove();
                    if (done) {
                        done();
                    }
                }
            }

            $document.bind('keydown', function (evt) {
                var modal;

                if (evt.which === 27) {
                    modal = openedWindows.top();
                    if (modal && modal.value.keyboard) {
                        evt.preventDefault();
                        $rootScope.$apply(function () {
                            $conowModalStack.dismiss(modal.key, 'escape key press');
                        });
                    }
                }
            });

            $conowModalStack.open = function (modalInstance, modal) {

                openedWindows.add(modalInstance, {
                    deferred: modal.deferred,
                    modalScope: modal.scope,
                    backdrop: modal.backdrop,
                    keyboard: modal.keyboard
                });

                var body = $document.find('body').eq(0),
                    currBackdropIndex = backdropIndex();

                if (currBackdropIndex >= 0 && !backdropDomEl) {
                    backdropScope = $rootScope.$new(true);
                    backdropScope.index = currBackdropIndex;
                    var angularBackgroundDomEl = angular.element('<div conow-modal-backdrop></div>');
                    angularBackgroundDomEl.attr('backdrop-class', modal.backdropClass);
                    backdropDomEl = $compile(angularBackgroundDomEl)(backdropScope);
                    body.append(backdropDomEl);
                }

                var angularDomEl = angular.element('<div conow-modal-window></div>');
                angularDomEl.attr({
                    'template-url': modal.windowTemplateUrl,
                    'window-class': modal.windowClass,
                    'size': modal.size,
                    'title': modal.title,
                    'index': openedWindows.length() - 1,
                    'animate': 'animate'
                }).html(modal.content);

                var modalDomEl = $compile(angularDomEl)(modal.scope);
                openedWindows.top().value.modalDomEl = modalDomEl;
                body.append(modalDomEl);
                body.addClass(OPENED_MODAL_CLASS);
            };

            $conowModalStack.close = function (modalInstance, result) {
                var modalWindow = openedWindows.get(modalInstance);
                if (modalWindow) {
                    modalWindow.value.deferred.resolve(result);
                    removeModalWindow(modalInstance);
                }
            };

            $conowModalStack.dismiss = function (modalInstance, reason) {
                var modalWindow = openedWindows.get(modalInstance);
                if (modalWindow) {
                    modalWindow.value.deferred.reject(reason);
                    removeModalWindow(modalInstance);
                }
            };

            $conowModalStack.dismissAll = function (reason) {
                var topModal = this.getTop();
                while (topModal) {
                    this.dismiss(topModal.key, reason);
                    topModal = this.getTop();
                }
            };

            $conowModalStack.getTop = function () {
                return openedWindows.top();
            };

            return $conowModalStack;
        }])

    .provider('conowModals', function () {

        var $modalProvider = {
            options: {
                backdrop: true, //can be also false or 'static'
                keyboard: true
            },
            $get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$conowModalStack',
                function ($injector, $rootScope, $q, $http, $templateCache, $controller, $conowModalStack) {

                    var conowModal = {};

                    function getTemplatePromise(options) {
                        return options.template ? $q.when(options.template) :
                            $http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl,
                                {cache: $templateCache}).then(function (result) {
                                    return result.data;
                                });
                    }

                    function getResolvePromises(resolves) {
                        var promisesArr = [];
                        angular.forEach(resolves, function (value) {
                            if (angular.isFunction(value) || angular.isArray(value)) {
                                promisesArr.push($q.when($injector.invoke(value)));
                            }
                        });
                        return promisesArr;
                    }

                    conowModal.open = function (modalOptions) {

                        var modalResultDeferred = $q.defer();
                        var modalOpenedDeferred = $q.defer();

                        //prepare an instance of a modal to be injected into controllers and returned to a caller
                        var modalInstance = {
                            result: modalResultDeferred.promise,
                            opened: modalOpenedDeferred.promise,
                            close: function (result) {
                                $conowModalStack.close(modalInstance, result);
                            },
                            dismiss: function (reason) {
                                $conowModalStack.dismiss(modalInstance, reason);
                            }
                        };

                        //merge and clean up options
                        modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
                        modalOptions.resolve = modalOptions.resolve || {};

                        //verify options
                        if (!modalOptions.template && !modalOptions.templateUrl) {
                            throw new Error('One of template or templateUrl options is required.');
                        }

                        var templateAndResolvePromise =
                            $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));


                        templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

                            var modalScope = (modalOptions.scope || $rootScope).$new();
                            modalScope.$close = modalInstance.close;
                            modalScope.$dismiss = modalInstance.dismiss;

                            var ctrlInstance, ctrlLocals = {};
                            var resolveIter = 1;

                            //controllers
                            if (modalOptions.controller) {
                                ctrlLocals.$scope = modalScope;
                                ctrlLocals.$conowModalInstance = modalInstance;
                                angular.forEach(modalOptions.resolve, function (value, key) {
                                    ctrlLocals[key] = tplAndVars[resolveIter++];
                                });

                                ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                                if (modalOptions.controllerAs) {
                                    modalScope[modalOptions.controllerAs] = ctrlInstance;
                                }
                            }

                            $conowModalStack.open(modalInstance, {
                                scope: modalScope,
                                deferred: modalResultDeferred,
                                content: tplAndVars[0],
                                backdrop: modalOptions.backdrop,
                                keyboard: modalOptions.keyboard,
                                backdropClass: modalOptions.backdropClass,
                                windowClass: modalOptions.windowClass,
                                windowTemplateUrl: modalOptions.windowTemplateUrl,
                                size: modalOptions.size,
                                title: modalOptions.title,
                                toolbars:modalOptions.toolbars
                            });

                        }, function resolveError(reason) {
                            modalResultDeferred.reject(reason);
                        });

                        templateAndResolvePromise.then(function () {
                            modalOpenedDeferred.resolve(true);
                        }, function () {
                            modalOpenedDeferred.reject(false);
                        });

                        return modalInstance;
                    };

                    return conowModal;
                }]
        };

        return $modalProvider;
    })

    .directive('modalBody', ['$conowModalStack', function ($conowModalStack) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            template: '<div class="modal-body" ng-transclude></div>',
            link: function (scope, el, attrs,ctrls) {

            }
        }
    }])
    .directive('modalBtn', ['$conowModalStack', function ($conowModalStack) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            template: '<div class="modal-footer" ng-transclude></div>',
            link: function (scope, el, attrs,ctrls) {
                scope.close = function (evt) {
                    var modal = $conowModalStack.getTop();
                    if (modal && modal.value.backdrop && modal.value.backdrop != 'static') {
                        evt.preventDefault();
                        evt.stopPropagation();
                        $conowModalStack.dismiss(modal.key, 'backdrop click');
                    }
                };
            }
        }
    }])

//    .directive('conowModal', ['conowModals', function (conowModals) {
//    return {
//        restrict: 'A',
//        link: function (scope, el, attrs) {
//            //var winClass = "";
//            //if (attrs.full == "true") {
//            //    winClass = "modal-full";
//            //}
//            el.bind('click', function () {
//
//                var modalInstance = conowModals.open({
//                    templateUrl: attrs.templateUrl,
//                    controller: attrs.controller,
//                    size: attrs.size,
//                    //windowClass: winClass,
//                    resolve: {
//                        modalParams: function() {
//                            return {
//                                'options': attrs.options
//                            };
//                        },
//                        deps: ['uiLoad', function (uiLoad) {
//                            if(attrs.controllerUrl){
//                                return uiLoad.load([attrs.controllerUrl]);
//                            }else{
//                                return null;
//                            }
//                        }]
//                    }
//                });
//                modalInstance.result.then(function (selectedItem) {
//                    scope.selected = selectedItem;
//                }, function () {
//                    //$log.info(new Date());
//                });
//            })
//
//        }
//    }
//}])
    .directive('conowModal', ['$modal', function ($modal) {
        return {
            restrict: 'A',
            link: function (scope, el, attrs) {
                var winClass = "";
                if (attrs.full == "true") {
                    winClass = "modal-full";
                }
                el.bind('click', function () {

                    var modalInstance = $modal.open({
                        templateUrl: attrs.url,
                        controller: attrs.controls,
                        size: attrs.size,
                        windowClass: winClass,
                        resolve: {
                            modalParams: function() {
                                return {
                                    'options': attrs.options
                                };
                            },
                            deps: ['uiLoad', function (uiLoad) {
                                if(attrs.controlsUrl){
                                    return uiLoad.load([attrs.controlsUrl]);
                                }else{
                                    return null;
                                }
                            }]
                        }
                    });
                    modalInstance.result.then(function (selectedItem) {
                        scope.selected = selectedItem;
                    }, function () {
                        //$log.info(new Date());
                    });
                })

            }
        }
    }])
    .directive('modalBox', ['$conowModalStack', function ($conowModalStack) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            templateUrl: 'js/directives/conow-modal/modalbox.html',
            link: function (scope, el, attrs,ctrls) {
                scope.title=attrs.title;
                if(attrs.okFn){
                    console.log(attrs.okFn);
                    scope.isOk=true;
                }
                if(!attrs.isBtnCancel){
                    scope.isBtnCancel=true;
                }
                if(!attrs.isIconCancel){
                    scope.isIconCancel=true;
                }
                el.find('.modal-ok').bind('click',function(){
                    scope.$apply(attrs.okFn);
                });
                scope.close = function (evt) {
                    var modal = $conowModalStack.getTop();
                    if (modal && modal.value.backdrop && modal.value.backdrop != 'static') {
                        evt.preventDefault();
                        evt.stopPropagation();
                        $conowModalStack.dismiss(modal.key, 'backdrop click');
                    }
                };
            }
        }
    }]);