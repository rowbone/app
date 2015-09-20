"use strict"
angular.module('objectTable', []);

angular.module('objectTable')
	.directive('objectTable', ['$compile','$interpolate', 
		function ($compile,$interpolate) {
			return {
				restrict: 'A',
				replace: true,
				templateUrl: 'views/components/conow-responsive-table/tpls/common.html',
				controller: 'objectTableCtrl',
				controllerAs: "ctrl",
				transclude: true,
				scope: {
					data: "=?jsonData",
					display: "=?",
					resize: "=?",
					paging: "=?",
					fromUrl: "@",
					// search: "@?",
					// headers: "@",
					// fields: "@",
					sortingType: "@?sorting",
					editable: "=?",
					select: "@?",
					selectedModel: "=?",
					dragColumns: "=?",
					tableInstance: '=?'
				},
				compile: function( tElement, tAttributes) {

					//collect filters
					var rowFilter = "",
					pagingFilter = "";

					// additional user filters 
					if(!!tAttributes.addFilter){
						rowFilter += tAttributes.addFilter;
					};

					//If SORTING allowed
					if(tAttributes.sorting !== "false") {
						rowFilter += "| orderBy:sortingArray";
					};

					// add 'allow-drag' attribute to header is just cistom tbody present
					if(tAttributes.dragColumns){
						tElement.find('th').attr('allow-drag','')
					}

					//If SEARCH allowed
					if(tAttributes.search == "separate") {
						// var fields = [];
						tAttributes.fields.split(',').forEach(function(item, index) {
							// fields.push( item.trim() );
							rowFilter += "| filter:{'" +item.trim()+ "':columnSearch[" +index+ "]}";
						}); 
					} else if(typeof(tAttributes.search) == 'undefined' || tAttributes.search == "true") {
						rowFilter += "| filter:globalSearch";
					};

					// pagingFilter = rowFilter;
					pagingFilter += " | offset: currentPage:display |limitTo: display";

					// tElement[0].querySelector("#rowTr")
					// 	.setAttribute("ng-repeat","item in $filtered = (data" + rowFilter +")"+ pagingFilter);
					tElement.find('#rowTr')
						.attr('ng-repeat', "item in $filtered = (data" + rowFilter +")"+ pagingFilter)
						.attr('row-generate');
					// add paging
					tElement.find("paging").attr("count", "$filtered.length");

					return function preLink(scope, element, attrs, ctrl, transclude) {
						ctrl._init();
						var ii=0;
						transclude(scope, function(clone, innerScope) {
							scope.$owner = innerScope.$parent;
							for(var key in clone){
								if(clone.hasOwnProperty(key)){
									switch (clone[key].tagName) {
										case 'THEAD':
											ctrl._addHeaderPattern(clone[key]);
											break;
										case 'TBODY':
											scope.findBody = true;
											ctrl._addRowPattern(clone[key],rowFilter,pagingFilter);
											break;
										case 'TFOOT':
											ctrl._addFooterPattern(clone[key]);
											break;
									}
								}
							}
						});
						ctrl.afterTransclude();
					}; //[END transclude]
					
				},

			}

	}
]);

angular.module('objectTable').service('objectTableUtilService', [function () {
		//extend Array [+swap]
		Array.prototype.swap = function (new_index, old_index) {
			
			if (new_index >= this.length) {
				var k = new_index - this.length;
				while ((k--) + 1) {
					this.push(undefined);
				}
			}
			this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    	return this; // for testing purposes
		};

		return {
			getArrayFromParams : function (string,attrName){
				if(!string) throw "Required '" + attrName + "' attribute is not found!";
				var tempArray = [];
				var preArray = string.split(',');
				for (var i = 0, length = preArray.length; i <length; i++) {
					tempArray.push(preArray[i].trim());
				}

				return tempArray;
			}
		};

	}
]);

