'use strict';

app.service('cascadeSelService', ['$http', 
	function($http) {
		// 
		var selected = [];

		this.setSelected = function(sel) {
			selected = sel;
		};

		this.getSelected = function() {
			return selected;
		};

	}
]);

app.directive('cascadeSel', ['DataService', 'conowModals', 'cascadeSelService', 
	function(DataService, conowModals, cascadeSelService) {
		return {
			restrict: 'A',
			// templateUrl: 'views/components/cascade-sel/tpls/cascade-sel.html',
			transclude: true,
			scope: {
				titles: '=',
				url: '=',
				sel: '='
			},
			link: function(scope, elem, attrs) {

				elem.bind('click', function(e) {
					cascadeSelService.setSelected(scope.sel);

					var modalInstance = conowModals.open({
						templateUrl: 'views/components/cascade-sel/tpls/cascade-sel.html',
						title: '选择',
						size: 'full',
						controller: 'cascadeSelCtrl',
						resolve: {
							modalParams: function() {
								return {
									titles: scope.titles,
									url: scope.url
								}
							}
						}
					});

					modalInstance.result.then(function(data) {
						console.log('data-->', data);
					});

					e.stopPropagation();
				});

			}
		}
	}
]);

app.controller('cascadeSelDemoCtrl', ['$scope', 'DataService', 
	function($scope, DataService) {
		$scope.titles = ['级别1', '级别2', '级别3'];

		var entity = $scope.entity = {
			sel: '6102'
		};

		var urlSelected = 'views/components/cascade-sel/data/selected.json';
		DataService.getData(urlSelected)
			.then(function(data) {
				$scope.sel = data;
			}, function(msg) {
				console.error('msg-->', msg);
			});
	}
]);

app.controller('cascadeSelCtrl', ['$scope', 'DataService', '$conowModalInstance', 'modalParams', 'cascadeSelService', 
	function($scope, DataService, $conowModalInstance, modalParams, cascadeSelService) {
		$scope.titles = modalParams.titles;
		$scope.selected = cascadeSelService.getSelected();
console.log('selected-->', $scope.selected);
		var init = function() {
			var url = modalParams.url;
			DataService.getData(url)
				.then(function(data) {
					$scope.dataLevel1 = data;
					// var iLen = data.length;
					// for(var i=0; i<iLen; i++) {
					// 	if(data[i]['code'] === )
					// }

				}, function(msg) {
					console.error('msg-->', msg);
				});
		};

		init();

		$scope.select = function(e, selectedLevel, item) {
			e.preventDefault();

			switch(selectedLevel) {
				case '1':
					$scope.selected = [item];
					$scope.dataLevel2 = item.children;
					break;
				case '2':
					$scope.selected = [$scope.selected[0], item];
					$scope.dataLevel3 = item.children;
					break;
				case '3':
					$scope.selected = [$scope.selected[0], $scope.selected[1], item];
			}
		};

		$scope.indexInArr = function(item, items) {
			var iLen = items.length;
			for(var i=0; i<iLen; i++) {
				// if(angular.equals(item, items[i])) {
				if(item.code === items[i].code) {
					return i;
				}
			}

			return -1;
		};

		$scope.confirm = function() {
			console.log('111');
			cascadeSelService.setSelected($scope.selected);
			$conowModalInstance.close($scope.selected);
		};

	}
]);