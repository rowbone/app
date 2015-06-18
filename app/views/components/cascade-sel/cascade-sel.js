'use strict';

app.directive('cascadeSel', ['DataService', 'conowModals', 
	function(DataService, conowModals) {
		return {
			restrict: 'A',
			// templateUrl: 'views/components/cascade-sel/tpls/cascade-sel.html',
			transclude: true,
			scope: {
				titles: '=',
				url: '=',
				selected: '='
			},
			link: function(scope, elem, attrs) {

				elem.bind('click', function(e) {console.log('in click...')
					var modalInstance = conowModals.open({
						templateUrl: 'views/components/cascade-sel/tpls/cascade-sel.html',
						title: '选择',
						size: 'full',
						controller: 'cascadeSelCtrl',
						resolve: {
							modalParams: function() {
								return {
									titles: scope.titles,
									url: scope.url,
									selected: scope.selected
								}
							}
						}
					})

					modalInstance.result.then(function(data) {
						console.log('data-->', data);
					});

					e.stopPropagation();
				});

			}
		}
	}
]);

app.controller('cascadeSelDemoCtrl', ['$scope', 
	function($scope) {
		//
		$scope.titles = ['级别1', '级别2', '级别3'];

		var entity = $scope.entity = {
			selected: ['军队干部职别', '军事、政治、后勤军官职别', '军委副主席职']
		}
	}
]);

app.controller('cascadeSelCtrl', ['$scope', 'DataService', '$conowModalInstance', 'modalParams', 
	function($scope, DataService, $conowModalInstance, modalParams) {
		//
		$scope.titles = modalParams.titles;
		$scope.selected = [];

		$scope.selected = modalParams.selected;

		var init = function() {
			var url = modalParams.url;
			DataService.getData(url)
				.then(function(data) {
					$scope.dataLevel1 = data;
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
				if(angular.equals(item, items[i])) {
					return i;
				}
			}

			return -1;
		};

		$scope.confirm = function() {
			console.log('111');
			$conowModalInstance.close($scope.selected);
		};

	}
]);