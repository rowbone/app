// vendor/modules/angular-bootstrap-nav-tree/abn_tree_tpl.html

// (function() {
//   var module;

//   module = angular.module('angularBootstrapNavTree', []);
  /*searchOnSelect:'&', //点击搜索结果事件*/  
  app.directive('conowAreaTree', ['$timeout','$http', '$filter', 'AreaService', 
    function($timeout, $http, $filter, AreaService) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          onSelect: '&',  //点击节点事件
          initialSelection: '@', //初始化节点
          arrResults:'@arrRe', //搜索结果数组
          treeControl: '=',//树的方法调用对象
          treeData : '=',//树的数据对象
          arrSelected: '=',//多选返回的数组
        },
        templateUrl: function(tElem, tAttrs) {
          return 'vendor/modules/angular-bootstrap-nav-tree/abn_tree_tpl.html';
        },
        link: function(scope, element, attrs) {
          var error, expand_all_parents, expand_level, for_all_ancestors, 
              for_each_branch, get_parent, n, on_treeData_change, 
              select_branch ,multiselect_branch,foreach_selected_arr, 
              selected_branch, tree ,multiselect,reset_treeData,adduser;
          
          error = function(s) {
            console.log('ERROR:' + s);
            debugger;
            return void 0;
          };
          // 配置项
          var options = scope.options = {
            showSearch: true,
            iconExpand: 'fa fa-plus',
            iconCollapse: 'fa fa-minus',
            iconLeaf: 'fa fa-leaf',
            expandLevel: 2,
            showTree: true,
            deviceType: 'PC',
            multiSelect: false,
            selectLevel: 1
          };
          if((attrs.multiSelect !== undefined && attrs.multiSelect !== 'false') || attrs.multiSelect === 'true') {
            options.multiSelect = true;
          } else {
            options.multiSelect = false;
          }
          // showSearch:default true.是否显示搜索框，默认为true
          if(attrs.showSearch === 'false') {
            options.showSearch = false;
          } else {
            options.showSearch = true;
          }
          // searchElement: default label.搜索字段
          if(attrs.searchElement === undefined) {
            options.searchElement = 'label';
          } else {
            options.searchElement = attrs.searchElement;
          }

          // deviceType:default PC.展示类型，默认为PC
          if(attrs.deviceType === 'phone') {
            options.deviceType = 'phone';
          } else {
            options.deviceType = 'PC';
          }
          if(attrs.deviceType === undefined || attrs.deviceType === '') {
            options.deviceType = 'PC';
          } else {
            options.deviceType = attrs.deviceType;
          }

          // 是否展示树
          if(attrs.showTree === 'false') {
            options.showTree = false;
          } else {
            options.showTree = true;
          }
          // 选择树的层级,默认为1
          if(attrs.selectLevel) {
            options.selectLevel = attrs.selectLevel;
          }
          // 节点可展开图标初始化
          if (attrs.iconExpand === undefined || attrs.iconExpand === '') {
            if (options.deviceType == "phone") {
              options.iconExpand = 'fa fa-angle-down';
            } else {
              options.iconExpand = 'fa fa-plus';
            }
          } else {
            options.iconExpand = attrs.iconExpand;
          }
          // 节点可收缩图标初始化
          if (attrs.iconCollapse === undefined || attrs.iconCollapse === '') {
            if (options.deviceType == "phone") {
              options.iconCollapse = 'fa fa-angle-up';
            } else {
              options.iconCollapse = 'fa fa-minus';
            }
          } else {
            options.iconCollapse = attrs.iconCollapse;
          }
          // 叶节点图标初始化
          if (attrs.iconLeaf == undefined) {
            options.iconLeaf = '';
          } else {
            options.iconLeaf = attrs.iconLeaf;
          }
          // 默认展开层级数
          if (attrs.expandLevel === undefined || attrs.expandLevel === '') {
            options.expandLevel = '2';
          }

          expand_level = parseInt(attrs.expandLevel, 10);
          //请求获取后台数据并加载到树上
          scope.treeData = [];
          // scope.treeData = scope.$eval(attrs.treeDataShow);

          var getTreeData = function(location){
            var location = 'data/components/area/region.js';

            var treeData = [];
            // $http.get(location)
            //   .success(function(data){
            //     if(data.obj) {
            //       data = data.obj;
            //     }
            //     options.isLoading = false;
            //     scope.treeData = data;
            //     return $timeout(function() {
            //       tree.expand_level();
            //     }, 1000);
            //   })
            //   .error(function() {
            //     console.log('Load tree data wrong...');
            //   });
            
            scope.treeData = AreaService.getAllCityGroup();
            options.isLoading = false;

            return $timeout(function() {
              tree.expand_level();
            }, 1000);

          };

          options.isLoading = true;

          // 异步加载数据
          getTreeData(attrs.reqUrl);

          scope.treeSelect = function(e, row) {
            if(row.level === 1) {
              // 一级节点展开，选择了对应字母，树的节点已经被过滤，故应该在收起时还原回所有节点
              if(row.branch.expanded && row.branch.origChildren) {
                row.branch.children = row.branch.origChildren;
              }

              row.branch.expanded = !row.branch.expanded;
              if(row.subLabels) {
                scope.filterByLetter(e, row, row.subLabels[0]);
              }
            } else {
              scope.user_clicks_branch(row.branch);
            }
          };

          // 字母过滤每组的市级节点
          scope.filterByLetter = function(e, row, subLabel) {
            options.subLabelSelect = subLabel;
            // row.branch.origChildren 用于保存每组过滤前的子节点，用于还原操作
            if(!row.branch.origChildren) {
              row.branch.origChildren = row.branch.children;
            }

            var arrOrigChildren = row.branch.origChildren,
                iLen = arrOrigChildren.length,
                arrChildren = [];

            for(var i=0; i<iLen; i++) {
              if(arrOrigChildren[i].spell.charAt(0) === subLabel.toLowerCase()) {
                arrChildren.push(arrOrigChildren[i]);
              }
            }

            row.branch.children = arrChildren;

            e.stopPropagation();
          };

          // Enter 触发搜索事件
          scope.enterPress = function(e) {
            // enter keycode == 13
            // if(e.keyCode === 13) {
              scope.treeSearchFunc();
            // }
          };
        
          scope.treeSearch = {};

          scope.treeSearchFunc = function() {
            options.showTree = false;
            options.searchLoading = true;
            select_branchs(scope.treeSearch.inputName);
          };

          // 关闭搜索结果，返回选择树
          scope.showTreeFunc = function(){
            return $timeout(function(){
              scope.treeSearch.inputName = '';
              options.showTree = true;
            });
          };

          //根据数据源拼凑树
          for_each_branch = function(f) {
            var do_f, root_branch, _i, _len, _ref, _results;
            do_f = function(branch, level) {
              var child, _i, _len, _ref, _results;
              f(branch, level);
              if (branch.children != null) {
                _ref = branch.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  _results.push(do_f(child, level + 1));
                }
                return _results;
              }
            };
            _ref = scope.treeData;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              root_branch = _ref[_i];
              _results.push(do_f(root_branch, 1));
            }

            return _results;
          };
          selected_branch = null;
          
          //根据节点label来寻找节点
          if (attrs.searchElement == null) {
            attrs.searchElement = "label";
          };
          var searchKey = attrs.searchElement;
          var searchKeyArr = new Array();
          searchKeyArr = searchKey.split(";");
          var searchIf = "";
          var arrSearch = [];
          for (var i = 0; i < searchKeyArr.length; i++) {
            searchIf = searchIf + "|| b." + searchKeyArr[i] + ".indexOf(label)>=0 ";
            arrSearch.push("b." + searchKeyArr[i] + ".indexOf(label)>=0");
          };
          searchIf = searchIf.substring(3, searchIf.length);
          var select_branchs = function(label) {

            scope.searchResults = {}; //树的搜索返回结果显示对象
            scope.searchResults.success = true;

            for_each_branch(function(b) {
              if (b.selected) {
                b.selected = false;
              }
            });
            arrResults = [];

            for_each_branch(function(b) {
              // eval将字符串转换为条件
              if (eval(searchIf)) {
                return $timeout(function() {
                  select_branch_mutiple(b);
                });
              }
            });

            // 搜索返回对象
            return $timeout(function() {
              // 搜索结果中增加是否选中标识，用于添加显示样式
              var iLen = arrResults.length;
              for(var i=0; i<iLen; i++) {
                arrResults[i].selected = false;
              }

              scope.searchResults.results = arrResults;
              if (scope.searchResults.results.length > 0) {
                // 树的搜索返回结果显示
                scope.searchResults.success = true;
              } else {
                scope.searchResults.success = false;
              }
            }, 10);
          };
          //根据节点id来寻找节点
          var select_branch_id = function(id) {
            var branch;
            for_each_branch(function(b) {
              if (b.id == id) {
                branch = b;
              }
            });
            return branch;
          };

          var select_branch_by_code = function(code) {
            var branch;
            for_each_branch(function(b) {
              if(b.CODE === code || b.code === code) {
                branch = b;
              }
            });

            return branch;
          };

          // 选择多个节点
          var arrResults = [];
          select_branch_mutiple = function(branch) {
            if(branch.level == 1) {
              return;
            }
            var iLen = arrResults.length;

            for(var i=0; i<iLen; i++) {
              if(branch.CODE == arrResults[i].CODE) {
                break;
              }
            }
            // if(options.strMunicipalitiesCode.indexOf(branch.CODE) > -1 || branch.level == 2) {
            if(i == iLen) {
              arrResults.push(branch);
            }
            // }
          };
          // 点击搜索结果
          scope.searchResultClick = function(branch) {
            // 取消选择
            if(branch.selected) {
              branch.selected = false;

              return $timeout(function() {
                return scope.onSelect({
                  branch: null
                });
              });
            }
            // 取消其他选项
            // if(!options.multiSelect) {
              var arr = scope.searchResults.results,
                  iLen = arr.length;
              for(var i=0; i<iLen; i++) {
                arr[i].selected = false;
              }
              branch.selected = true;
            // }

            return $timeout(function() {
              return scope.onSelect({
                branch: branch
              });
            });
          };

          // 北京市、上海市、天津市、重庆市
          options.arrMunicipalitiesCode = ['11000000', '31000000', '12000000', '50000000'];
          options.strMunicipalitiesCode = options.arrMunicipalitiesCode.toString();

          // 点击一个节点
          select_branch = function(branch) {
            branch.expanded = !branch.expanded
            // if(branch.id == undefined){
              tree.expand_branch(branch);
              // return;
            // }
            // 
            var level = branch.level;
            // if(options.strMunicipalitiesCode.indexOf(branch.CODE) > -1) {
            //   level = level + 1;
            // }
            // if(level != options.selectLevel) {
            //   return;
            // }

            // 清空所有选择
            for_each_branch(function(b) {
              if (b.selected) {
                b.selected = false;
              }
            });
            if (!branch) {
              if (selected_branch != null) {
                selected_branch.selected = false;
              }
              selected_branch = null;
              return;
            }
            if (branch !== selected_branch) {
              if (selected_branch != null) {
                selected_branch.selected = false;
              }
              branch.selected = true;
              selected_branch = branch;
              expand_all_parents(branch);
              if (branch.onSelect != null) {
                return $timeout(function() {
                   return branch.onSelect(branch);
                });
              } else {
                if (scope.onSelect != null) {
                  return $timeout(function() {
                    return scope.onSelect({
                      branch: branch
                    });
                  });
                }
              }
            }
          };
          //多选操作
          var selected_arr = new Array();
          multiselect_branch = function(branch) {
            if(branch.id == undefined){
                tree.expand_branch(branch);
              return;
              }
            //在多选数组中通过id查找是否存在该节点
            branchSelected = foreach_selected_arr(branch.id,selected_arr);
            //如果存在将该节点从数组中移除，不存在即放进数组中
            if(branchSelected != undefined){
              branchSelected.selected = false;
              selected_arr.indexof = function(id) {
                          var a = this;
                          for (var i = 0; i < a.length; i++) {
                              if (a[i].id == id)
                                  return i;
                          }
                      };
                bnum = selected_arr.indexof(branch.id);
                selected_arr.splice(bnum, 1);
            }else if(branch.id != undefined){//如果树节点id存在（不存在的是组织中的分类）
                  branch.selected = true;
                  selected_branch = branch;
                  selected_arr.push(branch);
                  expand_all_parents(branch);
                  scope.arrSelected = selected_arr;
                  //动态输出选择树的数组
            }else{//如果树节点的id不存在
              branch.selected = false;
              tree.expand_branch(branch);
            }
            if (branch.onSelect != null) {
                return $timeout(function() {
                   return branch.onSelect(selected_arr,"arr");
                });
              } else {
                if (scope.onSelect != null) {
                  return $timeout(function() {
                    return scope.onSelect({
                      branch: branch
                    });
                  });
                }
              }
          };
          //遍历已经选择的节点
          foreach_selected_arr = function(id,arr){
            for(var i = 0; i < arr.length; i++){
              if(id == arr[i].id){
                return arr[i];
              };
            };
          };
          if (attrs.multiselect == "true") {
            scope.user_clicks_branch = function(branch) {
              return multiselect_branch(branch);
            };
          } else {
            scope.user_clicks_branch = function(branch) {
              if (branch !== selected_branch) {
                return select_branch(branch);
              }
            };
          }
          get_parent = function(child) {
            var parent;
            parent = void 0;
            if (child.parent_uid) {
              for_each_branch(function(b) {
                if (b.uid === child.parent_uid) {
                  return parent = b;
                }
              });
            }
            return parent;
          };
          for_all_ancestors = function(child, fn) {
            var parent;
            parent = get_parent(child);
            if (parent != null) {
              fn(parent);
              return for_all_ancestors(parent, fn);
            }
          };
          expand_all_parents = function(child) {
            return for_all_ancestors(child, function(b) {
              return b.expanded = true;
            });
          };
          scope.tree_rows = [];
    on_treeData_change = function() {
      var add_branch_to_list, root_branch, _i, _len, _ref, _results;
      for_each_branch(function(b, level) {
        if (!b.uid) {
          return b.uid = "" + Math.random();
        }
      });
      for_each_branch(function(b) {
        var child, _i, _len, _ref, _results;
        if (angular.isArray(b.children)) {
          _ref = b.children;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            _results.push(child.parent_uid = b.uid);
          }
          return _results;
        }
      });
      scope.tree_rows = [];
      for_each_branch(function(branch) {
        var child, f;
        if (branch.children) {
          if (branch.children.length > 0) {
            f = function(e) {
              if (typeof e === 'string') {
                return {
                  label: e,
                  children: []
                };
              } else {
                return e;
              }
            };
            return branch.children = (function() {
              var _i, _len, _ref, _results;
              _ref = branch.children;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                child = _ref[_i];
                _results.push(f(child));
              }
              return _results;
            })();
          }
        } else {
          return branch.children = [];
        }
      });
      var subLabelMap = {
        'A-E': ['A', 'B', 'C', 'D', 'E'],
        'F-J': ['F', 'G', 'H', 'I', 'J'],
        'K-O': ['K', 'L', 'M', 'N', 'O'],
        'P-T': ['P', 'Q', 'R', 'S', 'T'],
        'U-Z': ['U', 'V', 'W', 'X', 'Y', 'Z']
      };
      add_branch_to_list = function(level, branch, visible) {
        // 对直辖市做特殊判断，去掉其下级节点
        if(options.strMunicipalitiesCode.indexOf(root_branch.CODE) > -1) {
          branch.children = null; 
        }
        var child, child_visible, tree_icon, _i, _len, _ref, _results,check;
        if (branch.expanded == null) {
          branch.expanded = false;
        }
        if (!branch.children || branch.children.length === 0) {
          tree_icon = options.iconLeaf;
        } else {
          if (branch.expanded) {
            tree_icon = options.iconCollapse;
          } else {
            tree_icon = options.iconExpand;
          }
        }

        scope.tree_rows.push({
          level: level,
          branch: branch,
          label: branch.label,
          // label: branch.name,
          subLabels: subLabelMap[branch.label],   // 子标题
          tree_icon: tree_icon,
          visible: visible
        });
        if (branch.children != null) {
          _ref = branch.children;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            child_visible = visible && branch.expanded;
            _results.push(add_branch_to_list(level + 1, child, child_visible));
          }
          return _results;
        }
      };

      _ref = scope.treeData;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        root_branch = _ref[_i];
        _results.push(add_branch_to_list(1, root_branch, true));
      }
      return _results;
    };

          // 监听 treeData 变化，触发相应方法 on_treeData_change
          scope.$watch('treeData', on_treeData_change, true);
          if (attrs.initialSelection != null) {
            for_each_branch(function(b) {
              if (b.label == attrs.initialSelection) {
                return $timeout(function() {
                  return select_branch(b);
                });
              }
            });
          }
          n = scope.treeData.length;
          for_each_branch(function(b, level) {
            b.level = level;
            return b.expanded = b.level < expand_level;
          });
          
          //tree方法控制对象
          if (scope.treeControl == null) {
            //如果在控制器中为声明对象，则初始化
            scope.treeControl = {};
          }
          //初始化多选返回的数组
          if (scope.arrSelected == null){
            scope.arrSelected = [];
          }
        if (angular.isObject(scope.treeControl)) {
          tree = scope.treeControl;
          tree.expand_level = function() {
              return for_each_branch(function(b, level) {
                b.level = level;
                return b.expanded = b.level < expand_level;
              });
            };
          tree.expand_all = function() {
            return for_each_branch(function(b, level) {
                return b.expanded = true;
            });
          };
          tree.collapse_all = function() {
            return for_each_branch(function(b, level) {
              return b.expanded = false;
            });
          };
          tree.get_first_branch = function() {
            n = scope.treeData.length;
            console.info(n + "treeData length");
            if (n > 0) {
              return scope.treeData[0];
            }
          };
          tree.select_first_branch = function() {
            var b;
            b = tree.get_first_branch();
            return tree.select_branch(b);
          };
          tree.get_selected_branch = function() {
            return selected_branch;
          };
          var arr = new Array();
          tree.get_multiselect_branchs = function(){
            for_each_branch(function(b) {
                arr.push(tree.multiselect_branch(b));
                });
            return arr;
          };
          tree.get_parent_branch = function(b) {
            return get_parent(b);
          };
          
          tree.select_branch = function(b) {
            select_branch(b);
            return b;
          };
          tree.multiselect_branch = function(b) {
          multiselect_branch(b);
          return b;
          };
          tree.select_branchs = function(b) {
              select_branchs(b);
              return b;
            };
            tree.select_branch_id = function(b) {
                return select_branch_id(b);;
              };
              tree.selected_delete = function(b){
                return selected_delete(b);
              };
          tree.get_children = function(b) {
            return b.children;
          };
          tree.select_parent_branch = function(b) {
            var p;
            if (b == null) {
              b = tree.get_selected_branch();
            }
            if (b != null) {
              p = tree.get_parent_branch(b);
              if (p != null) {
                tree.select_branch(p);
                return p;
              }
            }
          };

          //添加节点
          tree.add_branch = function(parent, new_branch) {
            if (parent != null) {
              parent.children.push(new_branch);
              parent.expanded = true;
              for_each_branch(function(b) {
                if (b.selected) {
                  b.selected = false;
                }
              });
              /*new_branch.selected = true;*/
              return $timeout(function() {
                tree.select_branch(new_branch);
                expand_all_parents(new_branch);
              });
            } else {
              scope.treeData.push(new_branch);
            }
            return new_branch;
          };
          //修改节点
          tree.edit_branch = function(branch, newName) {
            branch.label = newName;
            branch.selected = true;
            return $timeout(function() {
              tree.select_branch(branch);
              expand_all_parents(branch);

            });
            return branch;
          };
          //删除节点
          tree.delete_branch = function(b) {
            var p;
            p = tree.get_parent_branch(b);
            if (p != null) {
              var arr = p.children;
              console.info(arr);
              arr.indexof = function(value) {
                var a = this;
                for (var i = 0; i < a.length; i++) {
                  if (a[i] == value)
                    return i;
                }
              };
              bnum = arr.indexof(b);
              //删除的提示在业务中
              p.children.splice(bnum, 1);
              return $timeout(function() {
                p = tree.get_parent_branch(b);
                tree.select_branch(p);
                expand_all_parents(b);
              });
            }
          };
          tree.add_root_branch = function(new_branch) {
            tree.add_branch(null, new_branch);
            return new_branch;
          };
          tree.expand_branch = function(b) {
            if (b == null) {
              b = tree.get_selected_branch();
            }
            if (b != null) {
              b.expanded = true;
              return b;
            }
          };
          tree.collapse_branch = function(b) {
            if (b == null) {
              b = selected_branch;
            }
            if (b != null) {
              b.expanded = false;
              return b;
            }
          };
          tree.get_siblings = function(b) {
            var p, siblings;
            if (b == null) {
              b = selected_branch;
            }
            if (b != null) {
              p = tree.get_parent_branch(b);
              if (p) {
                siblings = p.children;
              } else {
                siblings = scope.treeData;
              }
              return siblings;
            }
          };
          tree.get_next_sibling = function(b) {
            var i, siblings;
            if (b == null) {
              b = selected_branch;
            }
            if (b != null) {
              siblings = tree.get_siblings(b);
              n = siblings.length;
              i = siblings.indexOf(b);
              if (i < n) {
                return siblings[i + 1];
              }
            }
          };
          tree.get_prev_sibling = function(b) {
            var i, siblings;
            if (b == null) {
              b = selected_branch;
            }
            siblings = tree.get_siblings(b);
            n = siblings.length;
            i = siblings.indexOf(b);
            if (i > 0) {
              return siblings[i - 1];
            }
          };
          tree.select_next_sibling = function(b) {
            var next;
            if (b == null) {
              b = selected_branch;
            }
            if (b != null) {
              next = tree.get_next_sibling(b);
              if (next != null) {
                return tree.select_branch(next);
              }
            }
          };
          tree.select_prev_sibling = function(b) {
            var prev;
            if (b == null) {
              b = selected_branch;
            }
            if (b != null) {
              prev = tree.get_prev_sibling(b);
              if (prev != null) {
                return tree.select_branch(prev);
              }
            }
          };
          tree.get_first_child = function(b) {
            var _ref;
            if (b == null) {
              b = selected_branch;
            }
            if (b != null) {
              if (((_ref = b.children) != null ? _ref.length : void 0) > 0) {
                return b.children[0];
              }
            }
          };
          tree.get_closest_ancestor_next_sibling = function(b) {
            var next, parent;
            next = tree.get_next_sibling(b);
            if (next != null) {
              return next;
            } else {
              parent = tree.get_parent_branch(b);
              return tree.get_closest_ancestor_next_sibling(parent);
            }
          };
          tree.get_next_branch = function(b) {
            var next;
            if (b == null) {
              b = selected_branch;
            }
            if (b != null) {
              next = tree.get_first_child(b);
              if (next != null) {
                return next;
              } else {
                next = tree.get_closest_ancestor_next_sibling(b);
                return next;
              }
            }
          };
          tree.select_next_branch = function(b) {
            var next;
            if (b == null) {
              b = selected_branch;
            }
            if (b != null) {
              next = tree.get_next_branch(b);
              if (next != null) {
                tree.select_branch(next);
                return next;
              }
            }
          };
          tree.last_descendant = function(b) {
            var last_child;
            if (b == null) {
              debugger;
            }
            n = b.children.length;
            if (n === 0) {
              return b;
            } else {
              last_child = b.children[n - 1];
              return tree.last_descendant(last_child);
            }
          };
          tree.get_prev_branch = function(b) {
            var parent, prev_sibling;
            if (b == null) {
              b = selected_branch;
            }
            if (b != null) {
              prev_sibling = tree.get_prev_sibling(b);
              if (prev_sibling != null) {
                return tree.last_descendant(prev_sibling);
              } else {
                parent = tree.get_parent_branch(b);
                return parent;
              }
            }
          };
          return tree.select_prev_branch = function(b) {
            var prev;
            if (b == null) {
              b = selected_branch;
            }
            if (b != null) {
              prev = tree.get_prev_branch(b);
              if (prev != null) {
                tree.select_branch(prev);
                return prev;
              }
            }
          };
        }
          
        }
      };
    }
  ]);

// }).call(this);

