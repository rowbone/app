app.filter('isCurrMonth',function(){
	  return function(str,currentDate){
		  if(str){
			  nowDate = str;
			  if(( typeof nowDate) == 'string'){
				  nowDate = nowDate.parseToDate();
				}
			  if(( typeof currentDate) == 'string'){
				  currentDate = currentDate.parseToDate();
				}
			  if(currentDate.getMonth()!=nowDate.getMonth()){
				  return false;
			  }
			  return true;
			  
		  }
		
	  };	  
});

app.filter('isToday',function(){
	  return function(str){
		  if(str){
			  var nowDate = str;
			  if(( typeof nowDate) == 'string'){
				  nowDate = nowDate.parseToDate();
				}
			  var currentDate = new Date();
			  return nowDate.parseStr("YYYYMMDD")==currentDate.parseStr("YYYYMMDD");
			  
		  }
		
	  };	  
});

/**格式化为全天、上午、下午形式***/
app.filter('ampmFormat',function(){
	 return function(str){
		 if(str){
			 switch(str){
			 	case 'am':
			 		 return '上午';
			 	case 'pm':
			 		 return '下午';
			 	case 'all':
			 		return '全天';
				default:
					return '';
			 }
		 }
	 }	
});

//------------------------------------公共方法(日期处理)---------------------------------
	/**
	 * 扩展Date对象的解析字符串方法
	 * @param format 要过滤的格式
	 * @author zhengyiling
	 * @returns
	 */
	Date.prototype.parseStr = function(format) {  
		var mths = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];  
		var WEEKs =["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"];  
		var CWEEKs =["星期天", "星期一", "星期二", "星期三", "星期四", "星期五","星期六"];  
		var WEKs = [ "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT" ]; 
		var NOON = ["上午","下午"];
	    var YYYY = this.getFullYear()+""; //2011  
	      
	    var YY = YYYY.substr(2);   // 11  
	        format = format.replaceAll("YYYY",YYYY);  
	        format = format.replaceAll("YY",YY);  
	          
	    var M=this.getMonth()+1;  
	    var MM=(M<10)?"0"+M:M;  
	    var MMM=mths[M - 1];  
	        format=format.replaceAll("MMM",MMM);  
	        format=format.replaceAll("MM",MM);  
	        format=format.replaceAll("M",M);  
	          
	    var D=this.getDate();  
	    var DD=(D<10)?"0"+D:D; 
	    //console.info(DD);
	        format=format.replaceAll("DD",DD);  
	        format=format.replaceAll("D",D);  
	          
	    var h=this.getHours();  
	    var hh=(h<10)?"0"+h:h;  
	        format=format.replaceAll("hh",hh);  
	        format=format.replaceAll("h",h);  
	    var m=this.getMinutes();  
	    var mm=(m<10)?"0"+m:m;  
	        format=format.replaceAll("mm",mm);  
	        format=format.replaceAll("m",m);  
	    var s=this.getSeconds();  
	    var ss=(s<10)?"0"+s:s;  
	        format=format.replaceAll("ss",ss);  
	        format=format.replaceAll("s",s);  
	    var dayOfWeek=this.getDay();  
	    	format=format.replaceAll("CWEEK",CWEEKs[dayOfWeek]);  
	        format=format.replaceAll("WEEK",WEEKs[dayOfWeek]);  
	        format=format.replaceAll("WEK",WEKs[dayOfWeek]); 
	        
	    var noonShow = h>12? 1:0;
	        format=format.replaceAll("NOON",NOON[noonShow]); 
	        if(format.indexOf('NaN') != -1){
	    	   return '';
	       };
	    return format;  
	};  

	/**
	 * 初始化时间的小时分钟以及秒钟
	 * @param format 要过滤的格式
	 * @author zhengyiling
	 * @returns
	 */
	Date.prototype.initTime = function(date,hour,min,sec) {
		var dateNew = new Date(date.getTime());
		if(hour>=0){
			dateNew.setHours(hour);
		}
		if(min>=0){
			dateNew.setMinutes(min);
		}
		if(sec>=0){
			dateNew.setSeconds(sec);
		}
	    return dateNew;  
	};  
	
	Date.prototype.parseToDate  = function() {
		return this;  
	}; 
	
	/**
	 * 增加分钟
	 * @param min 分钟
	 * @author zhengyiling
	 * @returns
	 */
	Date.prototype.addMin = function(min) {
		var dateNew = new Date(this.getTime()+min*60*1000);
	    return dateNew;  
	};  
	
	Date.prototype.addTime = function(time){
		var dateNew = new Date(this.getTime()+time);
	    return dateNew;  
	};
	
	Date.prototype.addHour = function(hour){
	    return this.addTime(hour*60*60*1000);  
	};
	

	Date.prototype.addDay = function(day){
	    return this.addTime(day*24*60*60*1000);  
	};
	
	/**
	 * 扩展Date的计算两个时间相差天数方法
	 * @author zhengyiling
	 * @returns {day} 返回的天数
	 */
	Date.prototype.compareDay = function(day){
		var destDay = day.parseToDate().parseStr('YYYY-MM-DD').parseToDate();
		var src = this.parseToDate().parseStr('YYYY-MM-DD').parseToDate();
		var countDay = (destDay.getTime()-src.getTime())/24/60/60/1000;
		countDay = Math.abs(Math.floor(countDay));
	    return countDay;  
	};
	
	/**
	 * 扩展Date的计算两个时间相差天数方法
	 * @author zhengyiling
	 * @returns {day} 返回的天数
	 */
	Date.prototype.compareMin = function(day){
		var destDay = day.parseToDate().parseStr('YYYY-MM-DD hh:mm:ss').parseToDate();
		var src = this.parseToDate().parseStr('YYYY-MM-DD hh:mm:ss').parseToDate();
		var countDay = (destDay.getTime()-src.getTime())/60/1000;
		countDay = Math.abs(Math.floor(countDay));
	    return countDay;  
	};
	
	/**
	 * 扩展Sting的转换Date方法
	 * @author zhengyiling
	 * @returns {Date} 返回的日期对象
	 */
	String.prototype.parseToDate  = function() {
		return new Date(this.replace(/-/g,"/").substr(0, 19));  
	}; 


	
	
	/**
	 * 扩展字符串的替换所有方法
	 * @param src 原字符
	 * @param dest 替换后字符
	 * @author zhengyiling
	 */
	String.prototype.replaceAll  = function(src,dest){     
	    return this.replace(new RegExp(src,"gm"),dest);     
	};  

	String.prototype.parseStr  = function(){
		return this;
	}