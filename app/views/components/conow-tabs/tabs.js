'use strict';

app.controller('tabsTestCtrl', ['$scope', '$http','$stateParams','$filter','$rootScope',
    function($scope,$http,$stateParams,$filter,$rootScope) {
		$scope.show = function(val){
			$scope.getShowTabs(val);
		}
		$scope.hide = function(val){
			$scope.getHideTabs(val);
		}
		$scope.skip = function(val){
			$scope.getNumTabs(val);
		}
		$scope.sample = function(){
			console.log("is tabs");
		}
		$scope.sample2 = function(){
			console.log("is tabs2");
		}
}]);