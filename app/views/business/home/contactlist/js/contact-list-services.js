'use strict';

//OrgSearch service 用于保存点击的组织
app.service('OrgSearch', function(){
  var selectedOrg = '';
  var selectedStaff = '';

  this.setOrg = function(org) {
    selectedOrg = org;
  };

  this.getOrg = function() {
    return selectedOrg;
  };

  this.setStaff = function(staff) {
    selectedStaff = staff;
  };

  this.getStaff = function() {
    return selectedStaff;
  };

});

// 已选择的数据
app.service('DataSelected', function(){
  var selectedStaff = '';

  this.setStaff = function(staff) {
    selectedStaff = staff;
  };

  this.getStaff = function() {
    return selectedStaff;
  };

});

// 已关注 service，保存已关注的人员和组织
app.service('CollectionService', ['$http', 
    function($http) {
      var orgs = [],
      persons = [],
      params = {},
      urlCollections = '/service/followItem!queryFollowItemByFollowType';
//      isLoading = true;
      
      var getCollections = function(collectionType) {
        if(collectionType == 'STAFF') {
          params = {
          'FOLLOW_TYPE': 'STAFF'
          };
        } else if(collectionType == 'ORG') {
          params = {
          'FOLLOW_TYPE': 'ORG'
          };
        } else {
          params = {};
        }
          // 获取已关注的人员和组织，页面操作过程中维护获得的 orgs 和 persons
          $http.post(urlCollections, params)
            .success(function(data, status, headers, config) {
//              isLoading = false;
              var collections = data.obj;
              orgs = collections.orgFollowItem;
              persons = collections.staffFollowItem;
            })
            .error(function(data, status, headers, config) {
              console.error('Get "' + urlCollections + '" wrong...');
            });
        
      };
      
      getCollections();

      this.setOrgs = function(orgs) {
        orgs = orgs;
      };
      
      this.setPersons = function(persons) {
        persons = persons;
      };

      this.addOrg = function(org) {
        orgs.push(org);
      };

      this.removeOrg = function(org) {
        var index = -1;
        for(var i=0; i<orgs.length; i++) {
          if(orgs[i].ID == org.ID) {
            index = i;
            break;
          }
        }
        orgs.splice(i, 1);
      };

      this.addPerson = function(person) {
        persons.push(person);
      };

      this.removePerson = function(person) {
        var index = -1;
        for(var i=0; i<persons.length; i++) {
          if(persons[i].ID == person.ID) {
            index = i;
            break;
          }
        }
        persons.splice(i, 1);
      };

      this.getOrgById = function(orgId) {
        // @todo
      };

      this.getOrgs = function() {
        return orgs;
      };

      this.getPersonById = function(personId) {
        // @todo
      };

      this.getPersons = function() {
//        if(isLoading) {
//          
//        }
        return persons;
      };

      this.getAll = function() {
        return {
          orgs: orgs,
          persons: persons
        };
      };

    }
  ]);

// 人员分组过滤器
app.filter('userGroup', ['$filter', 
  function($filter) {
    return function(input, groupCode) {
      if(!angular.isArray(input)) {
        console.error('Input must be an array.');
        return;
      }

      var groupCode = groupCode;
      var arrData = input;
      var arrLabels = ['A - E', 'F - J', 'K - O', 'P - T', 'U - Z'];
      var arrSplit = ['ABCDE', 'FGHIJ', 'KLMNO', 'PQRST', 'UVWXYZ'];
      var arrSplitLower = ['abcde', 'fghij', 'klmno', 'pqrst', 'uvwxyz'];
      var arr = [[], [], [], [], []];

      var arrRtn = [];

      if(angular.isUndefined(groupCode)) {
        groupCode = 'name';
      }
      // 按照 groupCode 排序
      arrData = $filter('orderBy')(arrData, groupCode);
      // 转换 groupCode 为大写字符
      angular.forEach(arrData, function(value, key) {
        value[groupCode] = value[groupCode].toUpperCase();
      });
      for(var i=0; i<arrSplit.length; i++) {
        for(var j=0; j<arrData.length; j++) {
          if(arrSplit[i].indexOf(arrData[j][groupCode]) > -1) {
            arr[i].push(arrData[j]);
          }
        }
        var arrSubLabels = arrSplit[i].split('');
        arrRtn.push({
          'label': arrLabels[i],
          'subLabels': arrSubLabels,
          'persons': arr[i],
          'expanded': false,
          'selectedSub': arrSubLabels[0]
        });
      }

      return arrRtn;
    };
  }
]);