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
  var selectedOrg = null;
  var selectedStaff = null;

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

// 已关注 service，保存已关注的人员和组织
app.service('followService', ['$http', 'DataService', 
    function($http, DataService) {
      var self = this,
          orgs = [],
          persons = [],
          staffs = [], 
          params = {},
          urlFollows = '/service/followItem!queryFollowItemByFollowType';
//      isLoading = true;
      
      var getFollows = function(followType) {
        if(followType == 'STAFF') {
          params = {
          'FOLLOW_TYPE': 'STAFF'
          };
        } else if(followType == 'ORG') {
          params = {
          'FOLLOW_TYPE': 'ORG'
          };
        } else {
          params = {};
        }
          // 获取已关注的人员和组织，页面操作过程中维护获得的 orgs 和 persons
          $http.post(urlFollows, params)
            .success(function(data, status, headers, config) {
//              isLoading = false;
              var collections = data.obj;
              orgs = collections.orgFollowItem;
              persons = collections.staffFollowItem;
              staffs = collections.staffFollowItem;
            })
            .error(function(data, status, headers, config) {
              console.error('Get "' + urlCollections + '" wrong...');
            });
        
      };
      
      getFollows();

      this.follow = function(params) {
        var urlFollow = '/service/followItem!saveEntity';

        DataService.postData(urlFollow, params)
          .then(function(data) {
            if(data.success) {
              var followType = params['FOLLOW_TYPE'].toLowerCase();
              if(followType === 'staff') {
                self.addStaff(data.obj);
              } else if(followType === 'org') {
                self.addOrg(data.obj);
              } else {
                console.log('Get wrong followType...');
              }
            }
          }, function(msg) {
            console.log(msg);
          })
      };

      this.unFollow = function(followItem, strType) {
        var urlUnFollow = '/service/followItem!deleteEntity';
        var params = { 'ID': followItem.ID };

        DataService.postData(urlUnFollow, params)
          .then(function(data) {
            if(data.success) {
              if(strType == 'org') {
                self.removeOrg(followItem);
                console.log('unfollow success...');
              } else if(strType == 'staff') {
                self.removeStaff(followItem);
                console.log('unfollow success...');
              } else {
                console.log('unfollow wrong...');
              }
            }
          }, function(msg) {
            console.log(msg);
          });
      };

      this.setOrgs = function(orgs) {
        orgs = orgs;
      };
      
      this.setPersons = function(persons) {
        persons = persons;
      };

      this.setStaffs = function(staffs) {
        staffs = staffs;
      }

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

      this.addStaff = function(staff) {
        staffs.push(staff);
      };

      this.removeStaff = function(staff) {
        var index = -1;
        for(var i=0; i<staffs.length; i++) {
          if(staffs[i].ID == staff.ID) {
            index = i;
            break;
          }
        }
        staffs.splice(i, 1);
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

      this.getStaffs = function() {
        return staffs;
      }

      this.getAll = function() {
        return {
          orgs: orgs,
          persons: persons,
          staffs: staffs
        };
      };

    }
  ]);

app.filter('letterFilter', ['$filter', 
  function($filter) {
    return function(input, letter) {
      var arrRtn = [];
      angular.forEach(input, function(value, key) {
        if(value['GROUPCODE'] === letter) {
          arrRtn.push(value);
        }
      });

      return arrRtn;
    }
  }
]);

app.filter('userGroupByLetter', ['$filter', 
  function($filter) {
    return function(input, groupCode) {
      if(!angular.isArray(input)) {
        console.error('Input must be an array...');
        return;
      }

      var groupCode = groupCode,
          arrData = input,
          arrLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
          label = '',
          iLabelLen = arrLabels.length,
          arrPersons = [];

      for(var i=0; i<iLabelLen; i++) {
        // arrPersons.push([]);
      }

      if(angular.isUndefined(groupCode)) {
        groupCode = 'name';
      }

      angular.forEach(arrData, function(value, key) {
        value[groupCode] = value[groupCode].toUpperCase();
      });

      for(var i=0; i<iLabelLen; i++) {
        label = arrLabels[i];
        arrPersons.push({
          'label': label,
          'persons': $filter('letterFilter')(arrData, label)
        });
      }

      return arrPersons;
    }
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