angular.module('objectTable')
	.controller('objectTableCtrl', ['$scope', '$timeout','$element', '$attrs','$http', '$compile', '$controller', 'objectTableUtilService', 'arrayUtilService', 'tableClass', 
		function angTableCtrl($scope, $timeout, $element, $attrs, $http, $compile, $controller, Util, arrayUtilService, tableClass) {

			$controller('objectTableSortingCtrl', {$scope: $scope});
			var ctrl = this;

			$scope.tableInstance = new tableClass();

			// reloadTrigger to trigger table reload function.
			// Which is initialized with undefined to avoid double _init 
			$scope.$watch('tableInstance.reloadTrigger', 
				function(newVal, oldVal) {
					if(angular.isUndefined(newVal)) {
						return;
					}

					ctrl._reload();
				}, true);

			var vm = $scope.vm = {};
			var options = $scope.options = {
				'noDataTip': '没有符合条件的数据！',
				'searchParams': {
					'globalSearch': '',
					'advancedSearch': {}
				}
			};

			// watch searchParams to reload table
			$scope.$watch('options.searchParams', 
				function(newVal, oldVal) {
					// ctrl._reload();
				}, true);

			/**
			 * paging directive options
			 * isShowRecordsCount: 是否显示记录条数(** 条记录)
			 */
			var pagingOptions = $scope.pagingOptions = {
				isShowRecordsCount: true								
			};

			var expandFn = function() {
				var $tables = angular.element('.object-table');
				var $childRows = $tables.find('.child');
				var $childRow = $tables.find('.child:first');
				var $divs = null;
				var $div = null;
				var isAllDivHidden = true;
				// remove parent class:hidden to show parent
				$childRows.removeClass('hidden');

				$divs = $childRow.find('div');
				for(var i=0; i<$divs.length; i++) {
					$div = angular.element($divs[i]);
					if(!$div.is(':hidden')) {
						isAllDivHidden = false;
						break;
					}
				}

				if(isAllDivHidden) {
					$childRows.addClass('hidden');
				} else {
					$childRows.removeClass('hidden');
				}
			}

			/**
			 * window-resize:to show/hide child-row - starts
			 */
			// angular.element not work
			// var $window = angular.element('window');
			$(window).bind('resize', function() {
				var $tables = angular.element('.object-table');
				var $childRows = $tables.find('.child');
				var $childRow = $tables.find('.child:first');
				var $divs = null;
				var $div = null;
				var isAllDivHidden = true;
				// remove parent class:hidden to show parent
				$childRows.removeClass('hidden');

				$divs = $childRow.find('div');
				for(var i=0; i<$divs.length; i++) {
					$div = angular.element($divs[i]);
					if(!$div.is(':hidden')) {
						isAllDivHidden = false;
						break;
					}
				}

				if(isAllDivHidden) {
					$childRows.addClass('hidden');
				} else {
					$childRows.removeClass('hidden');
				}
			});
			// window-resize:to show/hide child-row - ends

			// isAllSelected to set header-checkbox selected or not
			$scope.isAllSelected = function() {
				var page = $scope.currentPage;
				var count = $scope.display;

				if(angular.isUndefined($scope.$filtered)) {
					return false;
				}

				var pageData = $scope.$filtered.slice(page * count, (page + 1) * count);

				return arrayUtilService.isAllSelected(pageData, '$checked');
			};

			// click header-checkbox
			$scope.headerCheckboxClick = function() {
				var page = $scope.currentPage;
				var count = $scope.display;

				var pageData = $scope.$filtered.slice(page * count, (page + 1) * count);

				if(arrayUtilService.isAllSelected(pageData, '$checked')) {
					arrayUtilService.unSelectedAll(pageData, '$checked');
				} else {
					arrayUtilService.selectedAll(pageData, '$checked');
				}
			};

			// click row-checkbox
			$scope.rowCheckboxClick = function(item) {
				item.$checked = !item.$checked;

				if ($scope.select === "multiply") {
					if (!ctrl._containsInSelectArray(item)) {
						$scope.selectedModel.push(item);
					} else {
						$scope.selectedModel.splice($scope.selectedModel.indexOf(item), 1);
					}
				} else {
					$scope.selectedModel = item;
				}
			};

			$scope.rowExpand = function(item, e) {
				e.stopPropagation();
					
				item.$expanded = !item.$expanded;

				// expandFn();
			};

			$scope.isShowChild = function(item) {
				if(angular.isUndefined(item.$expanded) || !item.$expanded) {
					return false;
				} else {
					return true;
				}

				// if(angular.isDefined(item.$expanded) && !item.$expanded)
			};

			/**
			 * Get global-search or separate-search params
			 * @searchParams
			 */
			this._getSearchParams = function() {
				var searchParams = {
					'searchKey': $scope.globalSearch
				};

				return searchParams; 
			};

			/**
			 * Get advanced-search params
			 * @ advanced-search params
			 */
			this._getAdSearchParams = function() {
				var adSearchParams = {};

				return adSearchParams;
			};

			/**
			 * Get orderby-params(click thead)
			 * @ orderBy params
			 */
			this._getOrderByParams = function() {
				var orderByParams = {};

				return orderByParams;
			};

			/**
			 * Reload table with params(front-end or back-end)
			 * @
			 */
			this._reload = function() {
				var allParams = angular.extend({}, 
					this._getSearchParams(), this._getAdSearchParams(), this._getOrderByParams());

				this._init(allParams);
			};

			this._init = function(params) {
				$scope.headers = [];
				$scope.fields = [];
				$scope.display = $scope.display || 5;
				$scope.paging = angular.isDefined($scope.paging) ? $scope.paging : true;
				$scope.sortingType = $scope.sortingType || "simple";
				$scope.currentPage = 0;
				$scope.customHeader = false;

				if($attrs.search == "separate") {
					$scope.search = "separate";
					$scope.columnSearch = [];

					/* ## after changing search model - clear currentPage ##*/
					$scope.$watch('columnSearch', function() {
						if(!!ctrl.pageCtrl)
							ctrl.pageCtrl.setPage(0);
					}, true);
				} else {
					/* 'separate' or 'true' or 'false '*/
					$scope.search = typeof($attrs.search)==='undefined' || $attrs.search==="true";
				}

				/* GET HEADERS */
				$scope.headers = Util.getArrayFromParams($attrs.headers, 'headers');

				/* GET FIELDS */
				$scope.fields = Util.getArrayFromParams($attrs.fields, 'fields');

				// LOAD FROM EXTERNAL URL
				if(!!$attrs.fromUrl){
					this._loadExternalData($attrs.fromUrl);
				}

				// reinitialize selected model
				$scope.selectedModel = $scope.select === "multiply" ? [] : {};

			};

			this._loadExternalData = function(url) {
				options.dataIsLoading = true;
				$http.get(url).then(function(response) {
					$scope.data = response.data;
					options.dataIsLoading = false;
				}, function(msg) {
					$scope.$filtered = [];

					options.noDataTip = '加载数据失败，请检查！';
					options.dataIsLoading = false;
				});

			};

			this._addHeaderPattern = function(node) {
				$scope.customHeader = true;
				//add Index to drag
				Array.prototype.forEach.call(node.querySelectorAll("[allow-drag]"), function(th,index){
					th.setAttribute('index',index);
				});
				node.removeAttribute('ng-non-bindable');
				$element.find("table").prepend(node);
			};

			this._addFooterPattern = function(node){
				$element.find("table").prepend(node);
			};

			this._addRowPattern = function(node, rowFilter, paggingFilter){
				this._checkEditableContent(node);
				this._addRepeatToRow(node,rowFilter,paggingFilter);
				node.removeAttribute('ng-non-bindable');
				// compile TBODY
				$element.find("table")
					// .append(node.outerHTML)
					.append('<tbody>' + angular.element(node).html() + '</tbody>')
					// generate no-data-tip @20150914 - starts
					.append('<tr class="no-data-tip" ng-if="$filtered.length === 0"><td ng-bind="options.noDataTip" colspan="{{headers.length}}"></td></tr>');
					// generate no-data-tip @20150914 - ends
				
				// add hidden class for td according to collapse-xx classes - starts
				var $tds = angular.element(angular.element($element.find('tbody')[0]).find('tr')[0]).find('td'),
						$colRow = null,
						className = '';

				options.$tds = $tds;
				for(var i=0, iLen = $tds.length; i<iLen; i++) {
					$colRow = angular.element($tds[i]);
					if($colRow.hasClass('collapse-lg')) {
						className = 'hidden-lg hidden-md hidden-sm hidden-xs';
						$colRow.addClass(className);
					} else if($colRow.hasClass('collapse-md')) {
						className = 'hidden-md hidden-sm hidden-xs';
						$colRow.addClass(className);
					} else if($colRow.hasClass('collapse-sm')) {
						className = 'hidden-sm hidden-xs';
						$colRow.addClass(className);
					} else if($colRow.hasClass('collapse-xs')) {
						className = 'hidden-xs';
						$colRow.addClass(className);
					}
				}
				// add hidden class for td according to collapse-xx classes - ends

				this.bodyTemplate = node.innerHTML;
				$compile($element.find("tbody"))($scope);
			};

			this._addRepeatToRow = function(node, rowFilter, paggingFilter) {
				var tr = angular.element(node).find("tr");

				var $firstCol = tr.find('td:first');
				var $icon = angular.element(document.createElement('i'));
				$icon.attr('ng-class', '{ true: "fa-angle-right", false: "fa-angle-down" }[!item.$expanded]')
					.addClass('fa expand-icon');
				$firstCol.prepend($icon);
				$firstCol.addClass('first-column')
					.attr('ng-click', 'rowExpand(item, $event)')
					// .attr('ng-class', '{"collapsed": item.$expanded}');

				// generate checkbox @20150914 - starts
				if(angular.isDefined($attrs.select)) {
					// $scope.headers.unshift('选择');
					tr.prepend('<td><label class="i-checks"><input type="checkbox" class="row-checkbox" ng-checked="item.$checked" ng-click="rowCheckboxClick(item)"><i></i></label></td>');
					options.isShowCheckbox = true;
				}
				// generate checkbox @20150914 - ends

				tr.attr("ng-repeat-start", "item in $filtered = (data" + rowFilter + ")" + paggingFilter);
				if(!tr.attr("ng-click")){
					tr.attr("ng-click","setSelected(item)");
				}
				tr.addClass('parent');

				// tr.attr("ng-class","{'selected-row':ifSelected(item)}");
				
				// var $trChild = angular.element(document.createElement('tr'));
				// $trChild
				// 	.attr('ng-repeat-end', '')
				// 	.addClass('child')
				// 	.html('<td colspan="' + ($scope.headers.length + 1) + '">{{item|json}}</td>');

				var $trChild = this._addChildRow(tr);

				tr.after($trChild);
			};

			/**
			 * _addChildRow:generate child row
			 * @param parent tr 
			 */
			this._addChildRow = function($tr) {
				var $trChild = angular.element(document.createElement('tr'));
				var $tds = $tr.find('td');
				var $td = null;
				var arrHtml = [];
				var headers = angular.copy($scope.headers);
				headers.unshift('');
				for(var i=0, iLen=$tds.length; i<iLen; i++) {
					$td = angular.element($tds[i]);
					if($td.hasClass('collapse-lg')) {
						arrHtml.push('<div class=""><span class="collapse-name">' + headers[i] + '</span><span class="collapse-value">' + $td.html() + '</span></div>');
					} else if($td.hasClass('collapse-md')) {
						arrHtml.push('<div class="hidden-lg"><span class="collapse-name">' + headers[i] + '</span><span class="collapse-value">' + $td.html() + '</span></div>');
					} else if($td.hasClass('collapse-sm')) {
						arrHtml.push('<div class="hidden-lg hidden-md"><span class="collapse-name">' + headers[i] + '</span><span class="collapse-value">' + $td.html() + '</span></div>');
					} else if($td.hasClass('collapse-xs')) {
						arrHtml.push('<div class="hidden-lg hidden-md hidden-sm"><span class="collapse-name">' + headers[i] + '</span><span class="collapse-value">' + $td.html() + '</span></div>');
					}
				}
				$trChild
					.attr('ng-repeat-end', '')
					.attr('ng-show', 'isShowChild(item)')
					.addClass('child')
					.html('<td colspan="' + ($scope.headers.length + 1) + '">' + arrHtml.join('') + '</td>');

				return $trChild;
			};

			this._checkEditableContent = function(node){
				var innerModel,findModelRegex=/\{\{:*:*(.*?)\}\}/g;
				Array.prototype.forEach.call(node.querySelectorAll("[editable]"), function(td){
					innerModel = td.innerHTML.replace(findModelRegex,'$1');
					td.innerHTML = "<span contentEditable ng-model='" +innerModel+ "'>{{" + innerModel + "}}</span>";
				});
			};

			this.setCurrentPage = function(_currentPage) {
				$scope.currentPage = _currentPage;
			};

			$scope.setSelected = function(item) {
				item.$checked = !item.$checked;
				// item.$expanded = !item.$expanded;

				if ($scope.select === "multiply") {
					if (!ctrl._containsInSelectArray(item)) {
						$scope.selectedModel.push(item);
					} else {
						$scope.selectedModel.splice($scope.selectedModel.indexOf(item), 1);
					}
				} else {
					$scope.selectedModel = item;
				}
			};

			this._containsInSelectArray = function(obj) {
				if ($scope.selectedModel.length)
					return $scope.selectedModel.filter(function(listItem) {
						return angular.equals(listItem, obj);
					}).length > 0;
			};

			$scope.ifSelected = function(item) {

				if( !!$scope.selectedModel && $scope.select === "multiply" ) {
					return ctrl._containsInSelectArray(item);
				} else {
					return item.$$hashKey == $scope.selectedModel.$$hashKey;
				}
			};

			/* Drag-n-Drop columns exchange*/
			this.changeColumnsOrder = function(from, to) {
				$scope.$apply(function() {
					$scope.fields.swap(from, to);
					$scope.headers.swap(from, to);
					if(!!$scope.columnSearch) {
						$scope.columnSearch.swap(from, to);
					}
					if(!!ctrl.bodyTemplate) {
						var tds = angular.element(ctrl.bodyTemplate).children(),
						html="",
						tr = document.createElement('tr'),
						tbody = document.createElement('tbody'),
						attributes = $element.find("tbody").find('tr')[0].attributes;
						Array.prototype.swap.apply(tds, [from, to]);

						[].forEach.call(attributes, function(attr, index) {
							tr.setAttribute(attr.name, attr.value);
						});

						for (var i = 0, length=tds.length; i <length; i++) {
							tr.appendChild(tds[i]);
						}

						tbody.appendChild(tr);

						$element.find("tbody").replaceWith(tbody);
						ctrl.bodyTemplate = tbody.innerHTML;
						$compile($element.find('tbody'))($scope);
					}
					if($scope.customHeader){
						var ths = $element.find('th'),
						tr  = document.createElement('tr'),
						thead  = document.createElement('thead');

						Array.prototype.swap.apply(ths,[from,to]);

						for (var i = 0,length=ths.length; i <length; i++) {
							tr.appendChild(ths[i]);
						};
						thead.appendChild(tr);
						$element.find("thead").replaceWith(thead);

					}
					if(!!ctrl.pageCtrl)
						ctrl.pageCtrl.setPage(0);
				});
			};

			/* ## after changing search model - clear currentPage ##*/
			$scope.$watch('globalSearch',function(){
				if(!!ctrl.pageCtrl)
					ctrl.pageCtrl.setPage(0);
			});

			this.afterTransclude = function() {
				console.log($element);
			};

			$scope.$on('headerGenerateDone', function(event, data) {
				console.log('in event-->', data);
console.log(options.$tds)
				var $colHeaders = $element.find('.col-header');
				var $tds = options.$tds;
				var $colRow = null;
				var $colHeader = null;
				var className = '';
				for(var i=0, iLen=$colHeaders.length; i<iLen; i++) {
					$colHeader = angular.element($colHeaders[i]);
					$colRow = angular.element($tds[i]);

					if($colRow.hasClass('hidden-xs')) {
						$colHeader.addClass('hidden-xs');
					} else if($colRow.hasClass('hidden-sm')) {
						$colHeader.addClass('hidden-sm');
					} else if($colRow.hasClass('hidden-md')) {
						$colHeader.addClass('hidden-md');
					} else if($colRow.hasClass('hidden-lg')) {
						$colHeader.addClass('hidden-lg');
					}

					if($colRow.hasClass('collapse-lg')) {
						className = 'hidden-lg hidden-md hidden-sm hidden-xs';
						$colRow.addClass(className);
						$colHeader.addClass(className);
					} else if($colRow.hasClass('collapse-md')) {
						className = 'hidden-md hidden-sm hidden-xs';
						$colRow.addClass(className);
						$colHeader.addClass(className);
					} else if($colRow.hasClass('collapse-sm')) {
						className = 'hidden-sm hidden-xs';
						$colRow.addClass(className);
						$colHeader.addClass(className);
					} else if($colRow.hasClass('collapse-xs')) {
						className = 'hidden-xs';
						$colRow.addClass(className);
						$colHeader.addClass(className);
					}
				}

				console.log(options.$tds)
			});

			$scope.$on('rowGenerateDone', function(event, data) {
				console.log('rowGenerateDone-->', data);

				expandFn();
			});

	}
]);

