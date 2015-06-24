'use strict';

app.controller('AreaSelCtrl', ['$scope', '$http', '$filter', 'AreaService',
    function($scope, $http, $filter, AreaService) {
        var entity = $scope.entity = {
            area: '44010000',
            area2: '44010600'
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
        var selectedCode = '';
        
        // 地区 CODE 转换获取地区名称
        var unbindWatcher = scope.$watch(
          function(){return elem.val();},
          // This is the change listener, called when the value returned from the above function changes
          function(newValue, oldValue) {
            // 如果赋值不是8位数字不进行转换
            var regExp = /^\d{8}$/;
            var selectedCode = '';
            selectedCode = ctrl.$modelValue;
            if(ctrl.$modelValue) {
              unbindWatcher();
            } 
            //if (regExp.test(ctrl.$modelValue)) {
            if (regExp.test(newValue)) {
              AreaService.promiseRegions.then(
                function(data){
                  if (attrs.selectType == 2) {
                    // 获取层级关系的地区名称
                    elem.val(AreaService.getAreaPath(ctrl.$modelValue));
                  } else {
                    // 获取地区名称
                    elem.val(AreaService.getArea(ctrl.$modelValue));
                  }
                },
                function(error) {
                  console.log('error in loading areaService');
                }
              );                          
            }
          }
        );

        var templateUrl = 'views/components/conow-area/tpls/area-tpl.html';
        if (attrs.selectType == 2) {
          templateUrl = 'views/components/conow-area/tpls/area-cascade-tpl.html';
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
                if (selectLevel === undefined || selectLevel === '') {
                  options.selectLevel = 2;
                } else {
                  options.selectLevel = 1;
                }
                var selectedArea = {};
                selectedArea.code = ctrl.$modelValue;

                return {
                  'options': options,
                  'selectedArea': selectedArea
                };
              }
            }
          });

          modalInstance.result.then(function(rtnVal) {
            if (rtnVal && rtnVal.label) {
              var value = rtnVal.label;
              elem.val(value).focus();
              ctrl.$setViewValue(rtnVal.code);
            }
          }, function(rtnVal) {
            console.log(rtnVal);
          });
        });
      }
    };
  }
]);


app.controller('AreaTreeCtrl', ['$scope', '$timeout', '$http', '$modalInstance', 'modalParams', '$filter', 'AreaService',
    function($scope, $timeout, $http, $modalInstance, modalParams, $filter, AreaService) {

        var entity = $scope.entity = {};

        var tree = $scope.my_tree = {};

        var selectedData;

        $scope.treeOptions = modalParams.options;

        $scope.my_tree_handler = function(branch) {
            selectedData = branch;
        };
        
        $scope.my_tree_handler_v3 = function(branch) {
            selectedData = branch;
            $scope.confirm();
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

        var areaSelected = entity.areaSelected = {
            province: null,
            city: null,
            county: null
        };

        entity.selectedTab = 0;

        // 获取已选择的项
        if (modalParams.selectedArea.code) {
            //      entity.selectedTab = 2;
            var regionNodes = AreaService.getRegionNodes(modalParams.selectedArea.code);
            if (regionNodes.county || regionNodes.city) {
                entity.selectedTab = 2;
            } else if (regionNodes.province) {
                entity.selectedTab = 1;
            } else {
                entity.selectedTab = 0;
            }
            if (regionNodes.province) {
                areaSelected.province = regionNodes.province;
                entity.cities = $filter('areaFilterByParent')($filter('areaFilter')(entity.arrRegion, 'city'), 'province', areaSelected.province.code);
            }
            if (regionNodes.city) {
                areaSelected.city = regionNodes.city;
                entity.counties = $filter('areaFilterByParent')($filter('areaFilter')(entity.arrRegion, 'county'), 'city', areaSelected.city.code);
            }
            areaSelected.county = regionNodes.county;
        };

        $scope.$watch('entity.areaSelected', function(newVal, oldVal) {
            var areaSelected = newVal;
            entity.selectedLabel = '';
            if (areaSelected.province) {
                entity.selectedLabel = areaSelected.province.name;
                selectedData = {
                    'label': entity.selectedLabel,
                    'code': areaSelected.province.code
                };
            }
            if (areaSelected.city) {
                entity.selectedLabel += '-' + areaSelected.city.name;
                selectedData = {
                    'label': entity.selectedLabel,
                    'code': areaSelected.city.code
                };
            }
            if (areaSelected.county) {
                entity.selectedLabel += '-' + areaSelected.county.name;
                selectedData = {
                    'label': entity.selectedLabel,
                    'code': areaSelected.county.code
                };
            }
            // if(areaSelected.province && areaSelected.city && areaSelected.county) {
            //   // entity.selectedLabel = areaSelected.province.name + '-' + areaSelected.city.name + '-' + areaSelected.county.name;
            //   selectedData = {'label': entity.selectedLabel, 'code': areaSelected.county.code};
            // } else {
            //   selectedData = {};
            // }
        }, true);

        // 点击选择地区
        $scope.areaSelect = function(obj, selectType, $event) {
            if (selectType == 'province') {
                entity.cities = $filter('areaFilterByParent')($filter('areaFilter')(entity.arrRegion, 'city'), 'province', obj.code);
                entity.counties = null;
                areaSelected.province = obj;
                areaSelected.city = null;
                areaSelected.county = null;
                var objCode = obj.code;
                // if(objCode == '11000000' || objCode == '12000000' || objCode == '31000000' || objCode == '50000000') {
                //   areaSelected.city = entity.cities[0];
                // }
            } else if (selectType == 'city') {
                entity.counties = $filter('areaFilterByParent')($filter('areaFilter')(entity.arrRegion, 'county'), 'city', obj.code);
                areaSelected.city = obj;
                areaSelected.county = null;
                // entity.selectedArea += '-' + obj.name;
            } else if (selectType == 'county') {
                areaSelected.county = obj;
                // entity.selectedArea += '-' + obj.name;
            } else {
                console.log('Get a wrong selectType: ' + selectType);
            }
            $event.preventDefault();
        };
    }
]);

app.controller('ProvinceCtrl', ['$scope',
    function($scope) {

        var entity = $scope.entity = {};

        $scope.provinceClick = function() {
            $scope.skip(2);
        };

        $scope.show = function(val) {
            $scope.getShowTabs(val);
        };

        $scope.hide = function(val) {
            $scope.getHideTabs(val);
        };

        $scope.skip = function(val) {
            $scope.getNumTabs(val);
        };

        $scope.sample = function() {
            console.log("is tabs");
        };

        $scope.sample2 = function() {
            console.log("is tabs2");
        };

    }
]);