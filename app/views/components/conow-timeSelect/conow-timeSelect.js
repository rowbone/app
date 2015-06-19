app.directive('conowDateSelet',function(){
    return {
        restrict : 'AE',
        template : function(e,a){
        	return '<div ng-transclude ng-click="open()"></div>';
        },
        transclude : true,
        scope:{
        	startDate : '=startDate',
        	endDate :'=endDate',
        	minDate:'=minDate',
        	maxDate:'=maxDate',
        	dateInit:'@dateInit',
        	chooseType:'=chooseType'
        },
        controller :function($scope,$attrs,$http,$timeout,conowModals){
        	$scope.comfBtn_show = false;
        	$scope.comfBtn_disabled = false;
        	$scope.halfDayChoose=  false;
        	$scope.singleTime = false;
        	$scope.format = "YYYY-MM-DD hh:mm:ss";
        	if($attrs.comfBtn){
        		$scope.comfBtn_show = true;
        		if($scope.chooseType == undefined){
        			$scope.chooseType = {startDate:{type:''},endDate:{type:''}}
        		}
        	}
        	if($attrs.halfDayChoose){
        		$scope.halfDayChoose= true;
        	}
        	if($attrs.format){
        		$scope.format = $attrs.format;
        	}
        	if($attrs.singleTime){
        		$scope.singleTime = true;
        	}
        	var minDate = '1970-01-01';
        	var maxDate = '2500-12-12';
        	
        	
        	/**
        	 * 复制时间
        	 */
        	$scope.copyDate= function(){
        		if($scope.minDate&&$scope.minDate!=""){
        			minDate = $scope.minDate;
        		}else{
        			minDate = '1970-01-01';
        		}
        		if($scope.maxDate&&$scope.maxDate!=""){
        			maxDate = $scope.maxDate;
        		}else{
        			 maxDate = '2500-12-12';
        		}
        		if($attrs.dateInit&&!$scope.startDate){
            		$scope.startDate = $scope.dateInit;
        		}
        		
        		if(!$scope.startDate){
            		$scope.dirStartDate  = new Date().parseStr("YYYY-MM-DD hh:mm:ss");
            	}else{
            		if((typeof $scope.startDate)=='string'){
            			$scope.dirStartDate = $scope.startDate;
            		}
            		$scope.dirStartDate = $scope.startDate.parseStr("YYYY-MM-DD hh:mm:ss");
            	}
            	
            	if(!$scope.endDate){
            		$scope.dirEndDate  = new Date().parseStr("YYYY-MM-DD hh:mm:ss");
            	}else{
            		if((typeof $scope.startDate)=='string'){
            			$scope.dirEndDate = $scope.endDate;
            		}
            		$scope.dirEndDate = $scope.endDate.parseStr("YYYY-MM-DD hh:mm:ss");
            	}
        	}
        	
        	/**
        	 * 打开弹出框
        	 */
        	$scope.open = function () {
        		$scope.copyDate();
        	      var modalInstance = conowModals.open({
        	        templateUrl: 'js/directives/conow-timeSelect/selectDate.html',
        	        controller: 'calChose_con',
        	        size: 'md',
        	        title: '时间控件',
        	        resolve: {
        	        	type:function(){
        	        		return {
        	        			'startDate':$scope.dirStartDate,
        	        			 'endDate':$scope.dirEndDate,
        	        			 'showCon':$scope.comfBtn_show,
        	        			 'disabledCon':$scope.comfBtn_disabled,
        	        			 'halfDayChoose':$scope.halfDayChoose,
        	        			 'chooseType':$scope.chooseType,
        	        			 'singleTime':$scope.singleTime,
        	        			 'format':$scope.format,
        	        			 'minDate':minDate,
        	        			 'maxDate':maxDate
        	        		};
        	        	}
        	        }
        	      });
        	      //------------------------------关闭dialog的回调函数----------------------------
        	      modalInstance.result.then(function (modalObj) {//确定时调用此方法
        	    		  $scope.startDate = modalObj.OBJ.startDate;
        	    	  if($scope.singleTime==false){
        	    		  $scope.endDate = modalObj.OBJ.endDate;
        	    	  }
        	    	  
        	    	  if($scope.halfDayChoose){
        	    		  $scope.chooseType = modalObj.AMPM;
        	    	  }
        	      }, function () {//取消时调用此方法
        	    	  
        	      });
        	 };
        }
    }
});






