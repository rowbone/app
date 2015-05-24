'use strict';

// 通讯录 controller
app.controller('contactListCtrl2', ['$scope', 
	function($scope) {
		$scope.contactListTabs = [true, false, false, false];
console.log($scope.contactListTabs)
		$scope.tabsChange = function(tabIndex) {
			var iTabsLen = $scope.contactListTabs.length;
			tabIndex = Number(tabIndex);
			for(var i=0; i<iTabsLen; i++) {
				if(tabIndex === i) {
					$scope.contactListTabs[i] = true;
				} else {
					$scope.contactListTabs[i] = false;
				}
			}
		};
	}
]);