angular.module('objectTable')
	.directive('headerGenerate', [
		function() {
			return {
				restrict: 'AE',
				link: function(scope, elem, attrs) {
					if(scope.$last) {
						scope.$emit('headerGenerateDone', { 'from': 'headerGenerateLink' });
					}
				}
			}
		}
	]);

angular.module('objectTable')
	.directive('rowGenerate', [
			function() {
				return {
					restrict: 'AE',
					link: function(scope, elem, attrs) {
						if(scope.$last) {
							scope.$emit('rowGenerateDone', { 'from': 'rowGenerateLink' });
						}
					}
				}
			}
		]);

angular.module('objectTable')
	.directive('paging', ['$compile', '$interpolate', function($compile, $interpolate) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'views/components/conow-responsive-table/tpls/paging.html',
			controller: 'pagingTableCtrl',
			require: "^objectTable",
			scope: {
				count: "=",
				display: "=",
				options: '='
			},
			link: function(scope, element, attrs, objectTableCtrl) {
				scope.objectTableCtrl = objectTableCtrl;
				scope.objectTableCtrl.pageCtrl = scope;
			}
		};
	}]);

angular.module('objectTable').controller('objectTableSortingCtrl', ['$scope',
    function angTableCtrl($scope) {

        /* sorting [START]*/
        $scope.sort = {
            fields: [], // array to store readable sorted headers
            reverse: [] // array to store reversing for each field
        };

        $scope.sortingArray = [];

        $scope.sortBy = function(field) {
             if (resizePressedEnd) {
                resizePressedEnd= false;
                return;
             };
            if ($scope.data.length) {
                var sortedHeader = $scope.headers[$scope.fields.indexOf(field)];
                if ($scope.sortingType == 'compound') {

                    if ($scope.sort.fields.indexOf(sortedHeader) == -1) {
                        $scope.sort.fields.push(sortedHeader);
                        $scope.sortingArray.push(field);
                        $scope.sort.reverse.push(false);
                    } else {
                        $scope.changeReversing(field, $scope.sort.fields.indexOf(sortedHeader));
                    }

                } else if ($scope.sortingType == 'simple') {
                    $scope.sort.fields = [sortedHeader];
                    $scope.changeReversing(field);
                }
            }

        };

        $scope.changeReversing = function(sortProperty, indexOfHeader) {
            if ($scope.sortingType == 'compound') {
                $scope.sort.reverse[indexOfHeader] = !$scope.sort.reverse[indexOfHeader];
                $scope.sortingArray[indexOfHeader] = $scope.sort.reverse[indexOfHeader] ? "-" + sortProperty : sortProperty;
            } else if ($scope.sortingType == 'simple') {
                $scope.sort.reverse[0] = !$scope.sort.reverse[0];
                $scope.sortingArray = $scope.sort.reverse[0] ? [sortProperty] : ["-" + sortProperty];
            }
        };

        /* highlight sorted headers */
        $scope.headerIsSortedClass = function(field) {
            if (!$scope.sortingArray.length) return;

            if ($scope.sortingType == 'simple') {
                if (field == $scope.sort.fields[0] || "-" + field == $scope.sort.fields[0]) {
                    return $scope.sort.reverse[0] ? 'table-sort-down' : 'table-sort-up';
                }
            } else if ($scope.sortingType == 'compound') {
                var rowIndex = $scope.sort.fields.indexOf(field);
                if (rowIndex != -1) {
                    return $scope.sort.reverse[rowIndex] ? 'table-sort-down' : 'table-sort-up';
                }
            }
        };

        /* COMPOUND SORTING: remove from array */
        $scope.removeSorting = function() {
            var index = $scope.sort.fields.indexOf(this.sortField);
            if (index > -1) {
                $scope.sort.fields.splice(index, 1);
                $scope.sort.reverse.splice(index, 1);
                $scope.sortingArray.splice(index, 1);
            }
            index = null;
        };
        /* sorting [END]*/


        /* column resizing*/
        var resizePressed = false,
        resizePressedEnd = false,
        start,startX, startWidth;

        $scope.resizeStart = function(e) {
            var target = e.target ? e.target : e.srcElement;
            if (target.classList.contains("resize")) {
                start = target.parentNode;
                resizePressed = true;
                startX = e.pageX;
                startWidth = target.parentNode.offsetWidth;
                document.addEventListener('mousemove', drag);
                e.stopPropagation();
                e.preventDefault();
            }
        };

        function drag(e) {
            if (resizePressed) {
                start.width = startWidth + (e.pageX - startX);
            }
        }

        $scope.resizeEnd = function(e) {
            if (resizePressed) {
                document.removeEventListener('mousemove', drag);
                e.stopPropagation();
                e.preventDefault();
                resizePressed = false;
                resizePressedEnd = true;
            }
        };

    }
]);

