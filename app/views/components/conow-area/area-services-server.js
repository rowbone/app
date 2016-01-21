(function(app) {
    'use strict';

    /*
     * AreaService
     * description:提供地区组件的数据和操作方法
     * 
     * areaCityUrl:service/region!queryCity
     * areaCascadeUrl:service/region!queryRegionProvinceToArea
     * areaAllHistoryUrl: 'service/region!translateRegion'
     * */
    app.service('AreaService', ['$http', '$filter', '$q',
        function($http, $filter, $q) {
            
            // areaCity 保存接口 'service/region!queryCity' 返回的所有 '市' 的数据
            var areaCity = {};
            // areaCascade 保存接口 'service/region!queryRegionProvinceToArea' 返回的所有级联数据
            var areaCascade = {};
            // areaAllHistory 保存接口 'service/region!translateRegion' 返回的所有级联数据
            var areaAllHistory = {};
            // options 为一些配置信息：以 'key' 开头的属性用于配置对应字段和返回数据属性的对应关系
            var options = {
                'keyCode': 'CODE',
                'keyName': 'NAME',
                'keyLabel': 'SHORT_NAME',
                'keyChildren': 'CHILDREN',
                'keyParentCode': 'PARENT_CODE',
                'keyShortName': 'SHORT_NAME',
                'keyCommon': 'COMMON',

                'isLoaded': false
            };
            var _this = this;
            
            this.deferred = $q.defer();
            this.promiseRegions = this.deferred.promise;
            
            this.getRegionMaintainData = function(url) {            
                var deferred = $q.defer();
                deferred.notify('Get Region Maintain Data -->', url);
                
                $http.get(url)
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(msg) {
                        deferred.reject(msg);
                    })
                    
                return deferred.promise;
            }
            
            var _init = function() {
                var provincesLen = 0,
                    citiesLen = 0,
                    province = null,
                    city = null,
                    tmp = null; 

                options.isLoaded = true;
            
                var areaUrlObj = {
                    areaCityUrl: 'service/region!queryCity',
                    areaCascadeUrl: 'service/region!queryRegionProvinceToArea',
                    areaAllHistoryUrl: 'service/region!translateRegion'
                }
                $q.all({
                        areaCity: $http.get(areaUrlObj.areaCityUrl),
                        areaCascade: $http.get(areaUrlObj.areaCascadeUrl),
                        areaAllHistory: $http.get(areaUrlObj.areaAllHistoryUrl)
                    })
                    .then(function(rtnObj) {
                        if(angular.equals(rtnObj.areaCity.data, '')) {
                            _this.deferred.reject('Get data "' + areaUrlObj.areaCityUrl + '" wrong');
                            
                            return;
                        }
                        if(angular.equals(rtnObj.areaCascade.data, '')) {
                            _this.deferred.reject('Get data "' + areaUrlObj.areaCascadeUrl + '" wrong');
                            
                            return;
                        }
                        if(angular.equals(rtnObj.areaAllHistory.data, '')) {
                            _this.deferred.reject('Get data "' + areaUrlObj.areaAllHistoryUrl + '" wrong');
                            
                            return;
                        }
                        areaCity.origData = rtnObj.areaCity.data.obj;
                        if(rtnObj.areaCascade.data.obj.REGION && rtnObj.areaCascade.data.obj.VIRTUAL) {
                            areaCascade.origData = rtnObj.areaCascade.data.obj.REGION;
                            areaCascade.virtual = rtnObj.areaCascade.data.obj.VIRTUAL;
                        } else {
                            areaCascade.origData = rtnObj.areaCascade.data.obj;
                        }
                        areaCascade.origData = rtnObj.areaCascade.data.obj.REGION;
                        areaCascade.virtual = rtnObj.areaCascade.data.obj.VIRTUAL;
                        areaAllHistory.origData = rtnObj.areaAllHistory.data.obj;
                        
                        /*
                        var provincesLen = 0,
                            citiesLen = 0,
                            provinces = [],
                            cities = [],
                            counties = [],
                            province = null,
                            city = null,
                            tmp = null;             
                        
                        areaCascade.provinces = angular.copy(areaCascade.origData);
                        
                        provinces = areaCascade.provinces;
                        
                        provincesLen = provinces.length;
                        for(var i=0; i<provincesLen; i++) {
                            province = provinces[i];
                            
                            tmp = province[options.keyChildren];
                            if(angular.isDefined(tmp)) {
                                citiesLen = tmp.length;
                                cities = cities.concat(tmp);
                                for(var j=0; j<citiesLen; j++) {
                                    city = tmp[j];
                                    
                                    counties = counties.concat(city[options.keyChildren]);
                                }
                            }                   
                        }
                        areaCascade.cities = cities;
                        areaCascade.counties = counties;
                        */
                        areaCascade = generateAreaCascadeData(areaCascade);
                        areaAllHistory = generateAreaCascadeData(areaAllHistory);
                        
                        _this.deferred.resolve('Get all Data Success');
                    }, function(msg) {
                        console.error(msg);
                    });
            };
            
            function generateAreaCascadeData(areaCascade) {
                var provincesLen = 0,
                    citiesLen = 0,
                    provinces = [],
                    cities = [],
                    counties = [],
                    province = null,
                    city = null,
                    tmp = null;  
                
                if(angular.isDefined(areaCascade.origData)) {
                    areaCascade.provinces = angular.copy(areaCascade.origData);
                    
                    provinces = areaCascade.provinces;
                    
                    provincesLen = provinces.length;
                    for(var i=0; i<provincesLen; i++) {
                        province = provinces[i];
                        
                        tmp = province[options.keyChildren];
                        if(angular.isDefined(tmp)) {
                            citiesLen = tmp.length;
                            cities = cities.concat(tmp);
                            for(var j=0; j<citiesLen; j++) {
                                city = tmp[j];
                                
                                counties = counties.concat(city[options.keyChildren]);
                            }
                        }                   
                    }
                    areaCascade.cities = cities;
                    areaCascade.counties = counties;
                } else {
                    console.log('area-services --> generateAreaCascadeData wrong,didn\'t get origData from areaCascade.');
                }
                
                return areaCascade;         
            }
            
            // 初始化方法
            // _init();
            this.init = function() {
                if(!options.isLoaded) {
                    _init();
                }
            };
            
            var getNodes = function(code, areaData) {
                var counties = areaData.counties,
                    cities = areaData.cities,
                    provinces = areaData.provinces,
                    areaArr = [],
                    tmpObj = null,
                    iLen = 0;
            
                if(angular.isDefined(counties)) {
                    iLen = counties.length;
                    for(var i=0; i<iLen; i++) {
                        tmpObj = counties[i];
                        if(angular.isDefined(tmpObj) && tmpObj[options.keyCode] == code) {
                            code = tmpObj[options.keyParentCode];
                            areaArr.unshift(tmpObj);
                            break;
                        }
                    }
                }
                if(angular.isDefined(cities)) {
                    iLen = cities.length;
                    for(var i=0; i<iLen; i++) {
                        tmpObj = cities[i];
                        if(angular.isDefined(tmpObj) && tmpObj[options.keyCode] == code) {
                            code = tmpObj[options.keyParentCode];
                            areaArr.unshift(tmpObj);
                            break;
                        }
                    }
                }
                if(angular.isDefined(provinces)) {
                    iLen = provinces.length;
                    for(var i=0; i<iLen; i++) {
                        tmpObj = provinces[i];
                        if(angular.isDefined(tmpObj) && tmpObj[options.keyCode] == code) {
                            code = tmpObj.parent;
                            areaArr.unshift(tmpObj);
                            break;
                        }
                    }   
                }
        
                return areaArr;
            }
            
            // 根据 code 获取对应的 省-市-区 对应的结点数组
            var getRegionNodes = function(code) {
                var areaArr = [];
                
                areaArr = getNodes(code, areaCascade);
                if(areaArr.length === 0) {
                    areaArr = getNodes(code, areaAllHistory);
                }
                
                return areaArr;
            };
            
            // 市的选择数据组成一个数组，用于过滤搜索
            var getCitiesAll = function() {
                var cities = [];
                
                if(!angular.equals(areaCity, {}) && angular.isUndefined(areaCity.citiesAll)) {
                    angular.forEach(areaCity.origData, function(value, key) {
                        if(key !== options.keyCommon) {
                            cities = cities.concat(value);
                        }
                    });
                }
                
                return cities;
            };
            
            /*
             * 获取地区名称全路径
             * */ 
            this.getAreaPath = function(code) {
    //          areaPath = getRegionWithRoot(code);
                var areaPath = '',
                    areaArr = [],
                    iLen = 0;
                
                if(angular.isDefined(areaCascade.origData)) {
                    areaArr = getRegionNodes(code);
                }           
                
                iLen = areaArr.length;
                for(var i=0; i<iLen; i++) {
                    if(angular.equals(areaPath, '')) {
                        areaPath += areaArr[i][options.keyName];
                    } else {
                        areaPath += '-' + areaArr[i][options.keyName];
                    }               
                }
                            
                return areaPath;
            };
            
            this.getCityArea = function(code) {
                var cityName = '';
                
                return cityName;
            };
            
            /*
             * 获取市的名称
             * */ 
            this.getArea = function(code) {
                // 获取市的名称[去掉市、地区等文字]
                // area = $filter('cityNameShort')(code);
                var areaName = '';
                if(areaCity.origData) {
                    areaName = _this.getCity(code)[options.keyShortName];
                }
                
                return areaName;
            };

            /*
             * 根据code获取所有层级节点
             * */ 
            this.getRegionNodes = function(code) {
                return getRegionNodes(code);
            };
            
            // 根据 code 获取对应的市
            this.getCity = function(code) {
                var cities = [],
                    iLen = 0;
                
                if(angular.isDefined(areaCity.citiesAll)) {
                    cities = areaCity.citiesAll;
                } else if(angular.isDefined(areaCity.origData)) {               
                    cities = getCitiesAll();
                    
                    areaCity.citiesAll = cities;
                }
                
                iLen = cities.length;
                
                for(var i=0; i<iLen; i++) {
                    if(cities[i][options.keyCode] == code) {
                        return cities[i];
                    }
                }
                
                return _this.getCityFromAllData(code);
                // return { SHORT_NAME: '' };
                
            };
            
            this.getCityFromAllData = function(code) {
                var cities = [],
                    iLen = 0;
                
                if(angular.isDefined(areaCascade.cities)) {
                    cities = areaCascade.cities;
                } else if(angular.isDefined(areaCascade.origData)) {                
                    areaCascade = generateAreaCascadeData(areaCascade);
                    
                    cities = areaCascade.cities;
                }
                iLen = cities.length;
                for(var i=0; i<iLen; i++) {
                    if(cities[i][options.keyCode] == code) {
                        return cities[i];
                    }
                }
                
                if(angular.isDefined(areaAllHistory.cities)) {
                    cities = areaAllHistory.cities;
                } else if(angular.isDefined(areaAllHistory.origData)) {                 
                    areaAllHistory = generateAreaCascadeData(areaAllHistory);
                    cities = areaAllHistory.cities;
                }
                iLen = cities.length;
                for(var i=0; i<iLen; i++) {
                    if(cities[i][options.keyCode] == code) {
                        return cities[i];
                    }
                }
                
                return { SHORT_NAME: '' };
            }
            
            /*
             * 获取市选择的所有数据，用于过滤搜索
             * */ 
            this.getCitiesAll = function() {
                if(areaCity.citiesAll) {
                    return areaCity.citiesAll;
                } else {
                    return getCitiesAll();
                }
            };
            
            /*
             * 获取地区：市选择的数据
             * */
            this.getAreaCity = function() {
                return areaCity;
            };
            
            /*
             * 获取地区：省市区的数据
             * */
            this.getAreaCascade = function() {
                return areaCascade;
            };
            
            /*
             * 获取字段名称的配置关系
             * */
            this.getKeysOptions = function() {
                return options;
            };
            
            /*
             * 地区维护使用的获取已选项的结点数据
             * */
            this.getAreaMaintainRegionNodes = function(dataAll, code) {
                if(angular.isUndefined(dataAll) || angular.isUndefined(code)) {
                    return false;
                }
                var regionNodes = [],
                    countries = [],
                    provinces = [],
                    cities = [],
                    country = null,
                    province = null,
                    city = null,
                    countriesLen = dataAll.length,
                    provincesLen = 0,
                    citiesLen = 0;
                
                countries = dataAll;
                
                for(var i=0; i<countriesLen; i++) {
                    country = dataAll[i];
                    if(country[options.keyChildren]) {
                        provinces = provinces.concat(country[options.keyChildren]);
                    }               
                }           

                provincesLen = provinces.length;
                for(var j=0; j<provincesLen; j++) {
                    province = provinces[j];
                    if(province[options.keyChildren]) {
                        cities = cities.concat(province[options.keyChildren]);
                    }               
                }
                
                citiesLen = cities.length;
                for(var i=0; i<citiesLen; i++) {
                    city = cities[i];
                    if(city[options.keyCode] == code) {
                        regionNodes.unshift(city);
                        code = city[options.keyParentCode];
                    }
                }
                provincesLen = provinces.length;
                for(var i=0; i<provincesLen; i++) {
                    province = provinces[i];
                    if(province[options.keyCode] == code) {
                        regionNodes.unshift(province);
                        code = province[options.keyParentCode];
                    }
                }
                countriesLen = countries.length;
                for(var i=0; i<countriesLen; i++) {
                    country = countries[i];
                    if(country[options.keyCode] == code) {
                        regionNodes.unshift(country);
                        code = country[options.keyParentCode];
                    }
                }
                
                return regionNodes;
            }

            /**
             * 判断节点数据是否是虚拟数据
             * @param:node，对应节点
             * @param:virtualCodeArr，虚拟数据数组
             * @return {Boolean} true/false
             */
            this.isVirtualNode = function(node, virtualCodeArr) {
                if(angular.isUndefined(node) || angular.equals(node, null)) {
                    return false;
                }
                if(virtualCodeArr.indexOf(node[options['keyCode']]) > -1) {
                    return true;
                }

                return false;
            }

        }
    ]);
})(angular.module('app'));