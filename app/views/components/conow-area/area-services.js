'use strict';

app.service('AreaService', ['$http', '$filter', '$rootScope', 
  function($http, $filter, $rootScope) {
    var $scope = $rootScope.$new();

    var objData = null;
    var cityHotTopic = [];
    var cityGroup = [];
    var arrRegion = [];
    var provinces = [];
    var cities = [];
    var counties = [];
    // 地区的全路径字符串
    var areaPath = '';

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
            "name": value[0],
            "spell": value[1],
            "simple_spell": value[2]
          });
        }, arr);

        var arrCityGroup = [];
        arrCityGroup = $filter('orderBy')($filter('areaFilter')(arr, 'city'), 'spell');
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
            'children': arr.slice(arrIndex[i - 1], arrIndex[i])
          });
        }
        cityGroup = arrCities;

        arrRegion = arr;

        provinces = $filter('orderBy')($filter('areaFilter')(arr, 'province'), 'spell');
        cities = $filter('orderBy')($filter('areaFilter')(arr, 'city'), 'spell');
        counties = $filter('orderBy')($filter('areaFilter')(arr, 'county'), 'spell');
      })
      .error(function(data, status, headers, config) {
        console.log('Get ' + url + ' data wrong...');
      });

    // 获取根路径
    var getRegionWithRoot = function(code) {
      var regionForDisplay = null;
      var region = objData;
console.log(region)
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

	  this.getHotTopicCity = function() {
	   	return cityHotTopic;
	  };

	  this.getCityGroup = function() {
	  	return cityGroup;
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

	  this.getAreaPath = function(code) {
	  	console.log(code);
	  	areaPath = getRegionWithRoot(code);
	  	return areaPath;
	  };
    
  }
]);
