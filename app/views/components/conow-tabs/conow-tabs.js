
app.directive('conowTabs',function() {
	return {
		restrict : 'EA',
		replace : true,
		transclude : true,
		scope : {},
		template : '<div ng-transclude></div>',
		controller : function($scope, $element) {
			$scope.titlesCount = 0;
			$scope.contentCount = 0;
			$scope.hides = [];
			$scope.shows = [];
			$scope.urls = [];
			$scope.id = new UUID();
			$scope.changeCount = [];
			this.addChangeCount = function(index){
				$scope.changeCount[index] = false;
			}
			this.changeChangeCount = function(index){
				$scope.changeCount[index] = true;
				for(var i = 0; i < $scope.changeCount.length; i++){
					if(i != index){
						$scope.changeCount[i] = false;
					}
				}
			}
			this.getChangeCount = function(index){
				return $scope.changeCount[index];
			}
			this.getId = function(){
				return $scope.id.id;
			}
			this.addTitlesCount = function(){
				$scope.titlesCount++;
			};
			this.getTitlesCount = function(){
				return $scope.titlesCount;
			};
			this.addContentCount = function(){
				$scope.contentCount++;
			};
			this.getContentCount = function(){
				return $scope.contentCount;
			};
			this.addHides = function(val){
				$scope.hides.push(val);
			};
			this.getHides = function(){
				return $scope.hides;
			};
			this.addShows = function(val){
				$scope.shows.push(val);
			};
			this.getShows = function(){
				return $scope.shows;
			};
			this.addUrls = function(val){
				$scope.urls.push(val);
			};
			this.getUrls = function(){
				return $scope.urls;
			};
			this.changeUrls = function(index){
				$scope.urls[index] = true;
			}
		}
	};
});

app.directive('conowTabsTitles',function() {
	return {
		restrict : 'EA',
		require : '^conowTabs',
		replace : true,
		transclude: true,
		scope : {
			pills : '=pills',
		},
		template : '<ul id="{{id}}" class="nav" ng-class="{\'nav-pills\':pill,\'nav-tabs\':!pill}" ng-transclude></ul>',
		link : function(scope,element,attr,conowTabs){
			scope.id = conowTabs.getId();
			scope.pill = scope.pills;
		}
	};
});

app.directive('conowTabsContent',function() {
	return {
		restrict : 'EA',
		require : '^conowTabs',
		replace : true,
		transclude : true,
		scope : true,
		template : '<div id="c{{id}}" class="tab-content" ng-transclude></div>',
		link : function(scope,element,attr,conowTabs){
			scope.id = conowTabs.getId();
		}
	};
});

app.directive('conowTabsTitlesText',function() {
	return {
		restrict : 'EA',
		replace : true,
		require : '^conowTabs',
		scope : {
			title : '@title',
			hide : '=hide',
			show : '=show',
			load : '=load',
			fn : '&'
		},
		template : '<li ng-click="changeUrls(iden)" ng-class="{\'active\':shows[iden] || active[iden]}" ng-hide="hides[iden]">\
						<a data-toggle="tab" href="#{{id}}{{iden}}" eat-click>\
						{{title}}\
						</a>\
					</li>',
		link:function(scope,element,attrs,conowTabs){
			scope.id = conowTabs.getId();
			scope.iden = conowTabs.getTitlesCount();
			conowTabs.addTitlesCount();
			conowTabs.addHides(scope.hide);
			conowTabs.addShows(scope.show);
			if(scope.iden > 0){
				conowTabs.addUrls(false);
			}
			scope.hides = conowTabs.getHides();
			scope.shows = conowTabs.getShows();
			for(var i = 0; i < scope.shows.length; i++){
				if(scope.shows[i]){
					conowTabs.changeUrls(i);
				}
			}
			if(scope.load){
				conowTabs.changeUrls(scope.iden);
			}
			conowTabs.addChangeCount(scope.iden);
			scope.changeUrls = function(index){
				conowTabs.changeUrls(index);
				var bool = conowTabs.getChangeCount(index);
				if(!bool){
					conowTabs.changeChangeCount(index);
					if(scope.fn){
						scope.fn();
					}
				}
			}
		}
	};
});

