angular.module('demoApp')
    .directive('uiButterbar', ['$rootScope', '$anchorScroll', function ($rootScope, $anchorScroll) {
        return {
            restrict: 'AC',
            templateUrl:'js/directives/conow-layout/loading.html',
            link: function (scope, el, attrs) {
                //el.addClass('butterbar');
                el.addClass('butterbar hide');
                scope.$on('$stateChangeStart', function (event) {
                    $anchorScroll();
                    //el.removeClass('hide').addClass('active');
                    el.removeClass('hide')
                });
                scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
                    event.targetScope.$watch('$viewContentLoaded', function () {
                        //el.addClass('hide').removeClass('active');
                        el.addClass('hide')
                    })
                });
            }
        };
    }])
    .directive('titleBar', function () {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope:{
                title:'@name'
            },
            templateUrl: 'js/directives/conow-layout/titlebar.html',
            controller:
                function ($scope, $element,$attrs,$transclude) {
                    $scope.isDiy=false;
                    if($scope.title == null){
                        $scope.isDiy=true;
                    }
                },
            link: function (scope, el, attrs) {
                scope.goBack = function goBack() {
                    history.back();
                    scope.$apply();
                }
            }
        }
    })
    .directive('btnBar', function () {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope:{
                iclass:'@',
                url:'@'
            },
            templateUrl: 'js/directives/conow-layout/btnbar.html',
            controller:
                function ($scope, $element,$attrs,$transclude) {
                    $transclude(function (clone) {
                        $scope.isMore=false;
                        $scope.isBigMore=false;
                        if(clone.text().trim().length > 8){
                            $scope.isMore=true;
                        }
                        if(clone.text().trim().length >= 12){
                            $scope.isBigMore=true;
                        }
                    });
                },
            link: function (scope, el, attrs,ctr) {
                el.find('.more-menu-btn').find('a').removeAttr('class');

            }

        }
    })
    .directive('titleDiy', function () {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            require: '?^titleBar',
            template: '<div class="col v-middle text-center" ng-transclude></div>',
            link: function (scope, el, attrs, controller) {
            }

        }
    });
    //.directive('divWrapper', function () {
    //    return {
    //        restrict: 'EA',
    //        replace: true,
    //        transclude: true,
    //        template: '<div class="wrapper-md pos-rlt"><div ng-transclude></div></div>'
    //        //controller: function ($scope) {},
    //        //link: function (scope, el, attrs) {
    //        //    el.controller = attrs.name;
    //        //}
    //    };
    //});