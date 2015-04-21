app.controller('arpDatepickerDemoCtrl', function ($scope, $filter,$rootScope) {

	  $scope.arpDate = {
			  date1: '2018-08-04',
			  date2: '2016/07/08 15:14:13',
			  date3: '2018-08',
			  date4: '2019',
			  date5: '16:15:12',
			  date7: "",
			  
			  save:function(){
				  alert("save---");
			  },
			  
			  query:function(date){
				  alert("查询----" + date);
			  },
			  // 不允许选择周末
			  //disabled:function(date, mode) {
				//    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
			  //}
	  };
});




