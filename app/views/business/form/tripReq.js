/**
 * @author hejianfeng
 * @date 2014/12/23
 */
app.controller('tripReqCtrl', ['$scope', '$http','$stateParams','$filter','$rootScope', '$state', '$modal','workflowService',
                               'clearingFormService','expensePrjService','taxExpensePrjService',
    function($scope,$http,$stateParams,$filter,$rootScope,$state,$modal,workflowService, 
    		clearingFormService, expensePrjService, taxExpensePrjService) {
	$scope.tripPeerInfo = [];
	$scope.temp = {fileAppendixList:[]};
	$scope.isLoan = true;
    
	$scope.adrListID = [];			//存放唯一标识变量数组，用于解决中间添加地区显示问题
	$scope.isPlayApproveAudio = [];
	
	var getBudgetItemSelect = function(budgetItemId, list){
		for(var idx=0; idx<list.length; idx++){
			if(budgetItemId == list[idx].KEY){
				return idx;
			}
		}
	};
	//初始化页面（如果是从草稿进入需要访问数据库查询信息，如果是新建出差单则初始化对象，不需要访问数据库）
	if($stateParams.ID){
		$http.post('/service/trip!queryOldTripPageInfo?ID='+$stateParams.ID).success(function(data) {
	        if(data.obj.approveInfoList){
	        	$scope.approveInfoList = data.obj.approveInfoList;
	        }
	        $scope.TripReq = data.obj.TripReq;
	        //初始化项目分摊下标，带回数据
	        if(data.obj.TripReq.expensePrjList && data.obj.exeBudgetList){
		        for(var i=0; i<data.obj.TripReq.expensePrjList.length;i++){
		        	var budgetItemId = data.obj.TripReq.expensePrjList[i].BUDGET_ITEM_ID;
		        	expensePrjService.budgetItemSelectIndex[i] = getBudgetItemSelect(budgetItemId, data.obj.exeBudgetList[i].OPTION_LIST);
		        }
	        }
//	      //初始化借款分摊下标，带回数据
//	        if(data.obj.TripReq.expensePrjListLoan && data.obj.exeBudgetListLoan){
//		        for(var i=0; i<data.obj.TripReq.expensePrjListLoan.length;i++){
//		        	var budgetItemId = data.obj.TripReq.expensePrjListLoan[i].BUDGET_ITEM_ID;
//		        	taxExpensePrjService.budgetTaxItemSelectIndex[i] = getBudgetItemSelect(budgetItemId, data.obj.exeBudgetListLoan[i].OPTION_LIST);
//		        }
//	        }
	        if($scope.TripReq.tripReqMap.TRIP_REQ_STATE == 'BACK'){
	        	$scope.stateParam = true;
	        }
	        expensePrjService.getOldExpensePrjInfo(data.obj.TripReq.expensePrjList,data.obj.exeBudgetList);
			taxExpensePrjService.getOldTaxExpensePrjInfo(data.obj.TripReq.expensePrjListLoan,data.obj.exeBudgetListLoan);
	        for(var i=0;i<$scope.TripReq.tripPeerList.length;i++){
	        	$scope.tripPeerInfo.push($scope.TripReq.tripPeerList[i].staffInfo);
	        	delete $scope.TripReq.tripPeerList[i].staffInfo;
	        }
	        $scope.temp.fileAppendixList = $scope.TripReq.fileAppendixList;
	        $scope.TripReq.fileAppendixList = [];
			for(var i=0;i<$scope.temp.fileAppendixList.length;i++){
				$scope.TripReq.fileAppendixList.push($scope.temp.fileAppendixList[i].ID);
			}
	        generalID($scope.TripReq.tripReqAdrList);
	        if(!$scope.TripReq.expensePrjListLoan){
	        	$scope.TripReq.expensePrjListLoan = [];
	        }
	        if($scope.TripReq.tripReqMap.LOAN_IF == "FALSE"){
	        	$scope.TripReq.clearingFormList = [{
        			LOAN_SCHEMA:"",//定额借款
        			PAYMENT_TYPE:"",//支付类型
					ACCOUNT_NAME:"",//账号名
					ACCOUNT_NO:"",//账号
					BANK_NAME:"",//开户行
					PAY_AMT:"",//支付金额
					MEMO:""//备注
	        	}];
	        }else{
	        	$scope.isTaxType = 'ZZS';
	        }
	        $scope.clearingFormList = $scope.TripReq.clearingFormList;
	        $scope.clearingFormList.SCHEMA = true;
	        clearingFormService.moveGetOldClearingForm($scope.TripReq.clearingFormList);
	        clearingFormService.getOldClearingForm($scope.TripReq.tripReqMap.ESTIMATE_COST,0);
	        if(data.obj.deploy.isCalFirstDay=='ADD'){
	        	$scope.TripReq.isCalFirstDay = true;
	        }
//	        $http.post('/service/trip!getIsCalFirstDay').success(function(data) {
//				console.info(data);
//				if(data.obj == "ADD"){
//					$scope.TripReq.isCalFirstDay = true;
//				}
//				
//			});
	    });
	}else{
		$scope.stateParam = false;
			$scope.TripReq = {
				tripReqMap :{
					LOAN_IF : 'FALSE',
					LOAN_AMT : '',
					ESTIMATE_COST : "",
					TRIP_MEMO : "",
					TRIP_PRJ_IF : "TRUE",
				},
				tripReqAdrList : [{
					TRIP_DEST:"",
					TRIP_PRJ_IF:"TRUE",
					TRIP_END:null,
					TRIP_DAYS:"",
					TRIP_START:null,
					TRIP_SOURCE:""
				}],
				tripPeerList : [],
				expensePrjList:[],
				clearingFormList:[{
					LOAN_SCHEMA:"FIXED",//定额借款
					PAYMENT_TYPE:"",//支付类型
					ACCOUNT_NAME:"",//账号名
					ACCOUNT_NO:"",//账号
					BANK_NAME:"",//开户行
					PAY_AMT:"",//支付金额
					MEMO:""//备注
				}],
				expensePrjListLoan:[],
				fileAppendixList : [],//附件List
				isCalFirstDay:false,
			};
			generalID($scope.TripReq.tripReqAdrList);
			$http.post('/service/trip!getDeploy').success(function(data) {
				if(data.obj.isCalFirstDay == "ADD"){
					$scope.TripReq.isCalFirstDay = true;
				}
				if(data.obj.ADDR){
					var temp = data.obj.ADDR.substring(0,4)+"0000";
					$scope.TripReq.tripReqAdrList[0].TRIP_SOURCE = temp;
				}
				
			});
			$scope.clearingFormList = $scope.TripReq.clearingFormList;
			$scope.clearingFormList.SCHEMA =true;
	};

	//添加出差地区方法
		$scope.destCount = 0;
		$scope.addDest = function(index) {
	    	$scope.TripReq.tripReqAdrList.splice(index+1, 0,
		    	{	TRIP_DEST:"",
					TRIP_PRJ_IF:"TRUE",
					TRIP_END:null,
					TRIP_DAYS:"",
					TRIP_START:null,
					TRIP_SOURCE:""
				});
	    	generalID($scope.TripReq.tripReqAdrList);
	    	$scope.destCount++;
		};
		//减少出差地区方法
	    $scope.reduceDest = function(index) {
	    	if($scope.TripReq.tripReqAdrList.length>1){
	    		if(index == 0){
	    			var tempSource = $scope.TripReq.tripReqAdrList[0].TRIP_SOURCE;
	    			var tempStart = $scope.TripReq.tripReqAdrList[0].TRIP_START;
	    			$scope.TripReq.tripReqAdrList.splice(0, 1);
	    			$scope.TripReq.tripReqAdrList[0].TRIP_SOURCE = tempSource;
	    			$scope.TripReq.tripReqAdrList[0].TRIP_START = tempStart;
	    		}else{
	    		$scope.TripReq.tripReqAdrList.splice(index, 1);
	    		}
	    		$scope.adrListID.splice(index, 1);
		    	$scope.destCount--;
	    	}
	    	$scope.calDays();
	    };
	    //是否借款的切换方法
	  	$scope.showLoan = function(){
	  		if($scope.TripReq.tripReqMap.LOAN_IF=='TRUE'){
	  			$scope.isTaxType = 'PS';
	  			$scope.TripReq.tripReqMap.LOAN_IF='FALSE';
	  		}else if($scope.TripReq.tripReqMap.LOAN_IF=='FALSE'){
	  			$scope.isTaxType = 'ZZS';
	  			$scope.TripReq.tripReqMap.LOAN_IF='TRUE';
	  			$scope.TripReq.tripReqMap.LOAN_AMT = 0;
	  		}
	    };
		//数据整理方法
		var arrangeData = function(state){
			$scope.TripReq.tripPeerList = [];
			$scope.TripReq.destList = [];
			for(var i=0;i<$scope.tripPeerInfo.length;i++){
				$scope.TripReq.tripPeerList.push({STAFF_ID:""});
				$scope.TripReq.tripPeerList[i].STAFF_ID = $scope.tripPeerInfo[i].ID;
			}
	    	if($scope.TripReq.tripReqAdrList.length>0){
	    		$scope.TripReq.destList[0] = $filter('convertRegionFilter')($scope.TripReq.tripReqAdrList[0].TRIP_DEST);
	    		for(var i=1;i<$scope.TripReq.tripReqAdrList.length;i++){
	    			$scope.TripReq.tripReqAdrList[i].TRIP_SOURCE = $scope.TripReq.tripReqAdrList[i-1].TRIP_DEST;
	    			$scope.TripReq.destList[i] = $filter('convertRegionFilter')($scope.TripReq.tripReqAdrList[i].TRIP_DEST);
		    	}
	    		generalID($scope.TripReq.tripReqAdrList);
	    	}
	    	if($scope.TripReq.clearingFormList.length>0){
	    		for(var i=1;i<$scope.TripReq.clearingFormList.length;i++){
	    			$scope.TripReq.clearingFormList[i].LOAN_SCHEMA = $scope.TripReq.clearingFormList[i-1].LOAN_SCHEMA;
	    		}
	    	}
	    	$scope.TripReq.expensePrjList = expensePrjService.expensePrjList;
//	    	$scope.TripReq.expensePrjListLoan = taxExpensePrjService.taxExpensePrjList;
//	    	$scope.TripReq.tripReqMap.LOAN_AMT = taxExpensePrjService.apportionAmtCost;//TODO 何健锋---要作修改
		};
		
		//数据校验方法
		var dataValidate = function(){
			//项目分摊为空
			if(!$scope.TripReq.expensePrjList || $scope.TripReq.expensePrjList.length==0){
				swal("请填写项目分摊！", "", "error");
				return false;
			}
			if($scope.TripReq.tripReqMap.ESTIMATE_COST==0){
				swal("预计费用不能为零！", "", "error");
				return false;
			}
			if($scope.TripReq.tripReqMap.ESTIMATE_COST!=parseFloat(getExpensePrjAmt())){
				swal("预计费用与费用分摊总计不相等！", "", "error");
				return false;
			}
			if($scope.TripReq.tripReqMap.LOAN_IF=='TRUE' && $scope.TripReq.tripReqMap.LOAN_AMT==0){
				swal("借款金额不能为零！", "", "error");
				return false;
			}
			if($scope.TripReq.tripReqMap.LOAN_IF=='TRUE'){
				for(var i=0;i<$scope.TripReq.clearingFormList.length;i++){
					if($scope.TripReq.clearingFormList[i].PAYMENT_TYPE==''){
						swal("请选择支付方式！", "", "error");
						return false;
					}else if($scope.TripReq.clearingFormList[i].PAYMENT_TYPE!='CASH' &&	$scope.TripReq.clearingFormList[i].PAYMENT_TYPE!='CHECK'){
						if($scope.TripReq.clearingFormList[i].ACCOUNT_NAME==''){
							swal("请输入账户名！", "", "error");
							return false;
						}else if($scope.TripReq.clearingFormList[i].ACCOUNT_NO==''){
							swal("请输入支付账号！", "", "error");
							return false;
						}else if($scope.TripReq.clearingFormList[i].BANK_NAME==''){
							swal("请输入开户行！", "", "error");
							return false;
						}
					}
				}
			}
			if($scope.TripReq.tripReqMap.LOAN_AMT!=parseFloat(getClearingFormAmt())){
				swal("借款金额与支付金额不相等！", "", "error");
				return false;
			}
			return true;
		};
		
		//
		$scope.isSave=false;
		
		//暂存功能
		$scope.saveTrip = function(){
			arrangeData();
			swal({
				  title: "确定保存？",
				  text: "",
				  type: "warning",
				  showCancelButton: true,
				  confirmButtonColor: "#DD6B55",
				  confirmButtonText: "确定",
				  cancelButtonText: "取消",
				  closeOnConfirm: true
				},
				function(){
					$scope.isSave=true;
					$scope.TripReq = JSON.stringify($scope.TripReq);
					$http.post('/service/trip!saveTripReq',{'TripReq':$scope.TripReq}).success(function(data) {
						if(data.success){
							$state.go('app.fm.personnel.trip.tripList');
							swal("保存成功", "", "success");
						}else{
							swal("保存失败", "请确认填写正确", "error");
							$scope.TripReq = JSON.parse($scope.TripReq);
						}
					});
				});
		};
		//提交功能
	    $scope.commitTrip = function(){
	    	arrangeData();
    		if(!dataValidate()){
    			return;
    		}
	    	
	    	$scope.TripReq = JSON.stringify($scope.TripReq);
			$scope.paramWorkflow = {
					"TripReq" : $scope.TripReq,
					"PROCESS_ID" : "Trip_Req"
			};
			workflowService.submitWorkflow("trip",$scope.paramWorkflow,"app.fm.personnel.trip.tripList",function(){
				$scope.isSave=true;
			});
			$scope.TripReq = JSON.parse($scope.TripReq);
			
	    };
	    //放弃按钮的功能（返回）
	    $scope.back = function(){
			swal({
				  title: "确定放弃？",
				  text: "放弃后将回退到上一个页面！",
				  type: "warning",
				  showCancelButton: true,
				  confirmButtonColor: "#DD6B55",
				  confirmButtonText: "确定",
				  cancelButtonText: "取消",
				  closeOnConfirm: true
				},
				function(){
					$state.go('app.fm.personnel.trip.tripList');
				});
		};
		//计算出差天数
		$scope.calDays = function(){
			for(var index=0;index<$scope.TripReq.tripReqAdrList.length;index++){
				if(index>0){
		    		$scope.TripReq.tripReqAdrList[index].TRIP_START = $scope.TripReq.tripReqAdrList[index-1].TRIP_END;
		    	}
				$scope.TripReq.tripReqAdrList[index].TRIP_START = $filter('date')($scope.TripReq.tripReqAdrList[index].TRIP_START,'yyyy-MM-dd');
				$scope.TripReq.tripReqAdrList[index].TRIP_END = $filter('date')($scope.TripReq.tripReqAdrList[index].TRIP_END,'yyyy-MM-dd');
				var days = calTripDays($scope.TripReq.tripReqAdrList[index],index,$scope.TripReq.isCalFirstDay);
				$scope.TripReq.tripReqAdrList[index].TRIP_DAYS = days;
			}
		};
		//增加天数
		$scope.addDays = function(index){
			$scope.TripReq.tripReqAdrList[index].TRIP_DAYS++;
		};
		//减少天数
		$scope.reduceDays = function(index){
			if($scope.TripReq.tripReqAdrList[index].TRIP_DAYS>0){
				$scope.TripReq.tripReqAdrList[index].TRIP_DAYS--;
			}
		};
		
	    //计算预计总费用（出差单对应的项目分摊的费用分摊总额）
	    $scope.calEstimateCost = function(){
	    	if($scope.TripReq && $scope.TripReq.expensePrjList){
	    		var temp = $scope.TripReq.expensePrjList;
		    	var sum = 0 ;
		    	for(var i=0;i<temp.length;i++){
		    		if(!isNaN(parseFloat(temp[i].PRJ_APPORTION_AMT))){
		    			sum += parseFloat(temp[i].PRJ_APPORTION_AMT);
		    		}else{
		    			temp[i].PRJ_APPORTION_AMT = "0";
		    		}
		    	}
		    	$scope.TripReq.tripReqMap.ESTIMATE_COST = sum;
		    	return $scope.TripReq.tripReqMap.ESTIMATE_COST;
	    	}
	    };
	  //获取上传的文件信息
	   	$scope.getFile = function(file){
	   		$scope.TripReq.fileAppendixList.push(file.ID);
	   		$scope.temp.fileAppendixList.push(file);
	   	};
	  //删除文件信息
	   	$scope.removeFile = function(file){
	   		for(var i = 0; i < $scope.TripReq.fileAppendixList.length; i++){
	   			var val = $scope.TripReq.fileAppendixList[i];
	   			if(val.ID == file.ID){
	   				$scope.TripReq.fileAppendixList.splice(i,1);
	   				$scope.temp.fileAppendixList.splice(i,1);
	   			}
	   		}
	   	};
	  //获取项目分摊总金额
		  var getExpensePrjAmt = function(){
			  return expensePrjService.apportionAmtCost;
		  };
		//获取结算方式总金额
		  var getClearingFormAmt = function(){
			  if($scope.TripReq.tripReqMap.LOAN_IF=='FALSE'){
				  return 0;
			  }else if($scope.TripReq.tripReqMap.LOAN_IF=='TRUE'){
				  return clearingFormService.countClearingAmt;
			  }
		  };
		//计算支付金额
		$scope.countPayAmt = function(){
			clearingFormService.countPayAmt($scope.TripReq.tripReqMap.LOAN_AMT, 0);
		};
		
		//计算项目分摊金额
		$scope.prjCountPayAmt = function(){
			clearingFormService.prjCountPayAmt($scope.TripReq.tripReqMap.ESTIMATE_COST);
		}
		  //删除培训报销单
		    $scope.deleteTripReq = function(){
		    	if($stateParams.ID){
		    		swal({
						  title: "确定删除？",
						  text: "",
						  type: "warning",
						  showCancelButton: true,
						  confirmButtonColor: "#DD6B55",
						  confirmButtonText: "确定",
						  cancelButtonText: "取消",
						  closeOnConfirm: true
						},
						function(){
							$http.post('/service/trip!deleteTripReqById',{'ID':$stateParams.ID,'STATE':$scope.TripReq.tripReqMap.TRIP_REQ_STATE}).success(function(data) {
								if(data.success){
									$state.go('app.fm.personnel.trip.tripList');
									swal("删除成功", "", "success");
								}else{
									swal("删除失败", "", "error");
								}
							});
						});
		    	}
		    };
		    //删除出差同行人
		    $scope.reduceTripPeer = function(index){
		    	$scope.tripPeerInfo.splice(index,1);
		    };
	    
	    /************************************************/
		//根据地区表长度，生成对应唯一标识id，即使地区
		function generalID(regionList){
			for(var i=0; i<regionList.length; i++)
				$scope.adrListID[i] = new UUID();
		}
}]);