angular.module('objectTable').filter('offset', function() {
		return function(input, start, display) {
			if (!input) return;
			start = parseInt(start, 10);
            //if (start == 1) return input.slice(0, display);
            display = parseInt(display, 10);
            var offset = start* display;
            return input.slice(offset, offset + display);
        };
    });


angular.module('objectTable').controller('pagingTableCtrl', ['$scope', '$element', '$attrs',
	function ($scope, $element, $attrs) {

		$scope.currentPage = 0;

		$scope.prevPage = function () {
			if ($scope.currentPage > 0) {
				$scope.currentPage--;
			}
			$scope.setCurrentPageToTable();
		};

		$scope.nextPage = function () {
			if ($scope.currentPage < $scope.pageCount()) {
				$scope.currentPage++;
			}
			$scope.setCurrentPageToTable();
		};

		$scope.setCurrentPageToTable = function (){
			$scope.objectTableCtrl.setCurrentPage($scope.currentPage);
		};

		$scope.prevPageDisabled = function () {
			return $scope.currentPage === 0 ? "disabled" : "";
		};

		$scope.pageCount = function () {
			return $scope.count >0 ? Math.ceil($scope.count / $scope.display) - 1 : 0;
		};

		$scope.nextPageDisabled = function () {
			return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
		};

		$scope.setPage = function(n) {
			$scope.currentPage = n;
			$scope.setCurrentPageToTable();
		};
		
		$scope.range = function () {
			var rangeSize = $scope.pageCount() + 1 < 5 ? $scope.pageCount() + 1 : 5;
			
			var ret = [];
			var start = $scope.currentPage;

			if ( start > $scope.pageCount() - rangeSize ) {
				start = $scope.pageCount()- rangeSize + 1;
			}

			for (var i=start; i<start+rangeSize; i++) {
				ret.push(i);
			}
			return ret;
		};


	}]);

