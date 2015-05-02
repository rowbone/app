'use strict';



// 对市一级数据进行分组
app.filter('cityGroup', function() {
  return function(input) {
    var arr = [0];
    var arrSplit = ['f', 'k', 'p', 'w'];
    for(var i=0; i<arrSplit.length; i++) {
      for(var j=0; j<input.length; j++) {
        if(input[j].spell.charAt(0) == arrSplit[i]) {
          // 有的字母没有对应的市一级名称，此行代码可获取到对应的字母和开始index
          // arr.push(arrSplit[i] + ':' + j);
          arr.push(j);
          break;
        }
      }
    }
    arr.push(input.length);

    return arr;
  }
});

// 根据参数分别获取省、市、区的数据
// params：type，
app.filter('areaFilter', function() {
  return function(input, type) {
    var arr = [];
    var code = '';
    var regExpCity = /0{4}$/;
    var regExpProvince = /0{6}$/;
    angular.forEach(input, function(value, key) {
      code = value.code;
      if(type == 'county' && !regExpCity.test(code)) {
        this.push(value);
      } else if(type == 'city' && regExpCity.test(code) && !regExpProvince.test(code)) {
        this.push(value);
      } else if (type == 'province' && regExpProvince.test(code)) {
        this.push(value);
      }
    }, arr);

    return arr;
  }
});

app.filter('areaFilterByParent', function() {
  return function(input, type, parentCode) {
    var arr = [];
    var code = '';
    var str = (type == 'province') ? parentCode.substr(0, 2) : ((type == 'city') ? parentCode.substr(0, 4) : '');
    var regExp = new RegExp('^' + str);
    angular.forEach(input, function(value, key) {
      code = value.code;
      if(regExp.test(code)) {
        this.push(value);
      }
    }, arr);

    return arr;
  }
});