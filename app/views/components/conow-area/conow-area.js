'use strict';

app.controller('AreaSelCtrl', ['$scope', '$http', '$filter', 
  function($scope, $http, $filter) {
    var entity = $scope.entity = {
      area: '广东',
      area2: '32010000'
    };

    var urlHotTopic = 'data/components/area/hot-topic.json';
    $http.get(urlHotTopic)
      .success(function(data, status, headers, config) {
        entity.cityHotTopic = data[0];
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
          data = $scope.$eval(data);
        }
        // 生成 object array 类型的数据 --> arr
        angular.forEach(data, function(value, key) {
          this.push({
            "code": key,
            'label': value[0],
            "name": value[0],
            "spell": value[1],
            "simple_spell": value[2]
          });
        }, arr);

        entity.arr = arr;
      })
      .error(function(data, status, headers, config) {
        console.log('Get ' + url + ' data wrong...');
      });

    $scope.test = function() {

      entity.city = $filter('orderBy')($filter('areaFilter')(entity.arr, 'city'), 'spell');
      // entity.province = $filter('orderBy')($filter('areaFilter')(entity.arr, 'county'), 'spell');
      // var arrIndex = $filter('cityGroup')($filter('orderBy')($filter('areaFilter')(entity.arr, 'city'), 'spell'));
      var arrIndex = $filter('cityGroup')(entity.city);
      var arr = [];
      arr.push(entity.cityHotTopic);
      var arrGroup = ['A-E', 'F-J', 'K-O', 'P-T', 'U-Z'];
      for(var i=1; i<arrIndex.length; i++) {
        var label = arrGroup[i - 1];
        arr.push({
          'label': label,
          'spell': label,
          'simple_spell': label,
          'children': entity.city.slice(arrIndex[i - 1], arrIndex[i])
        });
      }
      entity.cityGroup = arr;
    };
  }
]); 

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

// app.service('CityGroupService', ['$http', '$filter', 
//   function($http, $filter) {
//     var cityGroup = this.cityGroup;

//     if(!cityGroup) {

//     }
//   }
// ])

app.directive('conowArea', ['$modal', '$parse', '$interval', '$http', 
  function($modal, $parse, $interval, $http) {
    return {
      restrict: 'A',
      require: '?ngModel',
      // templateUrl: 'views/components/conow-area/tpls/area_tpl.html',
      link: function(scope, elem, attrs, ctrl) {
        // 地区 CODE 转换获取地区名称
        elem.val('');

        $http.get('data/components/area/cities-map.json')
          .success(function(data, status) {
            // data = scope.$eval(data);
            var children = [];
            var handler = $interval(function() {
              if (!angular.equals(ctrl.$modelValue, NaN)) {
                $interval.cancel(handler);
                // label 用于跳出外层循环
                label: for (var i = 0; i < data.length; i++) {
                    children = data[i].children;
                    for (var j = 0; j < children.length; j++) {
                      if (children[j].CODE == ctrl.$viewValue) {
                        elem.val(children[j].NAME);
                        break label;
                      }
                    }
                  }
                  // elem.val(data[ctrl.$viewValue][0]);
              }
            }, 100);
          })
        .error(function(data, status) {
          console.log('Load region-map.json data wrong...');
        });

        var templateUrl = 'views/components/conow-area/tpls/area-tpl.html';
        console.log(attrs.selectType);
        if(attrs.selectType == 2) {
          templateUrl = 'views/components/conow-area/tpls/area-tpl-cascade.html';
        }

        elem.bind('click', function(e) {
          e.preventDefault();

          var modalInstance = $modal.open({
            templateUrl: templateUrl,
            controller: 'AreaTreeCtrl',
            resolve: {
              modalParams: function() {
                var options = {};
                var selectLevel = attrs.selectLevel;
                if(selectLevel === undefined || selectLevel === '') {
                  options.selectLevel = 2;
                } else {
                  options.selectLevel = 1;
                }

                return options;
              }
            }
          });

          modalInstance.result.then(function(rtnVal) {
            if(rtnVal && rtnVal.label) {
              var value = rtnVal.label;
              elem.val(value);
              ctrl.$setViewValue(rtnVal.code);
            }
          }, function(rtnVal) {
            console.log(rtnVal);
          });
        });
      }
    }
  }
]);