app.directive('conowTimeSelet',function(){
    return {
        restrict : 'AE',
        template : function(e,a){
        	return '<div ng-transclude ng-click="open()"></div>';
        },
        transclude : true,
        scope:{
        	time : '=time',
        	exDate:'=exDate',
        	minTime:'=minTime',
        	maxTime:'=maxTime'
        },
        controller :function($scope,$attrs,$http,$timeout,$modal){
        	$scope.format = "YYYY-MM-DD hh:mm:ss";
        	if($attrs.format){
        		$scope.format = $attrs.format;
        	}
       
        	var exDate = '';
        	var minTime = '00:00';
        	var maxTime = '23:59';
        	//设置前缀
        	$scope.figureExDate = function(){
        		
        		if($scope.exDate){
            		if((typeof $scope.exDate)=='string'){
            			exDate = $scope.exDate.substr(0,10);
            		}else{
            			exDate = $scope.exDate.parseStr("YYYY-MM-DD");
            		}
            	}else{
            		if(!$scope.time){
            			exDate = new Date().parseStr("YYYY-MM-DD");
            			return;
            		}
            		
            		if((typeof $scope.time)=='string'){
            			$scope.time = $scope.time.trim();
            			if($scope.time.length==5){
            				exDate = new Date().parseStr("YYYY-MM-DD");
            			}else{
            				exDate = $scope.time.substr(0,10);
            			}
            		}else{
            			exDate = $scope.time.parseStr("YYYY-MM-DD");
            		}
            	};
            	
        	}
        	
        	$scope.open = function () {
        		if($scope.minTime){
        			minTime = $scope.minTime;
        		}
        		if($scope.maxTime){
        			maxTime = $scope.maxTime;
        		}
        		$scope.figureExDate();
        	      var modalInstance = $modal.open({
        	        templateUrl: 'js/directives/conow-timeSelect/TimeSelect.html',
        	        controller: 'setTime_con',
        	        size: 'sm',
        	        resolve: {
        	        	type:function(){
        	        		return {
        	        			'TIME':$scope.time,
        	        			'minTime':minTime,
        	        			'maxTime':maxTime
        	        		};
        	        	}
        	        }
        	      });
        	      //------------------------------关闭dialog的回调函数----------------------------
        	      modalInstance.result.then(function (modalObj) {//确定时调用此方法
        	    	  
        	    		  $scope.time = (exDate+" "+modalObj.OBJ.time+":00").parseToDate().parseStr($scope.format); 
        	      }, function () {//取消时调用此方法
        	    	  
        	      });
        	 };
        }
    }
});




