/**
 * 日期类型处理服务
 * @author zhengyiling
 */
app.factory('dateHandleServ', ['$http',function($http) {
	//-----------------------------------农历对象--------------------------------
	var lunarInfo=new Array(
			0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
			0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
			0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
			0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
			0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
			0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
			0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
			0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
			0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
			0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
			0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
			0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
			0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
			0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
			0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0)
			var Animals=new Array("鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪");
			var Gan=new Array("甲","乙","丙","丁","戊","己","庚","辛","壬","癸");
			var Zhi=new Array("子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥");
			var now = new Date();
			var SY = now.getFullYear(); 
			var SM = now.getMonth();
			var SD = now.getDate();

			//==== 传入 offset 传回干支, 0=甲子
			function cyclical(num) { return(Gan[num%10]+Zhi[num%12])}

			//==== 传回农历 y年的总天数
			function lYearDays(y) {
			   var i, sum = 348
			   for(i=0x8000; i>0x8; i>>=1) sum += (lunarInfo[y-1900] & i)? 1: 0
			   return(sum+leapDays(y))
			}

			//==== 中文日期
			function cDay(m,d){
			 var nStr1 = new Array('日','一','二','三','四','五','六','七','八','九','十');
			 var nStr2 = new Array('初','十','廿','卅','　');
			 var s;
			 if (m>10){s = '十'+nStr1[m-10]} else {s = nStr1[m]} s += '月'
				 if((nStr2[Math.floor(d/10)]+nStr1[d%10])=="初一"){
					 return s;
				 }
			 s='';
			 switch (d) {
			  case 10:s += '初十'; break;
			  case 20:s += '二十'; break;
			  case 30:s += '三十'; break;
			  default:s += nStr2[Math.floor(d/10)]; s += nStr1[d%10];
			 }
			 return(s);
			}
			//==== 传回农历 y年闰月的天数
			function leapDays(y) {
			   if(leapMonth(y))  return((lunarInfo[y-1900] & 0x10000)? 30: 29)
			   else return(0)
			}

			//==== 传回农历 y年闰哪个月 1-12 , 没闰传回 0
			function leapMonth(y) { return(lunarInfo[y-1900] & 0xf)}

			//====================================== 传回农历 y年m月的总天数
			function monthDays(y,m) { return( (lunarInfo[y-1900] & (0x10000>>m))? 30: 29 )}

			//==== 算出农历, 传入日期物件, 传回农历日期物件
//			     该物件属性有 .year .month .day .isLeap .yearCyl .dayCyl .monCyl
			function Lunar(objDate) {
			   var i, leap=0, temp=0
			   var baseDate = new Date(1900,0,31)
			   var offset   = (objDate - baseDate)/86400000

			   this.dayCyl = offset + 40
			   this.monCyl = 14

			   for(i=1900; i<2050 && offset>0; i++) {
			      temp = lYearDays(i)
			      offset -= temp
			      this.monCyl += 12
			   }
			   if(offset<0) {
			      offset += temp;
			      i--;
			      this.monCyl -= 12
			   }

			   this.year = i
			   this.yearCyl = i-1864

			   leap = leapMonth(i) //闰哪个月
			   this.isLeap = false

			   for(i=1; i<13 && offset>0; i++) {
			      //闰月
			      if(leap>0 && i==(leap+1) && this.isLeap==false)
			         { --i; this.isLeap = true; temp = leapDays(this.year); }
			      else
			         { temp = monthDays(this.year, i); }

			      //解除闰月
			      if(this.isLeap==true && i==(leap+1)) this.isLeap = false

			      offset -= temp
			      if(this.isLeap == false) this.monCyl ++
			   }

			   if(offset==0 && leap>0 && i==leap+1)
			      if(this.isLeap)
			         { this.isLeap = false; }
			      else
			         { this.isLeap = true; --i; --this.monCyl;}

			   if(offset<0){ offset += temp; --i; --this.monCyl; }

			   this.month = i;
			   this.day = offset + 1;
			}

	return {

		/**
		 * 在日期的基础上增加天数
		 * @param date 原日期
		 * @param dayNum 增加天数
		 * @author dapaer
		 */
		dateAddDay : function(date,dayNum){
			if((typeof dayNum) == 'number'){
				dayNum = new Number(dayNum);
			}
			if(( typeof date) == 'string'){
				date = date.parseToDate();
			}
			return new Date(Date.parse(date) + (1000*60*60*24*dayNum)); 
		},


		/**
		 * 获取当前月的第一天
		 */
		getCurrentMonthFirst:function (){
			 return this.getMonthFirst(new Date());
		},
		 
		 
		/**
		 * 获取月的第一天
		 */
		getMonthFirst:function(date){
			if(( typeof date) == 'string'){
				date = date.parseToDate();
			}

		 date.setDate(1);
		 return date;
		},

		/**
		 * 获取当前月的最后一天
		 */
		getCurrentMonthLast:function(){
			return this.getMonthLast(new Date());
		}, 



		/**
		 * 获取月的最后一天
		 */
		getMonthLast:function(date){
			if(( typeof date) == 'string'){
				date = date.parseToDate();
			}
			 var currentMonth=date.getMonth();
			 var nextMonth=++currentMonth;
			 var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
			 var oneDay=1000*60*60*24;
			 return new Date(nextMonthFirstDay-oneDay);
		},


			

		/**
		 * 展现节日
		 */
		solarFestival:function(now){
			 	if(now){
				var SY = now.getFullYear(); 
				var SM = now.getMonth();
				var SD = now.getDate(); 
			}
				var sTermInfo = new Array(0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758)
				var solarTerm = new Array("小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至")
				var lFtv = new Array("0101*春节","0115 元宵节","0505 端午节","0707 七夕情人节","0715 中元节","0815 中秋节","0909 重阳节","1208 腊八节","1224 小年","0100*除夕")
				var sFtv = new Array("0101*元旦","0202 世界湿地日","0210 国际气象节","0214 情人节","0303 全国爱耳日","0308 妇女节","0312 植树节","0314 国际警察日","0315 消费者权益日","0401 愚人节","0407 世界卫生日","0422 世界地球日","0501 国际劳动节","0504 青年节","0508 世界红十字日","0512 护士节","0531 世界无烟日","0601 国际儿童节","0605 世界环境日","0701 建党节","0711 世界人口日","0801 建军节","0808 父亲节","0910 教师节","0917 国际和平日","0928 孔子诞辰","1001*国庆节","1006 老人节","1009 世界邮政日","1024 联合国日","1031 万圣节","1112 孙中山诞辰","1128 感恩节","1201 世界艾滋病日","1220 澳门回归纪念","1225 圣诞节","1226 毛泽东诞辰")
				
				  var sDObj = new Date(SY,SM,SD);
				  var lDObj = new Lunar(sDObj);
				  var lDPOS = new Array(3)
				  var festival='',solarTerms='',solarFestival='',lunarFestival='',tmp1,tmp2;
				  //农历节日 
				  for(i in lFtv)
				  if(lFtv[i].match(/^(\d{2})(.{2})([\s\*])(.+)$/)) {
				   tmp1=Number(RegExp.$1)-lDObj.month
				   tmp2=Number(RegExp.$2)-lDObj.day
				   if(tmp1==0 && tmp2==0) lunarFestival=RegExp.$4 
				  }
				  //国历节日
				  for(i in sFtv)
				  if(sFtv[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/)){
				   tmp1=Number(RegExp.$1)-(SM+1)
				   tmp2=Number(RegExp.$2)-SD
				   if(tmp1==0 && tmp2==0) solarFestival = RegExp.$4 
				  }
				  //节气
				  tmp1 = new Date((31556925974.7*(SY-1900)+sTermInfo[SM*2+1]*60000)+Date.UTC(1900,0,6,2,5))
				  tmp2 = tmp1.getUTCDate()
				  if (tmp2==SD) solarTerms = solarTerm[SM*2+1]  
				  tmp1 = new Date((31556925974.7*(SY-1900)+sTermInfo[SM*2]*60000)+Date.UTC(1900,0,6,2,5))
				  tmp2= tmp1.getUTCDate()
				  if (tmp2==SD) solarTerms = solarTerm[SM*2] 
				
				  if(solarTerms == '' && solarFestival == '' && lunarFestival == '')
				    festival = '';
				  else
				    festival = ''+
				    ''+solarTerms + ' ' + solarFestival + ' ' + lunarFestival+''+
				    '';
				         
				  var cl = '';
				  return(cl+festival);
		},
		
		/**
		 * 展示农历
		 */
		solarLunarDate:function(now,showYear){
			 if(now){
				var SY = now.getFullYear(); 
			var SM = now.getMonth();
			var SD = now.getDate(); 
			}
			
		    var sDObj = new Date(SY,SM,SD);
			
		    var lDObj = new Lunar(sDObj);

		    var cl = ''; 
		    //农历BB'+(cld[d].isLeap?'闰 ':' ')+cld[d].lMonth+' 月 '+cld[d].lDay+' 日
			var tt = '';
			if(	showYear){
				tt = cyclical(SY-1900+36)+'年 '+cDay(lDObj.month,lDObj.day)+'日 ';
			}else{
				tt = cDay(lDObj.month,lDObj.day);
			}
			//	console.info(SY,SM,SD,sDObj,lDObj,tt,cyclical((2015-1900+36)));
		    return(cl+tt+'');
		 },
		 /**
		 * 判断是否当前月份
		 */
		countIsCurrentMonth : function(now,currentDate){
			 if(now){
				  nowDate = now;
				  if(( typeof nowDate) == 'string'){
					  nowDate = nowDate.parseToDate();
					}
				  if(( typeof currentDate) == 'string'){
					  currentDate = currentDate.parseToDate();
					}
				  //console.info('solo now',now ,currentDate,currentDate.getMonth()!=nowDate.getMonth())
				  if(currentDate.getMonth()!=nowDate.getMonth()){
					  return false;
				  }
				  return true;
				  
			  }
		},
			
		/**
		 * 判断是否今天
		 * @param now
		 * @returns
		 */
		isToday : function(now){
			 if(now){
				  var nowDate = now;
				  if(( typeof nowDate) == 'string'){
					  nowDate = nowDate.parseToDate();
					}
				  var currentDate = new Date();
				  return nowDate.parseStr("YYYYMMDD")==currentDate.parseStr("YYYYMMDD");
				  
			  }
		}

	}
		
}]);