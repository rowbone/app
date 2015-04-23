app.controller('contactTreeCtrl', ['$scope', '$http', '$timeout', '$rootScope', function($scope, $http, $timeout, $rootScope) {
	var tree, treedata_avm, treedata_avm_source, treedata_avm_area;
	//不加载行政树
	$scope.adminTreeDisplay = false;
	//默认不加载分类树
	$scope.areaTreeDisplay = false;
	
	$scope.isFindStaff = "未找到相关人员";
	$scope.isFindOrg = "未找到相关组织";
	
    //点击组织加载当前组织信息
    $scope.org_select_load = function(branch){
    	window.location.href="/conow/#/app/cam/organdstaff/" + branch.id;
    };
    //加载行政树
    $scope.querySourceOfTree = function(){
    	$scope.adminTreeDisplay = true;
    };
    //加载分类树
    $scope.getAreaTree = function(){
    	$scope.areaTreeDisplay = true;
    };
    
    treedata_avm = [];
    
    $scope.my_data = treedata_avm;
    $scope.my_tree = tree = {};
    
    $scope.backToTree = false;
    $scope.treeIsDisplay = true;
    $scope.tab.active = "";
    //利用对象调用属性的方式解决作用于值传递的问题
    $scope.normalStaff = {};
    $scope.normalOrg = {};
    $scope.conditionInput = {};
    $scope.conditionRadioRgn = {};
    $scope.conditionRadioClass = {};
    $scope.conditionResearch = {};
    $scope.conditionProfessional = {};
    /*关闭查询结果后,初始化搜索条件,显示树*/
   $scope.changeToTree = function(tabSelected){
    	$scope.staffDivIsDisplay=false;
    	$scope.orgDivIsDisplay=false;
		$scope.normalStaff.normalSearchInput=null;
		$scope.normalOrg.searchOrgInput=null;
		$scope.conditionRadioRgn.radioModelArea = false;
		$scope.conditionRadioClass.radioModelClass = false;
		$scope.treeIsDisplay = true;
		$scope.backToTree = false;
		$scope.tab.active = tabSelected;
		$scope.changeToCondition();
    };
    
    /*普通搜索*/
   $scope.statusStaff = {
    	      openStaff:true
    	    };
   $scope.statusOrg = {
 	      openOrg:true
 	    };
   $scope.statusConditionStaff = {
		   openConditionStaff:true
   };
   
   //初始化当前页码对象（用对象的方式解决跨作用域的问题）
   $scope.page = {};
    /*查询人员*/
   $scope.page.staffCurrentPage = 1;//当前页
   $scope.staffMaxSize = 5;//显示的最大页码
   $scope.staffPageSize = 10;//每页显示记录条数
   
   $scope.staffDivIsDisplay=false;
   
   $scope.$watch('page.staffCurrentPage',function(newValue,oldValue, scope){
		 $scope.staffCurrentPage = newValue;
		 //避免第一次发送两次请求
		 if($scope.page.staffCurrentPage != 1){
			 $scope.normalSearchPeople();
		 };
		 
	});
   
    $scope.normalSearchPeople = function(){
       var name = $scope.normalStaff.normalSearchInput;
       if(name){
    	 //显示人员层
           $scope.staffDivIsDisplay=true;
    	   //加载条
    	   $scope.doing_async_searchStaff = true;	
    	   var params = {NAME:name,page:$scope.staffCurrentPage,pagesize:$scope.staffPageSize};
	   	   $http.post('/service/staffInfo!queryStaffInfoByNameByPage',params).success(function(result){
	   			var obj = result.obj;
	   			$scope.staffLength = obj.length;
	   			$scope.staffTotalItems = result.pageInfo.count;
	   			$scope.staffRepeat = obj;
	   			/*隐藏树*/
	   			$scope.treeIsDisplay = false;
	   			$scope.backToTree = true;
	   			$scope.statusStaff = {
	   	    	      openStaff:true
	   	    	    };
	   	  	    $scope.doing_async_searchStaff = false;
	   		});
  	    
      }else{
    	  alert("请输入人员关键字");
      }
    };
    
   /* 查询组织*/
    $scope.page.orgCurrentPage = 1;//当前页
    $scope.orgMaxSize = 5;//显示的最大页码
    $scope.orgPageSize = 10;//每页显示记录条数
    
    $scope.orgDivIsDisplay=false;
    
    $scope.$watch('page.orgCurrentPage',function(newValue,oldValue, scope){
		 $scope.orgCurrentPage = newValue;
		 //避免第一次发送两次请求
		 if($scope.page.orgCurrentPage != 1){
			 $scope.searchOrg();
		 };
		 
	});
    $scope.searchOrg = function(){
    	var name = $scope.normalOrg.searchOrgInput;
        if(name){
        	//显示组织层
     	   $scope.orgDivIsDisplay=true;
     	   //格式化数据
     	  var params_search= {ORG_UNIT_NAME:name,page:$scope.orgCurrentPage,pagesize:$scope.orgPageSize};
     	   //加载条
     	   $scope.doing_async_orgSearch = true;
	       $http.post('/service/orgUnit!queryListOrgByNameOrShortNameByPage',params_search).success(function(result){
	  				var obj = result.obj;
	  				$scope.orgLength = obj.length;
	  				$scope.orgTotalItems = result.pageInfo.count;
	  				$scope.orgDivRepeat = obj;
	  				/*隐藏树*/
		   			$scope.treeIsDisplay = false;
		   			$scope.backToTree = true;
			   	    $scope.statusOrg = {
			   	 	      openOrg:true
			   	 	    };
	  		  	    $scope.doing_async_orgSearch = false;
	  		});
          }else{
        	  arp.alert("请输入组织关键字");
          }
        };
    /*加载区域和分类*/
    $scope.tapIsFirstClick = true;
    $scope.conditionSearchStaffTab = function(){
    	$scope.changeToTree();
    	/*隐藏树*/
		$scope.treeIsDisplay = false;
		$scope.backToTree = true;
    	if($scope.tapIsFirstClick){
    		 $http.post('/service/orgUnit!query12BranchCourts').success(function(result){
    			 $scope.BRCRepeat = result.obj;
    		 });
    		 $http.post('/service/common!queryOptions?type=DICT_OPTION&DICT_CODE=HR_ORG_CLASS').success(function(result){
    			 $scope.orgClassRepeat = result.obj;
    		 });
    	}
    	
    	$scope.tapIsFirstClick = false;
    };
    
    /*筛选组织*/
    $scope.filterSelect = function(){
    	
    	$scope.org = new Array();
    	var brcId = $scope.conditionRadioRgn.radioModelArea;
 	    var orgClass = $scope.conditionRadioClass.radioModelClass;
 	    
 	    if(brcId == "" || brcId == undefined){
 	    	brcId = null;
 	    }
 	   if(orgClass == "" || orgClass == undefined){
 		  orgClass = null;
	    }
 	   if(brcId == null && orgClass == null){
 		  $scope.org = [{ORG_UNIT_SHORT_NAME:'',totalName:'请选择组织所属区域或分类'}];
 	   }else{
	  $scope.doing_async_select = true;
	  
	  var paramRgnOrgClass = {ORG_UNIT_RGN:brcId,ORG_CLASS:orgClass};
 	  $http.post('/service/orgUnit!queryOrgUnitsByOrgUnitRgnAndOrgClass', paramRgnOrgClass).success(function(result){
 		  var obj = result.obj;
 		 $scope.doing_async_select = false;
 		  if(obj != null && obj.length > 0){
 			 $scope.org = obj;
 		  }else{
 			 $scope.org = [{ORG_UNIT_SHORT_NAME:'',ORG_UNIT_SHORT_NAME:'未查找到相关组织'}];
 		  }
 	  });
 	   }
    };
    
   /*过滤组织下拉选择搜索*/
   $scope.isFirstClick = true;
   $scope.filterOrgSelect = function(){
	   $scope.isFirstClick = false;
   };
   
   /*将筛选的组织加入到input框，并将ID保存的隐藏框*/
   $scope.toInput = function(id,shortName){
	   $scope.orgUnitId = id;
	   $scope.shortNameModel=shortName;
   };
    
   $scope.page.staffConditionsCurrentPage = 1;//当前页
   $scope.staffConditionsMaxSize = 5;//显示的最大页码
   $scope.staffConditionsPageSize = 10;//每页显示记录条数
   
   $scope.conditionConsole = false;
   $scope.conditionShow = true;
   
   $scope.$watch('page.staffConditionsCurrentPage',function(newValue,oldValue, scope){
		 $scope.staffConditionsCurrentPage = newValue;
		 //避免第一次发送两次请求
		 if($scope.page.staffConditionsCurrentPage != 1){
			 $scope.conditionForStaff();
		 };
	});
   /*高级查询*/
   $scope.conditionForStaff = function(){
	   if($scope.org){
		   if($scope.org.selected){
			   var orgUnitID = $scope.org.selected.ID;
		   }else{
			   var orgUnitID = null;
		   }
	   }else{
		   var orgUnitID = null;
	   }
	   var staffNameInput = $scope.conditionInput.staffNameInput;
	   var researchInput = $scope.researchInput;
	   var professionalInput = $scope.professionalInput;
	   
	   if(orgUnitID == null && staffNameInput == null && researchInput == null && professionalInput == null){
		   arp.alert("请输入或选择查询条件");
	   }else{
		   $scope.conditionConsole = true;
		   $scope.conditionShow = false;
		   $scope.doing_async_condition = true;
		   
		   var paramConditions = {name:staffNameInput,orgUnitId:orgUnitID,page:$scope.staffConditionsCurrentPage,pagesize:$scope.staffConditionsPageSize};
		   $http.post('/service/staffInfo!queryStaffByNameAndOrgIdAndResearchAndProByPage',paramConditions).success(function(result){
			   var obj = result.obj;
	  			$scope.conditionStaffLength = obj.length;
	  			$scope.staffConditionsTotalItems = result.pageInfo.count;
	  			$scope.conditionStaffRepeat = obj;
	  			$scope.statusConditionStaff = {
	  			   openConditionStaff:true
	  			};
			    $scope.doing_async_condition = false;
		   });
	   }
   };
   /*条件找人中返回条件选择*/
   $scope.changeToCondition = function(){
	    $scope.conditionInput.staffNameInput = null;
	    $scope.conditionResearch.researchInput = null;
	    $scope.conditionProfessional.professionalInput = null;
	    $scope.conditionConsole = false;
	    $scope.conditionShow = true;
	    //单选按钮组
	    $scope.conditionRadioRgn.radioModelArea = false;
		$scope.conditionRadioClass.radioModelClass = false;
		$scope.org = [];
   };
}]);


