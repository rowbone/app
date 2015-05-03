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
// params：type --> province、city、county
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

// 根据上级过滤得到下级：省 --> 市/市 --> 区
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

// 过滤地区数据源的数据，规范名称
app.filter('areaNameFilter', function() {
  return function(input, type) {
    var arr = [];
    var arrCitiesFilter = ['藏族羌族自治州', '地区', '市', '蒙古自治州', '回族自治州', '彝族自治州', 
      '白族自治州', '傣族景颇族自治州', '藏族自治州', '土家族苗族自治州', '蒙古族藏族自治州', '尼族彝族自治州', 
      '自治', '傈傈族自治州', '苗族侗族自治州', '布依族苗族自治州', '壮族苗族自治州', '土家族苗族自治州', 
      '傣族自治州', '朝鲜族自治州', '哈萨克自治州'];

    // for(var i=0; i<arrCitiesFilter.length; i++) {
    //   angular.forEach(input, function(value, key) {
    //     if(value.indexOf)
    //   })
    // }
    var iLen = arrCitiesFilter.length;
    var index = -1;
    angular.forEach(input, function(value, key) {
      for(var i=0; i<iLen; i++) {console.log(value.name.indexOf(arrCitiesFilter[i]));
        if((index = value.name.indexOf(arrCitiesFilter[i])) > -1) {
          value = value.substring(0, index);
          this.push(value);
          // break;
        }
      }
    }, arr);
  }
});