app.directive('conowTabsTitlesDiy',function() {
	return {
		restrict : 'EA',
		replace : true,
		require : '^conowTabs',
		transclude: true,
		scope : {
			title : '@title',
			hide : '=hide',
			show : '=show',
			load : '=load',
			fn : '&'
		},
		template : '<li ng-click="changeUrls(iden)" ng-class="{\'active\':shows[iden] || active[iden]}" ng-hide="hides[iden]">\
						<a data-toggle="tab" href="#{{id}}{{iden}}" eat-click>\
							<div ng-transclude></div>\
						</a>\
					</li>',
		link:function(scope,element,attrs,conowTabs){
			scope.id = conowTabs.getId();
			scope.iden = conowTabs.getTitlesCount();
			conowTabs.addTitlesCount();
			conowTabs.addHides(scope.hide);
			conowTabs.addShows(scope.show);
			if(scope.iden > 0){
				conowTabs.addUrls(false);
			}
			scope.hides = conowTabs.getHides();
			scope.shows = conowTabs.getShows();
			for(var i = 0; i < scope.shows.length; i++){
				if(scope.shows[i]){
					conowTabs.changeUrls(i);
				}
			}
			if(scope.load){
				conowTabs.changeUrls(scope.iden);
			}
			conowTabs.addChangeCount(scope.iden);
			scope.changeUrls = function(index){
				conowTabs.changeUrls(index);
				var bool = conowTabs.getChangeCount(index);
				if(!bool){
					conowTabs.changeChangeCount(index);
					if(scope.fn){
						scope.fn();
					}
				}
			}
		}
	};
});

app.directive('conowTabsContentUrl',function() {
	return {
		restrict : 'EA',
		replace : true,
		require : '^conowTabs',
		scope : {
			url: '@url',
		},
		template : '<div class="tab-pane fade" ng-class="{\'in active\':shows[iden]}"\
						id="{{id}}{{iden}}" ng-hide="hides[iden]">\
					<div ng-include="url" ng-if="urls[iden]"></div>\
					</div>',
		link:function(scope,element,attrs,conowTabs){
			scope.id = conowTabs.getId();
			scope.iden = conowTabs.getContentCount();
			conowTabs.addContentCount();
			scope.shows = conowTabs.getShows();
			scope.hides = conowTabs.getHides();
			scope.urls = conowTabs.getUrls();
			scope.too = function(val){
				conowTabs.changeUrls(val);
			};
		},
		controller : function($scope, $element) {
			$scope.getNumTabs = function(val){
				$scope.too(val);
				$('#'+$scope.id+' li:eq('+val+') a').tab('show');
			}
			$scope.getShowTabs = function(val){
				$scope.hides[val] = false;
			}
			$scope.getHideTabs = function(val){
				$scope.hides[val] = true;
			}
		}
	};
});

app.directive('conowTabsContentText',function() {
	return {
		restrict : 'EA',
		replace : true,
		require : '^conowTabs',
		transclude: true,
		scope : {},
		template : '<div class="tab-pane fade" ng-class="{\'in active\':shows[iden]}"\
						id="{{id}}{{iden}}" ng-hide="hides[iden]">\
					<div ng-transclude ng-if="urls[iden]"></div>\
					</div>',
		link:function(scope,element,attrs,conowTabs){
			scope.id = conowTabs.getId();
			scope.iden = conowTabs.getContentCount();
			conowTabs.addContentCount();
			scope.shows = conowTabs.getShows();
			scope.hides = conowTabs.getHides();
			scope.urls = conowTabs.getUrls();
			scope.too = function(val){
				conowTabs.changeUrls(val);
			};
		},
		controller : function($scope, $element) {
			$scope.getNumTabs = function(val){
				$scope.too(val);
				$('#'+$scope.id+' li:eq('+val+') a').tab('show');
			}
			$scope.getShowTabs = function(val){
				$scope.hides[val] = false;
			}
			$scope.getHideTabs = function(val){
				$scope.hides[val] = true;
			}
		}
	};
});

//处理a标签href属性的值出现#号时就自动跳转到主页和点击后显示标签页对应的页面内容
app.directive('eatClick', function() {
	return function(scope,element,attrs){
		$(element).click(function(event) {
			event.preventDefault();//使点击a标签不做任何操作,主要处理#号,使之不会跳转到主页
		});
	}
});

app.directive('skipClick', function() {
	return {
		restrict : 'EA',
		require : '?^conowTabs',
		replace : true,
		scope : true,
		link:function(scope,element,attrs,conowTabs){
			var id = conowTabs.getId();
			$(element).click(function(event) {
				var toSkip = attrs.skipClick;
				scope.$apply(function(){
					conowTabs.changeUrls(toSkip);
				});
				$('#'+id+' li:eq('+toSkip+') a').tab('show');
			});
		}
	};
});

/*-----------------------------------------------------*/