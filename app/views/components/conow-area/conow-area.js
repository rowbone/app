'use strict';

app.controller('AreaSelCtrl', ['$scope', '$http', '$filter', 'AreaService', 
  function($scope, $http, $filter, AreaService) {
    var entity = $scope.entity = {
      area: '44010000',
      area2: '44010600'
    };

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

app.directive('conowArea', ['$modal', '$parse', '$interval', '$http', 'AreaService', 
  function($modal, $parse, $interval, $http, AreaService) {
    return {
      restrict: 'A',
      require: '?ngModel',
      // templateUrl: 'views/components/conow-area/tpls/area_tpl.html',
      link: function(scope, elem, attrs, ctrl) {
        // 地区 CODE 转换获取地区名称
        elem.val('');
        var handler = $interval(function() {
          if(!angular.equals(ctrl.$modelValue, NaN)) {
            $interval.cancel(handler);
            // 如果赋值不是8位数字不进行转换
            var regExp = /^\d{8}$/;
            if(regExp.test(ctrl.$modelValue)) {
              if(attrs.selectType == 2) {
                elem.val(AreaService.getAreaPath(ctrl.$modelValue));
              } else {
                elem.val(AreaService.getArea(ctrl.$modelValue));
              }
            }
          }
        }, 100);

        // $http.get('data/components/area/cities-map.json')
        //   .success(function(data, status) {
        //     // data = scope.$eval(data);
        //     var children = [];
        //     var handler = $interval(function() {
        //       if (!angular.equals(ctrl.$modelValue, NaN)) {
        //         $interval.cancel(handler);
        //         // label 用于跳出外层循环
        //         label: for (var i = 0; i < data.length; i++) {
        //             children = data[i].children;
        //             for (var j = 0; j < children.length; j++) {
        //               if (children[j].CODE == ctrl.$viewValue) {
        //                 elem.val(children[j].NAME);
        //                 break label;
        //               }
        //             }
        //           }
        //           // elem.val(data[ctrl.$viewValue][0]);
        //       }
        //     }, 100);
        //   })
        // .error(function(data, status) {
        //   console.log('Load region-map.json data wrong...');
        // });

        var templateUrl = 'views/components/conow-area/tpls/area-tpl.html';
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

app.controller('AreaTreeCtrl', ['$scope', '$timeout', '$http', '$modalInstance', 'modalParams', '$filter', 'AreaService', 
  function($scope, $timeout, $http, $modalInstance, modalParams, $filter, AreaService) {

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

    // entity.selectedArea = '';
    var arrRegion = AreaService.getArrRegion();
    entity.arrRegion = arrRegion;
    var arrProvinces = AreaService.getProvinces();
    entity.provinces = arrProvinces;

    var areaSelected = entity.areaSelected = {};
    // 点击选择地区
    $scope.areaSelect = function(obj, selectType) {
      if(selectType == 'province') {
        entity.cities = $filter('areaFilterByParent')($filter('areaFilter')(entity.arrRegion, 'city'), 'province', obj.code);
        areaSelected.province = obj;
        // entity.selectedArea = obj.name;
        selectedData = {};
      } else if(selectType == 'city') {
        entity.counties = $filter('areaFilterByParent')($filter('areaFilter')(entity.arrRegion, 'county'), 'city', obj.code);
        areaSelected.city = obj;
        // entity.selectedArea += '-' + obj.name;
      } else if(selectType == 'county') {
        areaSelected.county = obj;
        console.log(obj);
        // entity.selectedArea += '-' + obj.name;
        entity.selectedLabel = areaSelected.province.name + '-' + areaSelected.city.name + '-' + areaSelected.county.name;
        selectedData = {'label': entity.selectedLabel, 'code': obj.code};
      } else {
        console.log('Get a wrong selectType: ' + selectType);
      }
    };
  }
]);

app.controller('ProvinceCtrl', ['$scope', 
  function($scope) {

    var entity = $scope.entity = {};

    $scope.provinceClick = function() {
      $scope.skip(2);
    };

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