//开始时间控制器
app.controller('setTime_con', ['$scope','$http','$location', '$modalInstance','$state','type', 
       	function($scope,$http,$location,$modal, $state,type) {
		//初始化设置
		var splicTime = ""; 
		var timeNow = type.TIME;
		var minTime = type.minTime;
    	var maxTime = type.maxTime;
    	var limitMaxs = [maxTime[0],maxTime[1],maxTime[3],maxTime[4]];
    	var limitMins = [minTime[0],minTime[1],minTime[3],minTime[4]];
    	console.info('console.info',limitMaxs,limitMins);
		//判断是否有时间
		if(!timeNow){
			timeNow = new Date().parseStr("YYYY-MM-DD hh:mm:ss");
		}
		 if((typeof timeNow)=='string'){
			timeNow = timeNow.trim();
			if(timeNow.length==5){
				splicTime = timeNow[0]+timeNow[1]+timeNow[3]+timeNow[4];
			}else if(timeNow.length==16){
				splicTime =  (timeNow+":00").parseToDate().parseStr('hhmm');
			}else{
				splicTime = timeNow.parseToDate().parseStr('hhmm');
			}
		}else{
			splicTime = timeNow.parseStr('hhmm');
		}
		$scope.modalObj = {
				
		};
		$scope.modalObj.OBJ = {};
		
		$scope.inp = []
		$scope.inp[0] = {
			'num':splicTime[0],
			'state':true
		};
		$scope.inp[1] = {
			'num':splicTime[1],
			'state':false
		};
		$scope.inp[2] = {
			'num':splicTime[2],
			'state':false
		};
		$scope.inp[3] = {
			'num':splicTime[3],
			'state':false
		};
		
		
		$scope.changeInp = function(index){
			for(var i = 0;i<$scope.inp.length;i++){
					$scope.inp[i].state = false;
			}
			$scope.inp[index].state = true;
			$scope.changeColor();
		};
		
		$scope.setInp = function(num){
			if($scope.clickNum[num].gray == false){
				for(var i = 0;i<$scope.inp.length;i++){
					if($scope.inp[i].state==true){
						$scope.inp[i].num = num;
						$scope.inp[i].state = false;
						$scope.inp[(i+4+1)%4].state = true;
						break;
					}
				}
				$scope.changeColor();
			}else{
				return;
			}
		};
		
		$scope.clickNum = [];
		$scope.clickNum[0] = {
				'blue':false,
				'gray':true
		};
		$scope.clickNum[1] = {
				'blue':false,
				'gray':true
		};
		$scope.clickNum[2] = {
				'blue':false,
				'gray':true
		};
		$scope.clickNum[3] = {
			'blue':false,
			'gray':true
		};
		$scope.clickNum[4] = {
			'blue':false,
			'gray':true
		};
		$scope.clickNum[5] = {
			'blue':false,
			'gray':true
		};
		$scope.clickNum[6] = {
			'blue':false,
			'gray':true
		};
		$scope.clickNum[7] = {
			'blue':false,
			'gray':true
		};
		$scope.clickNum[8] = {
			'blue':false,
			'gray':true
		};
		$scope.clickNum[9] = {
			'blue':false,
			'gray':true
		};
		
		//初始化键盘
		for(var i = 0;i<3;i++){
			if(i<=limitMaxs[0]&&i>=limitMins[0]){
				$scope.clickNum[i].blue = true;
				$scope.clickNum[i].gray = false;
			}
		}
		
		/**
		 * 改变颜色
		 */
		$scope.changeColor = function(){
			for(var i = 0;i<$scope.clickNum.length;i++){
				$scope.clickNum[i].blue = false;
				$scope.clickNum[i].gray = true;
			}
			if($scope.inp[0].state == true){
				for(var b = 0;b<3;b++){
					if(b<=limitMaxs[0]&&b>=limitMins[0]){
						$scope.clickNum[b].blue = true;
						$scope.clickNum[b].gray = false;
					}
				}
			}
			if($scope.inp[1].state == true && $scope.inp[0].num == 2){
				for(var b = 0;b<4;b++){
					var tempTime  = $scope.inp[0].num+''+b;
					var tempLimtMax = limitMaxs[0]+''+limitMaxs[1];
					var tempLimtMin = limitMins[0]+''+limitMins[1];
					if(tempTime<=tempLimtMax&&tempTime>=tempLimtMin){
						$scope.clickNum[b].blue = true;
						$scope.clickNum[b].gray = false;
					}
				}
			}else if($scope.inp[1].state == true && $scope.inp[0].num != 2){
				for(var b = 0;b<10;b++){
					var tempTime  = $scope.inp[0].num+''+b;
					var tempLimtMax = limitMaxs[0]+''+limitMaxs[1];
					var tempLimtMin = limitMins[0]+''+limitMins[1];
					if(tempTime<=tempLimtMax&&tempTime>=tempLimtMin){
						$scope.clickNum[b].blue = true;
						$scope.clickNum[b].gray = false;
					}
				}
			}
			
			var tempHourTime  = $scope.inp[0].num+''+$scope.inp[1].num;
			var tempHourLimtMax = limitMaxs[0]+''+limitMaxs[1];
			var tempHourLimtMin = limitMins[0]+''+limitMins[1];
			var flag = false;
			if(tempHourTime<tempHourLimtMax){
				flag = true;
			}
			if($scope.inp[2].state == true){
				for(var b = 0;b<6;b++){
					var tempTime  = b;
					var tempLimtMax = limitMaxs[2];
					var tempLimtMin = limitMins[2];
					if(flag){
						$scope.clickNum[b].blue = true;
						$scope.clickNum[b].gray = false;
					}else if(tempTime<=tempLimtMax&&tempTime>=tempLimtMin){
						$scope.clickNum[b].blue = true;
						$scope.clickNum[b].gray = false;
					}
				}
			}
			if($scope.inp[3].state == true){
				
				for(var b = 0;b<10;b++){
					var tempTime  = $scope.inp[2].num+''+b;
					var tempLimtMax = limitMaxs[2]+''+limitMaxs[3];
					var tempLimtMin = limitMins[2]+''+limitMins[3];
					if(flag){
						$scope.clickNum[b].blue = true;
						$scope.clickNum[b].gray = false;
					}else if(tempTime<=tempLimtMax&&tempTime>=tempLimtMin){
						$scope.clickNum[b].blue = true;
						$scope.clickNum[b].gray = false;
					}
				}
			}
		}
		
		$scope.ok = function(){
			var time = ''+$scope.inp[0].num+$scope.inp[1].num+':'+$scope.inp[2].num+$scope.inp[3].num;
			$scope.modalObj.OBJ.time = time;
			$modal.close($scope.modalObj);
		};
		
	
		
}]);





