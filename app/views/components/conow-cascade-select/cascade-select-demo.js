'use strict';

app.controller('cascadeSelectDemoCtrl', ['$scope', 'DataService', 'cascadeSelectService', 
	function($scope, DataService, cascadeSelectService) {

		var vm = $scope.vm = {
			titles: ['级别1', '级别2', '级别3', '级别4'],
			sel: '6102',
			// url: '/service/common!queryOptions?type=DICT_LEVEL&DICT_CODE=HR_RETIRED_ARMY_RANK'
			url: 'views/components/conow-cascade-select/data/service-common-queryOptions-type-DICT_OPTION_LEVEL&DICT_CODE-HR_RETIRED_ARMY_RANK2.json'
		};

		// var urlSelected = 'views/components/conow-cascade-select/data/selected.json';
		// DataService.getData(urlSelected)
		// 	.then(function(data) {
		// 		$scope.sel = data;
		// 	}, function(msg) {
		// 		console.error('msg-->', msg);
		// 	});
			
	}
]);

/*
	通用级联选择存在的问题：
	初始化：
		获取所有数据 dataAll 、已选择数据：selected；
		通过参数判断选择数据的层级；
		已选择的数据，触发tab到对应层级；
		数据大于需要选择的层级时，超过的层级不显示；

	点击操作：
		不是最末一级时，点击选中，并初始化下一层级数据，tab-content触发到下一层级；
		是最后一级时，返回选中结果

	返回时：
		设置已选中的数据，用于在再次打开时初始化。

*/
