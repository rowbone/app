'use strict';

// 对市一级数据进行分组，返回数组中包含分组字母对应的索引值
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
app.filter('areaNameFilter', function($rootScope) {
  return function(input, type) {
    var arr = [];
    var $scope = $rootScope.$new();

    var arrProvincesFilter = ['省', '市', '壮族自治区', '回族自治区', '维吾尔自治区', '自治区'];
    var arrCitiesFilter = ['藏族羌族自治州', '地区', '市', '蒙古自治州', '回族自治州', '彝族自治州', 
      '白族自治州', '傣族景颇族自治州', '藏族自治州', '土家族苗族自治州', '蒙古族藏族自治州', '尼族彝族自治州',
      '傈傈族自治州', '苗族侗族自治州', '布依族苗族自治州', '壮族苗族自治州', '土家族苗族自治州', 
      '傣族自治州', '朝鲜族自治州', '哈萨克自治州', '自治', '哈尼族', '蒙古族'];
    var arrCountiesFilter = ['土家族苗族自治县', '土家族自治县', '瑶族自治县', '仡佬族苗族自治县', '布依族苗族自治县',
      '苗族布依族自治县', '苗族自治县', '侗族自治县', '满族蒙古族自治县', '蒙古族自治县', '满族自治县', 
      '特区', '矿区', '区', '县', '市'];


    var iLenCities = arrCitiesFilter.length;
    var iLenProvinces = arrProvincesFilter.length;
    var iLenCounties = arrCountiesFilter.length;
    
    var index = -1;
    var flag = false;

    angular.forEach(input, function(value, key) {
      flag = false;

      if(type == 'province') {
        for(var i=0; i<iLenProvinces; i++) {
          if(value.label.indexOf(arrProvincesFilter[i]) > -1) {
            flag = true;
            break;
          }
        }
        if(flag) {
          index =  value.label.indexOf(arrProvincesFilter[i]);
          value.label = value.label.substring(0, index);
        }
      }
      if(type == 'city') {
        for(var i=0; i<iLenCities; i++) {
          if(value.label.indexOf(arrCitiesFilter[i]) > -1) {
            flag = true;
            break;
          }
        }
        if(flag) {
          index = value.label.indexOf(arrCitiesFilter[i]);
          value.label = value.label.substring(0, index);
        }
      }
      // var regExp = '/' + '' + '$/';
      if(type == 'county') {
        for(var i=0; i<iLenCounties; i++) {
          // regExp = '/' + arrCountiesFilter[i] + '$/';
          // regExp = $scope.$eval(regExp);
          if(value.label.length > 2 && value.label.indexOf(arrCountiesFilter[i]) > -1) {
          // if(regExp.test(value.label)) {
            flag = true;
            break;
          }
        }
        if(flag) {
          index =  value.label.indexOf(arrCountiesFilter[i]);
          value.label = value.label.substring(0, index);
        }
      }

      arr.push(value);
    });

    return arr;
  }
});

// 根据编码获取名称[市]
app.filter('AreaCodeToName', ['$filter', 'AreaService', 
  function($filter, AreaService) {
  return function(input) {
    if(input) {
      return AreaService.getArea(input);
    } else {
      return '';
    }
  };
  
}]);

// 根据编码获取名称[级联]
app.filter('AreaCodeToPath', ['$filter', 'AreaService', 
  function($filter, AreaService) {
  return function(input) {
    if(input) {
      return AreaService.getAreaPath(input);
    } else {
      return '';
    }
  };
  
}]);

// 根据 code 获取对应市的名称
app.filter('cityNameShort', ['AreaService', 
    function(AreaService) {
    return function(cityCode) {
      var origData = AreaService.getOrigData();
      var cityName = origData[cityCode][0];
      var arrCitiesFilter = ['藏族羌族自治州', '地区', '市', '蒙古自治州', '回族自治州', '彝族自治州', 
                             '白族自治州', '傣族景颇族自治州', '藏族自治州', '土家族苗族自治州', '蒙古族藏族自治州', '尼族彝族自治州',
                             '傈傈族自治州', '苗族侗族自治州', '布依族苗族自治州', '壮族苗族自治州', '土家族苗族自治州', 
                             '傣族自治州', '朝鲜族自治州', '哈萨克自治州', '自治', '哈尼族', '蒙古族'];
//      var index = -1;
//      var iLen = arrCitiesFilter.length;
//      for(var i=0; i<iLen; i++) {
//        if(cityName.indexOf(arrCitiesFilter[i]) > -1) {
//          cityName = cityName.replace(arrCitiesFilter[i], '');
//          break;
//        }
//      }
      
      var regExp = new RegExp(arrCitiesFilter.join('|'), 'g');
      cityName = cityName.replace(regExp, '');
      
      return cityName;
    }
  }
]);