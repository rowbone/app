app.controller('ztreeController', ['$scope', '$http','$modal', '$timeout', '$rootScope', function($scope, $http,$modal, $timeout, $rootScope) {
	var tree = $scope.my_tree = {};
	$scope.my_tree_handler = function(branch) {
      $scope.output = "你选择了：" + branch.label;
    };
    $scope.treeData = {};
    //显示树的树据源
    var ids = new Array();
    $scope.showDataSrc = function(){
    	return $timeout(function(){
console.info($scope.treeData);
    		//获取数据源对象
    		var dataSrc = $scope.treeData[0];
    		//初始化ID数组
    		
    		ids.push(dataSrc.id);
console.info(dataSrc.children);
    		if(dataSrc.children.length != 0){
    			
    			$scope.recursionTreeChilren(dataSrc.children);
    		}
    		
console.info(ids);
    	},1000);
    };
    //递归查询子节点
    $scope.recursionTreeChilren = function(children){
    	for(var i = 0;i < children.length;i++){
			ids.push(children[i].id);
			if(children[i].children.length != 0){
				$scope.recursionTreeChilren(children[i].children);
			}
		}
    };
    
    $scope.showDataSrc();
    //添加分支，目标分支的id
    $scope.add_a_branch = function () {
    	b = tree.get_selected_branch();
    	if(b == null){
    		//如果不选则默认选择后台一组
    		b = tree.select_branch_id("1421924918293539010273354");
    	};
        var modalAdd =   $modal.open({
            templateUrl: "other/demo/conow-abn-tree/branch_add.html",
            controller: 'AddBranchCtrl',
            resolve: {
                fatherOrgUnitId : function(){
              	  return b.id;
                },
                fatherOrgUnit : function(){
                	  return b.label;
                  },
              }
          });
        modalAdd.result.then(function (obj) {
        		b = tree.select_branch_id(obj.FATHER_ORG_ID);
    		    return tree.add_branch(b, {
    		      id: obj.ID,
    		      label: obj.ORG_UNIT_SHORT_NAME,
    		    });
		    
     		});
        };
        //删除分支 目标分支的id
    $scope.delete_a_branch = function(id) { //当树上不做选择是，传入分支的id也可删除
    	var c;
    	c = tree.get_selected_branch();
    	if(c == null){
    		c = tree.select_branch_id("1421924918293539010273354");
    	}
    	return tree.delete_branch(c);
    };
    	//修改分支
    $scope.edit_a_branch = function (id) { //当树上不做选择是，传入分支的id也可编辑
    	b = tree.get_selected_branch();
    	if(b == null){
    		b = tree.select_branch_id("1421924918293539010273354");
    	};
        var modalI = $modal.open({
               templateUrl: "other/demo/conow-abn-tree/branch_edit.html",
               controller: 'EditBranchCtrl',
               resolve: {
                 orgUnitId : function(){
               	  return b.id;
                 }
               }
             });
        modalI.result.then(function (obj) {
       	 var b;
		 b = tree.select_branch_id(obj.orgUnit.id + "");
		 return tree.edit_branch(b,obj.orgUnit.org_UNIT_SHORT_NAME);
   		},function(){
   			var b;
 			b = tree.select_branch_id("1421924918293539010273354");
 			return tree.edit_branch(b,"已修改");
   		});
     };
           
}]);