//日期选择
app.controller('calChose_con', 
       function($scope, $http,$location,$conowModalInstance,$rootScope, $state,type,dateHandleServ) {
	console.info('TYPE----',type);
	//初始化配置信息
	$scope.chooseDay = type.startDate;
	$scope.comfBtn_show = type.showCon;
	$scope.comfBtn_disabled = type.comfBtn_disabled;
	$scope.halfDayChoose = type.halfDayChoose;
	$scope.chooseType = type.chooseType;
	$scope.singleTime = type.singleTime;
	$scope.format = type.format;
	$scope.minDate= type.minDate;
	$scope.maxDate= type.maxDate;
	//预设模型对象
	$scope.modalObj = {};
	$scope.modalObj.TYPE = 'setNoAllDayDate'; 
	$scope.modalObj.OBJ = {};
	$scope.modalObj.AMPM = $scope.chooseType;
	//结尾时间后缀(为了与时间控件结合)
	$scope.endTimeType = "00:00:00"; 
	/**
	 * 判断是否有初值
	 */
	if(type.startDate){
		$scope.modalObj.OBJ.startDate =  type.startDate.parseToDate().parseStr($scope.format);
	}else{
		$scope.modalObj.OBJ.startDate = '';
	}
	if(type.endDate&&$scope.singleTime==false){
		$scope.endTimeType = type.endDate.parseToDate().parseStr("hh:mm:ss");
		$scope.modalObj.OBJ.endDate =  type.endDate.parseToDate().parseStr($scope.format);
	}else{
		$scope.modalObj.OBJ.endDate = '';
	}

	
	
	//初始化点击事件(次数)
	$scope.clickCount = 0;
	
	console.info('this is choose',type,	$scope.modalObj.OBJ)
	$scope.calendarArrays = [];
	if(type.startDate){
		$scope.currentMonth = type.startDate.parseToDate();
		$scope.currentDate =  type.startDate;
	}else{
		$scope.currentMonth = new Date();
		$scope.currentDate =  new Date();
	}
	$scope.calendarObj = {
		'DATE':'2015-04-22',
		'SYS_SCHED':[],
		'WORK_SCHED':[],
		'PRI_SCHED':[]
	};
	var cal_config = localStorage.getItem($rootScope.userInfo.ID+'_cal_config');
	if(cal_config){
		cal_config = JSON.parse(cal_config);
		$scope.color = cal_config.color;
		$scope.colorChange = cal_config.colorChange;
		$scope.DateShowCheck = cal_config.DateShowCheck;
		$scope.isShowLunar = cal_config.isShowLunar;
	}else{
		$scope.color = {
				'FEST_SCHED':'#ED5564',
				'SYS_SCHED':'#F7A67B',
				'WORK_SCHED':'#B8DA8D',
				'PRI_SCHED':'#22C8B2'	
		};
		
		$scope.colorChange = {//支持改变的原颜色
				'FEST_SCHED':'#ED5564',
				'SYS_SCHED':'#F7A67B',
				'WORK_SCHED':'#B8DA8D',
				'PRI_SCHED':'#22C8B2'	
		};
		
		$scope.DateShowCheck = {
				'FEST':true,
				'SYS':true,
				'PUB':true,
				'PRI':true	
		};
		cal_config = {};
		cal_config.color = $scope.color; 
		cal_config.colorChange = $scope.colorChange;
		cal_config.isShowLunar = true;
		cal_config.DateShowCheck = $scope.DateShowCheck;
		localStorage.setItem($rootScope.userInfo.ID+"_cal_config",JSON.stringify(cal_config));
	}
	$scope.TYPE = {
			'FEST':'FEST_SCHED',
			'SYS':'SYS_SCHED',
			'PUB':'WORK_SCHED',
			'PRI':'PRI_SCHED'	
	};
	
	$scope.countChangeDate = function(date){
		console.info($scope.modalObj.OBJ.startDate);
		if(date>$scope.modalObj.OBJ.startDate){
			if(date>$scope.modalObj.OBJ.endDate){
				$scope.modalObj.OBJ.endDate = date;
			}else{
				$scope.modalObj.OBJ.startDate = date;
			}
		}else{
			
				$scope.modalObj.OBJ.startDate = date;
		}
		$scope.setChooseDateState($scope.modalObj.OBJ.startDate,$scope.modalObj.OBJ.endDate,$scope.modalObj.AMPM);
		
	};
	//选中的开始日期
	 $scope.chooseFirstDate = "";
	//选中的结束日期
	 $scope.chooseLastDate = "";
	//设置选择状态
	$scope.setChooseDateState = function(staDate,endDate,chooseType){
		//不给默认选中当天日期
		var currentDate = new Date().parseStr("YYYY-MM-DD hh:mm:ss");
		if(staDate == currentDate){
			staDate = "";
			endDate = "";
			$scope.modalObj.OBJ.startDate = "";
			$scope.modalObj.OBJ.endDate = "";
			$scope.daystate = false;
		};
		
		for(var i = 0; i<$scope.calendarArrays.length;i++){
			var row = $scope.calendarArrays[i];
			for(var j = 0;j<row.length;j++){
				row[j].CHOOSED = false;
				//全天状态
				row[j].ALLDAY = false;
				//上午状态
				row[j].AMDAY = false;
				//下午午状态
				row[j].PMDAY = false;
			
				if((row[j].DATE>=staDate&&row[j].DATE<=endDate)||(row[j].DATE==staDate)){
					/****有确定按钮并且设置了全天、上午、下午属性****/
					if($scope.comfBtn_show && $scope.halfDayChoose){
						row[j].ALLDAY = true;
						//全天状态
						$scope.ALLDay = true;
						//上午状态
						$scope.AMDay = false;
						//下午午状态
						$scope.PMDay = false;
						/*****开始时间****/
						if(row[j].DATE==staDate){
							$scope.show_pm = true;
							/**开始日期等于上午的时候**/
							if(chooseType.startDate.type == "am"){
								row[j].ALLDAY = false;
								row[j].AMDAY = true;
								row[j].PMDAY = false;
								$scope.ALLDay = false;
								$scope.AMDay =  true;
								$scope.PMDay = false;
								$scope.modalObj.AMPM.startDate = {type:'am'};
								/***结束日期不等于空的时候***/
								if(endDate !=""){
									row[j].ALLDAY = true;
									row[j].AMDAY = false;
									row[j].PMDAY = false;
									$scope.ALLDay = true;
									$scope.AMDay =  false;
									$scope.PMDay = false;
									$scope.modalObj.AMPM.startDate = {type:'all'};
								}
								/***开始和结束日期相等的时候***/
								if(staDate == endDate){
									row[j].ALLDAY = false;
									row[j].AMDAY = true;
									row[j].PMDAY = false;
									$scope.ALLDay = false;
									$scope.AMDay = true ;
									$scope.PMDay = false;
									$scope.modalObj.AMPM.startDate = {type:'am'};
								}
							/**开始日期等于下午的时候**/
							}else if(chooseType.startDate.type == "pm"){
								row[j].ALLDAY = false;
								row[j].AMDAY = false;
								row[j].PMDAY = true;
								$scope.ALLDay = false;
								$scope.AMDay =  false;
								$scope.PMDay = true;
								$scope.modalObj.AMPM.startDate = {type:'pm'};
							}else{
								/*默认全天*/
								row[j].ALLDAY = true;
								row[j].AMDAY = false;
								row[j].PMDAY = false;
								$scope.ALLDay = true;
								$scope.AMDay =  false;
								$scope.PMDay = false;
								$scope.modalObj.AMPM.startDate = {type:'all'};
							};
							/***在开始日期改变的时候**/
							if( $scope.chooseFirstDate !="" && $scope.chooseFirstDate != staDate){
								row[j].ALLDAY = true;
								row[j].AMDAY = false;
								row[j].PMDAY = false;
								$scope.ALLDay = true;
								$scope.AMDay = false;
								$scope.PMDay = false;
								$scope.modalObj.AMPM.startDate = {type:'all'};
							}
							 $scope.chooseFirstDate = staDate;
						}
						/*****结束时间*******/
						if(row[j].DATE.substr(0,10)==endDate.substr(0,10)){
							if(staDate != endDate){
								/*切换下午标签的显示状态*/
								$scope.show_pm = false;
								/**结束日期等于上午的时候**/
								if(chooseType.endDate.type == "am"){
									row[j].ALLDAY = false;
									row[j].AMDAY = true;
									row[j].PMDAY = false;
									$scope.AMDay = true;
									$scope.ALLDay = false;
									$scope.PMDay = false;
									$scope.modalObj.AMPM.endDate = {type:'am'};
								/**结束日期等于下午的时候**/
								}else if(chooseType.endDate.type == "pm"){
									row[j].ALLDAY = true;
									row[j].AMDAY = false;
									row[j].PMDAY = false;
									$scope.ALLDay = true;
									$scope.AMDay = false;
									$scope.PMDay = false;
									$scope.modalObj.AMPM.endDate = {type:'all'};
								}else{
									/*默认全天*/
									row[j].ALLDAY = true;
									row[j].AMDAY = false;
									row[j].PMDAY = false;
									$scope.ALLDay = true;
									$scope.AMDay =  false;
									$scope.PMDay = false;
									$scope.modalObj.AMPM.endDate = {type:'all'};
								};
							}
							/***在结束日期改变的时候**/
							if($scope.chooseLastDate !="" && $scope.chooseLastDate != endDate){
								row[j].ALLDAY = true;
								row[j].AMDAY = false;
								row[j].PMDAY = false;
								$scope.ALLDay = true;
								$scope.AMDay = false;
								$scope.PMDay = false;
								$scope.modalObj.AMPM.endDate = {type:'all'};
							}
							 $scope.chooseLastDate = endDate;
						}
						/******单选或者只选第一个日期的时候*****/
						if(endDate !=""){
							$scope.lastClickDate = endDate;
							$scope.clickedDate =  new Date(endDate.substr(0,10)).getDate() + "号";
						}else{
							$scope.lastClickDate = staDate;
							$scope.clickedDate =  new Date(staDate.substr(0,10)).getDate() + "号";
						}
						
					}
					row[j].CHOOSED = true;
				}
			}
		}
	}
	//开始时间结束时间排序
	$scope.sortDate = function(){
		var tempdate = '';
		if($scope.modalObj.OBJ.startDate>$scope.modalObj.OBJ.endDate){
			tempdate = $scope.modalObj.OBJ.startDate+"";
			$scope.modalObj.OBJ.startDate = $scope.modalObj.OBJ.endDate+"";
			$scope.modalObj.OBJ.endDate = tempdate+"";
		}
	}
	
	//有确定按钮的选择
	$scope.comfChoose = function(date){
		if($scope.singleTime==true){
			$scope.modalObj.OBJ.startDate = date;
			$scope.modalObj.OBJ.endDate = "";
			$scope.clickedDate =  new Date(date.substr(0,10)).getDate() + "号";
		}else{
			$scope.clickCount++;
			if($scope.clickCount==1){
				$scope.modalObj.OBJ.startDate = date;
			}else{
				$scope.modalObj.OBJ.endDate = date;
			}
			if($scope.modalObj.OBJ.startDate>$scope.modalObj.OBJ.endDate&&$scope.modalObj.OBJ.endDate!=""){
				if($scope.comfBtn_show && $scope.halfDayChoose){
					$scope.ALLDay = false;
					$scope.AMDay = false ;
					$scope.PMDay = false;
					$scope.modalObj.AMPM = {startDate:{type:'all'},endDate:{type:'all'}};
				}
				$scope.daystate = false;
				$scope.modalObj.OBJ.startDate = "";
				$scope.modalObj.OBJ.endDate = "";
				$scope.setChooseDateState($scope.modalObj.OBJ.startDate,$scope.modalObj.OBJ.endDate,$scope.modalObj.AMPM);
				$scope.clickCount = 0;
				return;
			}
		}
		$scope.setChooseDateState($scope.modalObj.OBJ.startDate,$scope.modalObj.OBJ.endDate,$scope.modalObj.AMPM);
		$scope.modalObj.OBJ.date = date;
	}
	
	//无确定按钮的选择
	$scope.noComfBtnChoose = function(date){
		//单选状态
		if($scope.singleTime==true){
			$scope.modalObj.OBJ.startDate = date;
			$scope.modalObj.OBJ.endDate = "";
			$scope.ok();
		}else{
		$scope.clickCount++;
		if($scope.clickCount==1){
			$scope.modalObj.OBJ.startDate = date;
		}else{
			$scope.modalObj.OBJ.endDate = date;
		}
		if(($scope.modalObj.OBJ.startDate>$scope.modalObj.OBJ.endDate&&$scope.modalObj.OBJ.endDate!="")&&($scope.clickCount==2)){
			$scope.modalObj.OBJ.startDate = "";
			$scope.modalObj.OBJ.endDate = "";
			$scope.setChooseDateState($scope.modalObj.OBJ.startDate,$scope.modalObj.OBJ.endDate);
			$scope.clickCount = 0;
			return;
		}
		//设置选中状态
		$scope.setChooseDateState($scope.modalObj.OBJ.startDate,$scope.modalObj.OBJ.endDate);
		$scope.modalObj.OBJ.date = date;
		if($scope.clickCount==2){
			$scope.modalObj.OBJ.endDate = ($scope.modalObj.OBJ.endDate.parseToDate().parseStr("YYYY-MM-DD ")+$scope.endTimeType).parseToDate().parseStr($scope.format)
			$scope.ok();
		}
		}
	}
	
	//选择后保存操作
	$scope.chooseDate = function(date){
		
		//判断是否在日期之外
		if(date.isClicked==false){
			return;
		}
		if($scope.comfBtn_show){
			//另一种体验方式：需要时可以打开
			/*if($scope.clickCount%2==0){
				$scope.modalObj.OBJ.endDate = date;
			}else{
				if(date>$scope.modalObj.OBJ.endDate){
					$scope.modalObj.OBJ.endDate = date;
				}else{
					$scope.modalObj.OBJ.startDate = date;
				}
			}
			if($scope.modalObj.OBJ.endDate<$scope.modalObj.OBJ.startDate){
				$scope.sortDate();
			}*/
			$scope.daystate = true;
			$scope.comfBtn_disabled = false;
			//点击计算开始结束时间
			$scope.comfChoose(date.DATE);
		}else{
			//点击计算开始结束时间
			$scope.noComfBtnChoose(date.DATE)
		}
		$scope.clickedDate =  new Date(date.DATE.substr(0,10)).getDate() + "号";
		$scope.lastClickDate = date.DATE;
		//$scope.countChangeDate(date);
		//$conowModalInstance.close($scope.modalObj);
	};
	
	
	$scope.ok = function(){
		$conowModalInstance.close($scope.modalObj);
	}
	$scope.daystate = true;
	//用于切换下午标签的状态
	$scope.show_pm = true;
	//选择全天
	$scope.allDay = function(date){
		if($scope.modalObj.OBJ.startDate == date){
			$scope.modalObj.AMPM.startDate = {type:'all'};
		}else if($scope.modalObj.OBJ.endDate == date){
			$scope.modalObj.AMPM.endDate = {type:'all'};
		};
		$scope.setChooseDateState($scope.modalObj.OBJ.startDate,$scope.modalObj.OBJ.endDate,$scope.modalObj.AMPM);
	}
	//选择上午
	$scope.amDay = function(date){
		if($scope.modalObj.OBJ.startDate == date){
			$scope.modalObj.AMPM.startDate = {type:'am'};
		}else if($scope.modalObj.OBJ.endDate == date){
			$scope.modalObj.AMPM.endDate = {type:'am'};
		};
		$scope.setChooseDateState($scope.modalObj.OBJ.startDate,$scope.modalObj.OBJ.endDate,$scope.modalObj.AMPM);
	}
	//选择下午
	$scope.pmDay = function(date){
		if($scope.modalObj.OBJ.startDate == date){
			$scope.modalObj.AMPM.startDate = {type:'pm'};
		}else if($scope.modalObj.OBJ.endDate == date){
			$scope.modalObj.AMPM.endDate = {type:'pm'};
		};
		$scope.setChooseDateState($scope.modalObj.OBJ.startDate,$scope.modalObj.OBJ.endDate,$scope.modalObj.AMPM);
	}
	//清除
	$scope.clear = function(){
		$scope.modalObj.OBJ.startDate = "";
		$scope.modalObj.OBJ.endDate = "";
		$scope.setChooseDateState($scope.modalObj.OBJ.startDate,$scope.modalObj.OBJ.endDatem,$scope.modalObj.AMPM);
		$scope.clickCount = 0;
		$scope.daystate = false;
		$scope.comfBtn_disabled = true;
	}
	
	  //初始化获取用户所有日程
	$scope.getSchedule = function(){
		$http.post('/service/scheduleItem!getMyScheduleListAndTime',{'START_TIME':$scope.startDate.parseStr('YYYY-MM-DD'),'END_TIME':$scope.endDate.parseStr('YYYY-MM-DD')})
		.success(function(data){
			if(data.success){
				console.info(data.obj);
				for(var i = 0; i<$scope.calendarArrays.length;i++){
					var row = $scope.calendarArrays[i];
					for(var j = 0;j<row.length;j++){
						for(var k = 0;k<data.obj.length;k++){
							var objDate = data.obj[k].START_TIME.substr(0,19).parseToDate().parseStr('YYYY-MM-DD');
							//console.info('obj',row[j],objDate);
							var objEndDate = data.obj[k].ENDING_TIME.substr(0,19).parseToDate().parseStr('YYYY-MM-DD');
							//console.info('obj',row[j],objDate);
							if(objDate<=row[j].DATE&&objEndDate>=row[j].DATE){
								row[j][$scope.TYPE[data.obj[k].TYPE]].push(data.obj[k]);
								row[j].SCHEDS.push(data.obj[k]);
							}
						}
					}
				}
			}
		});
	};
	
	
	/**
	 * 调用下一个月
	 */
	$scope.calNextMonthAllDay = function(){
		if(( typeof $scope.currentMonth) == 'string'){
			$scope.currentMonth = $scope.currentMonth.parseToDate();
		}
		$scope.currentMonth.setMonth($scope.currentMonth.getMonth()+1);
		$scope.calcMonthAllDay($scope.currentMonth);
	}
	
	/**
	 * 调用前一个月
	 */
	$scope.calPreMonthAllDay = function(){
		if(( typeof $scope.currentMonth) == 'string'){
			$scope.currentMonth = $scope.currentMonth.parseToDate();
		}
		$scope.currentMonth.setMonth($scope.currentMonth.getMonth()-1);
		$scope.calcMonthAllDay($scope.currentMonth);
	}

	/**
	 * 计算本月
	 */
	$scope.calcMonthAllDay = function(date){
		var calendarArrays = [];
		$scope.calendarArrays = [];
		var month_first = getMonthFirst(date);
		var month_last = getMonthLast(date);
		
		$scope.startDate = dateAddDay(month_first,-(month_first.getDay()));
		var startDate_count = month_first.getDay();
		$scope.endDate = '';
		var endDate_count = '';
		if(month_first.getDay()>4){
			$scope.endDate  = dateAddDay(month_last,6-(month_last.getDay()));
			endDate_count = 6-month_last.getDay();
		}else{
			$scope.endDate = dateAddDay(month_last,13-(month_last.getDay()));
			endDate_count = 13-month_last.getDay();
		}
		var week_array = [];           
		for(var i = 0;i<42;i++){
			var cal_date = dateAddDay($scope.startDate,i);
			var calendarObj = {
				'DATE':cal_date.parseStr($scope.format),
				'DAY':cal_date.getDate(),
				'LUNAR_DATE':solarLunarDate(cal_date),
				'FESTIVAL':solarFestival(cal_date),
				'SYS_SCHED':[],
				'WORK_SCHED':[],
				'PRI_SCHED':[],
				'SCHEDS':[],
				'CHOOSED':false,
				'SEday':"",
				isClicked:true
			};
			//声明选中
			if(cal_date.parseStr('YYYY-MM-DD')==new Date().parseStr('YYYY-MM-DD')){
				calendarObj.CHOOSED=true;
			}
			
			//声明不可用
			if(cal_date.parseStr('YYYY-MM-DD')>$scope.maxDate||cal_date.parseStr('YYYY-MM-DD')<$scope.minDate){
				calendarObj.isClicked=false;
			}
			week_array.push(calendarObj);
			if((i+1)%7==0){
				$scope.calendarArrays.push(week_array);
				week_array = [];
			}
		}
		//$scope.getSchedule();
		
		$scope.setChooseDateState($scope.modalObj.OBJ.startDate,$scope.modalObj.OBJ.endDate,$scope.chooseType);
		if(( typeof date) == 'string'){
			date = date.parseToDate();
		}
		var monthFirstDay = getMonthFirst(date);	
		var monthLastDay = getMonthLast(date);
		
		var SY = date.getFullYear(); 
		var SM = date.getMonth();
		var SD = date.getDate();
		var SWD = date.getDay();
		return SY+" "+SM+" "+SD+" "+SWD;
	}

	/**
	 * 在日期的基础上增加天数
	 * @param date 原日期
	 * @param dayNum 增加天数
	 * @author dapaer
	 */
	var dateAddDay = dateHandleServ.dateAddDay;


	/**
	 * 获取当前月的第一天
	 */
	var getCurrentMonthFirst = dateHandleServ.getCurrentMonthFirst
	 
	 
	/**
	 * 获取月的第一天
	 */
	var getMonthFirst = dateHandleServ.getMonthFirst;

	/**
	 * 获取当前月的最后一天
	 */
	var getCurrentMonthLast = dateHandleServ.getCurrentMonthLast;



	/**
	 * 获取月的最后一天
	 */
	var getMonthLast = dateHandleServ.getMonthLast;


		

	/**
	 * 展现节日
	 */
	var solarFestival  = dateHandleServ.solarFestival;
	
	/**
	 * 展示农历
	 */
	 var solarLunarDate  = dateHandleServ.solarLunarDate;
	
		console.info($scope.calcMonthAllDay($scope.currentMonth));
	 $scope.cancel = function () {
		 $conowModalInstance.dismiss('cancel');
        };
});