/**
 * array util service:array operations
 * @return {[type]} [description]
 */
(function() {
  angular.module('objectTable')
    .service('arrayUtilService', [
      function(){
        var arrayUtil = {
          isAllSelected: function(arr, selectedKey) {
            if(!angular.isArray(arr)) {
              return false;
            }

            var iLen = arr.length;
            var selectedVal;
            for(var i=0; i<iLen; i++) {
              selectedVal = arr[i][selectedKey];
              if(angular.isUndefined(selectedVal) || !angular.equals(selectedVal, true)) {
                return false;
              }
            }

            return true;
          },
          selectedAll: function(arr, selectedKey) {
            if(!angular.isArray(arr)) {
              return false;
            }

            var iLen = arr.length;
            for(var i=0; i<iLen; i++) {
              arr[i][selectedKey] = true;
            }

            return arr;
          },
          unSelectedAll: function(arr, selectedKey){
            if(!angular.isArray(arr)) {
              return false;
            }

            var iLen = arr.length;
            for(var i=0; i<iLen; i++) {
              arr[i][selectedKey] = false;
            }

            return arr;
          }
        };

        return arrayUtil;
      }
    ])
})();

(function() {
	angular.module('objectTable')
		.factory('tableClass', ['DataService', 
			function(DataService) {
				function tableClass() {
					this.reloadTrigger = undefined;
					var self = this;

					this.reload = function() {
						console.log('in reload');
						
						self.reloadTrigger = !self.reloadTrigger;
					}
				}

				return tableClass;
			}
		])
})();