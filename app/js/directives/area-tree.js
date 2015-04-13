'use strict';

app.directive('areaTree', ['$modal', 
  function($modal) {
    // 
    console.log('areaTree directive ')
    return {
      restrict: 'AE',
      transclude: true,
      replace: true,
      templateUrl: 'views/demo/conow-area/areaModal.html',
      link: function(scope, element, attrs) {
        console.log('linking in areaTree directive')
      }
    }
  }
]);