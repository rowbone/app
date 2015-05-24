app
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
                        windowClass: winClass
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
    .directive('modalBox', ['$modalStack', function ($modalStack) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            templateUrl: 'js/directives/conow-modal/modalbox.html',
            link: function (scope, el, attrs,ctrls) {
                scope.title=attrs.title;
                if(attrs.okFn){
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
                    var modal = $modalStack.getTop();
                    if (modal && modal.value.backdrop && modal.value.backdrop != 'static') {
                        evt.preventDefault();
                        evt.stopPropagation();
                        $modalStack.dismiss(modal.key, 'backdrop click');
                    }
                };
            }
        }
    }]);