'use strict';

app.service('AreaService', ['$http', '$filter', '$rootScope', 
  function($http, $filter, $rootScope) {
    var $scope = $rootScope.$new();

    var objData = null;
    var cityHotTopic = {};
    var cityGroup = [];
    var arrRegion = [];
    var provinces = [];
    var cities = [];
    var counties = [];
    // 按字母分组前的城市名称
    var arrCityGroup = [];

    var arrMunipalities = [];
    var urlMunipality = 'data/components/area/municipalities.json';
    $http.get(urlMunipality)
      .success(function(data, status, headers, config) {
        arrMunipalities = data;
      })
      .error(function(data, status, headers, config) {
        console.log('Get ' + urlMunipality + ' wrong...');
      })

    // 地区的全路径字符串
    var areaPath = '';
    var area = '';

    // 获取热门城市
    var urlHotTopic = 'data/components/area/hot-topic.json';
    $http.get(urlHotTopic)
      .success(function(data, status, headers, config) {
        cityHotTopic = data[0];
      })
      .error(function(data, status, headers, config) {
        console.log('Get ' + urlHotTopic + ' wrong...');
      })

    var url = 'data/components/area/region.js';
    $http.get(url)
      .success(function(data, status, headers, config) {
        var arr = [];
        var aData = [];
        if(typeof data === 'string') {
          objData = $scope.$eval(data);
        }
        // 生成 object array 类型的数据 --> arr
        angular.forEach(objData, function(value, key) {
          this.push({
            "code": key,
            'label': value[0],
            'name': value[0],
            'spell': value[1],
            'simple_spell': value[2]
          });
        }, arr);
        // arr = $filter('areaNameFilter')(arr, 'province');
        // 过滤获取市一级地区：areaFilter，并按拼音排序：orderBy
        arrCityGroup = $filter('areaFilter')(arr, 'city');
        // 增加直辖市
        // arrCityGroup = arrCityGroup.concat(arrMunipalities);
        arrCityGroup = $filter('orderBy')(arrCityGroup, 'spell');
        // 市一级名称过滤：areaNameFilter
        arrCityGroup = $filter('areaNameFilter')(arrCityGroup, 'city');
        var arrIndex = $filter('cityGroup')(arrCityGroup);
        var arrCities = [];
        // arrCities.push(entity.cityHotTopic);
        var arrGroup = ['A-E', 'F-J', 'K-O', 'P-T', 'U-Z'];
        for(var i=1; i<arrIndex.length; i++) {
          var label = arrGroup[i - 1];
          arrCities.push({
            'label': label,
            'spell': label,
            'simple_spell': label,
            'children': arrCityGroup.slice(arrIndex[i - 1], arrIndex[i])
          });
        }
        cityGroup = arrCities;

        arrRegion = arr;
        // arrRegion = arr.concat(arrMunipalities);
        // arrRegion = $filter('areaNameFilter')(arr, 'province');
        // arrRegion = $filter('areaNameFilter')(arrRegion, 'county');

        // provinces = $filter('orderBy')($filter('areaFilter')(arr, 'province'), 'spell');
        // cities = $filter('orderBy')($filter('areaFilter')(arr, 'city'), 'spell');
        // counties = $filter('orderBy')($filter('areaFilter')(arr, 'county'), 'spell');
        provinces = $filter('orderBy')($filter('areaNameFilter')($filter('areaFilter')(arr, 'province'), 'province'), 'spell');
        cities = $filter('orderBy')($filter('areaNameFilter')($filter('areaFilter')(arr, 'city'), 'city'), 'spell');
        counties = $filter('orderBy')($filter('areaNameFilter')($filter('areaFilter')(arr, 'county'), 'county'), 'spell');
      })
      .error(function(data, status, headers, config) {
        console.log('Get ' + url + ' data wrong...');
      });

    var getRegionNodes = function(code) {
      var regionNodes = {};
      var regExpCity = /0{4}$/;
      var regExpProvince = /0{6}$/;
      var county = '';
      var city = '';
      var province = '';
      if(regExpProvince.test(code)) {
      	province = code;
      } else if(regExpCity.test(code)) {
      	city = code;
      	province = code.substr(0, 2) + '000000';
      } else {
      	county = code;
      	city = code.substr(0, 4) + '0000';
      	province = code.substr(0, 2) + '000000';
      }
      
      angular.forEach(arrRegion, function(value, key) {
        if(county != '' && value.code == county) {
        	regionNodes.county = value;
        }
        if(city != '' && value.code == city) {
        	regionNodes.city = value;
        }
        if(province != '' && value.code == province) {
        	regionNodes.province = value;
        }
      });

      return regionNodes;
    }

    // 获取根路径
    var getRegionWithRoot = function(code) {
      var regionForDisplay = null;
      var region = objData;
      if(new RegExp("[0-9][0-9][0-9][0-9][0-9][0-9]00").test(code) && !new RegExp("[0-9][0-9][0-9][0-9]0000").test(code)){
        var province = code.substr(0,2)+"000000";
        var city =code.substr(0,4)+"0000";
        regionForDisplay = (region[province]!=null?region[province][0]+"-":"")+(region[city]!=null?region[city][0]+"-":"")+region[code][0];
      } else if(new RegExp("[0-9][0-9][0-9][0-9]0000").test(code) && !new RegExp("[0-9][0-9]000000").test(code)){
        var province = code.substr(0,2)+"000000";
        regionForDisplay = (region[province]!=null?region[province][0]+"-":"")+region[code][0];
      }else if(new RegExp("[0-9][0-9]000000").test(code)){
        regionForDisplay = region[code][0];
      }

      return regionForDisplay;
     }

    // 获取直辖市数据
    this.getMunipalities = function() {
      return arrMunipalities;
    };

    // 获取热门城市数据
	  this.getHotTopicCity = function() {
	   	return cityHotTopic;
	  };

    // 获取按字母分组前的城市
    this.getArrCityGroup = function() {
      return arrCityGroup;
    };

    // 获取按字母分组的数据
	  this.getCityGroup = function() {
	  	return cityGroup;
	  };

    this.getAllCityGroup = function() {
      var arr = [];
      return arr.concat(cityHotTopic, cityGroup);
    };

	  this.getArrRegion = function() {
	  	return arrRegion;
	  };

	  this.getProvinces = function() {
	  	return provinces;
	  };

	  this.getCities = function() {
	  	return cities;
	  };

	  this.getCounties = function() {
	  	return counties;
	  };
    // 获取地区名称全路径
	  this.getAreaPath = function(code) {
	  	areaPath = getRegionWithRoot(code);
	  	return areaPath;
	  };
    // 获取市的名称
	  this.getArea = function(code) {
	  	area = objData[code][0];
	  	return area;
	  }

    this.getRegionNodes = function(code) {
      return getRegionNodes(code);
    }
    
  }
]);