// app.controller('ConowAreaCtrl', ['$scope', 
//   function($scope) {
//     console.log($scope.ngModel);
//   }
// ]);

app.controller('AreaTreeCtrl', ['$scope', '$timeout', '$http', '$modalInstance', 'modalParams', '$filter', 
  function($scope, $timeout, $http, $modalInstance, modalParams, $filter) {

    var entity = $scope.entity = {};

    var tree = $scope.my_tree = {};

    var selectedData;

    $scope.treeOptions = modalParams;

    $scope.my_tree_handler = function(branch) {
      selectedData = branch;
    };

    $scope.confirm = function() {
      $modalInstance.close(selectedData);
    };

    $scope.close = function() {
      console.log('close');
      $modalInstance.dismiss('close');
    };

    $scope.cancel = function() {
      console.log('cancel');
      $modalInstance.dismiss('cancel');
    };

    // area-cascade
    var url = 'data/components/area/region.js';        
    var arrProvinces = [],
        arrCities = [],
        arrCounties = [];

    $http.get(url)
      .success(function(data, status, headers, config) {
        var arr = [];
        if(typeof data === 'string') {
          data = $scope.$eval(data);
        }
        // 得到 object array 格式的数据
        angular.forEach(data, function(value, key) {
          this.push({
            "code": key,
            'label': value[0],
            "name": value[0],
            "spell": value[1],
            "simple_spell": value[2]
          });
        }, arr);
        // 获取到的所有数据
        entity.data = arr;

        entity.provinces = $filter('orderBy')($filter('areaFilter')(arr, 'province'), 'spell');
        entity.cities = $filter('orderBy')($filter('areaFilter')(arr, 'city'), 'spell');
        entity.counties = $filter('orderBy')($filter('areaFilter')(arr, 'county'), 'spell');
      })
      .error(function(data, status, headers, config) {
        console.log('Get ' + url + ' wrong...');
      })

      entity.selectedArea = '';
      // 点击选择地区
      $scope.areaSelect = function(obj, selectType) {
        if(selectType == 'province') {
          entity.cities = $filter('areaFilterByParent')($filter('areaFilter')(entity.data, 'city'), 'province', obj.code);
          entity.selectedArea = obj.name;
          selectedData = {};
        } else if(selectType == 'city') {
          entity.counties = $filter('areaFilterByParent')($filter('areaFilter')(entity.data, 'county'), 'city', obj.code);
          entity.selectedArea += '-' + obj.name;
        } else if(selectType == 'county') {
          console.log(obj);
          entity.selectedArea += '-' + obj.name;
          selectedData = {'label': entity.selectedArea, 'code': obj.code};
console.log(selectedData)
        } else {
          console.log('Get a wrong selectType: ' + selectType);
        }
      };
  }
]);

// 根据参数分别获取省、市、区的数据
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

app.controller('test', ['$scope', 
  function($scope) {
console.log($scope.$parent);

    var entity = $scope.entity = {};
    entity.provinces = ['广东省', '广州市'];

    $scope.show = function(val){
      $scope.getShowTabs(val);
    };

    $scope.hide = function(val){
      $scope.getHideTabs(val);
    };

    $scope.skip = function(val){
      $scope.getNumTabs(val);
    };

    $scope.sample = function(){
      console.log("is tabs");
    };

    $scope.sample2 = function(){
      console.log("is tabs2");
    };

  }
]);

// 获取根路径
function getRegionWithRoot(code){
  var regionForDisplay = null;
  if(new RegExp("[0-9][0-9][0-9][0-9][0-9][0-9]00").test(code) && !new RegExp("[0-9][0-9][0-9][0-9]0000").test(code)){
      var province = code.substr(0,2)+"000000";
      var city =code.substr(0,4)+"0000";
      regionForDisplay = (region[province]!=null?region[province][0]+"-":"")+(region[city]!=null?region[city][0]+"-":"")+region[code][0];
    }else if(new RegExp("[0-9][0-9][0-9][0-9]0000").test(code) && !new RegExp("[0-9][0-9]000000").test(code)){
      var province = code.substr(0,2)+"000000";
      regionForDisplay = (region[province]!=null?region[province][0]+"-":"")+region[code][0];
    }else if(new RegExp("[0-9][0-9]000000").test(code)){
      regionForDisplay = region[code][0];
    }
  return regionForDisplay;
}