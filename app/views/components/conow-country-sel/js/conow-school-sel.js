'use strict';

app.service('schoolService', ['DataService', '$q', 
	function(DataService, $q) {
		var dataAll = [], 
				self = this,
				dataSrcUrl = 'views/components/conow-country-sel/data/school/query-is-common-school.json';

		this.deferred = $q.defer();
		this.schoolPromise = this.deferred.promise;

		var init = function() {
			DataService.getData(dataSrcUrl)
				.then(function(data) {
					if(data.success) {
						data = data.obj;

						dataAll = data;
						self.deferred.resolve('Init finished...');
					} else {
						self.deferred.reject('Init wrong...' + msg);
					}
				}, function(msg) {
					self.deferred.reject('Init wrong...' + msg);
				})
		};

		// initialization
		init();

		/**
		 * get all school data
		 */
		this.getSchoolData = function() {
			return dataAll;
		}

	}
]);

/**
 * conowSchoolSel directive
 */
app.directive('conowSchoolSel', ['$filter', 'schoolService', 'conowModals', 
	function($filter, schoolService, conowModals) {
		return {
			restrict: 'A',
			scope: {
				ngModel: '='
			},
			replace: true,
			template: '<input type="text" ng-click="schoolSelClick($event)">',
			link: function(scope, elem, attrs) {
				var vm = scope.vm = {};

				schoolService.schoolPromise
					.then(function() {
						var objData = schoolService.getSchoolData();
						vm.dataAll = {'COMMON': objData};
						vm.groupData = $filter('groupByAlphabet')(vm.dataAll);
					}, function(msg) {
						console.error(msg);
					});

				// select click to open modal
				scope.schoolSelClick = function(e) {
					var modalInstance = conowModals.open({
						templateUrl: 'views/components/conow-country-sel/tpls/country-sel-tpl.html',
						size: 'lg',
						title: '选择',
						controller: 'schoolSelCtrl',
						resolve: {
							modalParams: function() {
								return {
									dataAll: vm.dataAll,
									groupData: vm.dataAll,
									selectedName: vm.selectedName
								}
							}
						}
					});

					modalInstance.result.then(function(data) {
						$scope.ngModel = data.CODE;

						$timeout(function() {
							elem.val(data.VALUE);

							vm.selectedName = data.VALUE;
						}, 100);
					}, function(msg) {
						console.info('msg-->', msg);
					});
				};

			}
		}
	}
]);

app.controller('schoolSelCtrl', ['$scope', '$conowModalInstance', 'modalParams', 
	function($scope, $conowModalInstance, modalParams) {

		var vm = $scope.vm = {
			dataAll: modalParams.dataAll,
			groupData: modalParams.groupData,
			contentData: [[], [], [], [], [], []],
			selectedLabel: null
		};
		var options = $scope.options= {
			search: false,
			isLoading: false
		};
	}
]);

/**
 * schoolSelDemoCtrl
 * demo controller
 */
app.controller('schoolSelDemoCtrl', ['$scope', 
	function($scope) {
		
	}
]);

