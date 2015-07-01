'use strict';

app.controller('orgInfoCtrl', ['$scope', 'DataService', 'conowModals', 'modalParams', '$timeout', 
	function($scope, DataService, conowModals, modalParams, $timeout) {
		// 
		var options = $scope.options = {
			showAllStaffs: false,
			orgStaffsShowType: 'list'
		};
		var org = modalParams.org;
		
		$scope.selectedOrg = org;
		// 面包屑 swiper
		var swiper = $scope.swiper = null;
		
		var init = function() {
			options.orgStaffsShowType = 'list';
//			DataService.postData('/service/orgUnit!queryOrgUnitInfoInCam?ID=' + $scope.selectedOrg.ID)
//				.then(function(data) {
//					if(data.obj) {
//						$scope.orgAndFatherOrgs = data.obj.orgUnit.orgAndFatherOrgs;
//						
//						$scope.currentOrgName = $scope.orgAndFatherOrgs[$scope.orgAndFatherOrgs.length - 1].ORG_UNIT_SHORT_NAME;
//					}
//				}, function(msg) {
//					$scope.orgAndFatherOrgs = [];
//				});
//		
//			DataService.postData('/service/orgUnit!queryNextContactTreeById', {ORG_ID:$scope.selectedOrg.ID})
//				.then(function(data) {
//					if(data.obj) {
//						$scope.childOrgs = data.obj;
//					}
//				}, function(msg) {
//					$scope.childOrgs = [];
//				});
//			
//			DataService.postData('/service/staffInfo!queryActStaffByOrgUnitId', {ORG_UNIT_ID:$scope.selectedOrg.ID})
//				.then(function(data) {
//					if(data.obj) {
//						$scope.orgStaffs = data.obj;
//					}
//				}, function(msg) {
//					$scope.orgStaffs = [];
//				});
			
//			DataService.postData('/service/orgUnit!queryOrgAndStaff',{ID:$scope.selectedOrg.ID})
			DataService.postData('/service/orgUnit!queryStaffAndNextOrgsAndStaffCount',{'ID':$scope.selectedOrg.ID, 'ROOT_ID': '-1'})
				.then(function(data) {
					if(data.success && data.obj) {
						var orgData = data.obj;
						
						$scope.orgAndFatherOrgs = orgData.itsFatherOrgs;
						$scope.currentOrgName = $scope.orgAndFatherOrgs[$scope.orgAndFatherOrgs.length - 1].ORG_UNIT_SHORT_NAME;
						$scope.childOrgs = orgData.lowerOrgList;
						
//						$scope.orgStaffs = orgData.allStaff;
						var tmp = {};
						var allStaff = orgData.allStaffs;
						for(var i=0; i<allStaff.length; i++) {
							if(allStaff[i]['ADDITIONAL_TYPE']) {
								tmp = allStaff[i];
								allStaff[i]['STAFF_ADDITION'] = '兼';
							}
						}
						$scope.orgStaffs = allStaff;
						
						$timeout(function() {
							scrollFunc();
						}, 100);
						
						if(!swiper) {
							swiper = new Swiper('.swiper-container', {
								centeredSlides: false,
								spaceBetween: 0,
								watchSlidesProgress: false,
								slidesPerView: 'auto'
							});
						} else {
							swiper.update();
						}
					};
				}, function(msg) {
					cosnole.log('msg-->', msg);
				})
		};
		
		init();
		
//		$scope.$watch(function() {
//			return $scope.orgAndFatherOrgs;
//		}, function(newVal, oldVal) {
//			console.log('orgAndFatherOrgs-->', newVal);
//		}, true);
		
		var scrollFunc = function() {
			var $orgInfoContainer = $('.org-info-content');
			var $staffsHeader = $('.org-staff-fixed');	
			
			if($orgInfoContainer.find('.child-orgs').height() + $staffsHeader.height() > $orgInfoContainer.height()) {
                $staffsHeader.show();
            } else {
            	$staffsHeader.hide();
            }
			
			var ignoreScroll = false;
			$('.org-info-content').on('scroll', function(e) {
				if(ignoreScroll)	return;
				var triggerTop = $('.child-orgs').height() - $('.org-info-content').height();

			    if(this.scrollTop >= (triggerTop + 40)) {
			      $('.org-staff-fixed').hide();
			      
			    }else {
			      $('.org-staff-fixed').show();
			    }
			});			

			  $('.org-staff-fixed').click(function(e) {
			    ignoreScroll = true;
			    var scrollTop = $('.child-orgs').height();
			    $('.org-staff-fixed').hide();
			    $('.org-info-content').animate({scrollTop:scrollTop}, 500, 'swing', function(){
			      ignoreScroll = false;
			    });
			    
			  })
		      $('.org-staffs .header').click(function(e){
		        ignoreScroll = true;
			    var scrollTop = $('.child-orgs').height() + 40 - $('.org-info-content').height();
			    
			    $('.org-staffs').animate({scrollTop:$('.org-staff-fixed').height()}, 500, 'swing', function(){
//			      $('.org-staff-fixed').show();
			      ignoreScroll = false;
			    });
			    
			  })
		};
		
		// 点击面包屑：查看组织的对应下级组织和人员信息
		$scope.orgItemClick = function(org, e) {
			e.preventDefault();
			
			$scope.selectedOrg = org;
			
			// 重新调用接口获取相应的数据
			init();
		}; 
		
		// 查看 人员信息
		$scope.staffItemClick = function(staff, e) {
			e.preventDefault();
			
			conowModals.open({
				templateUrl: 'app/business/home/contactlist/tpls/staff-info.html',
				controller: 'staffInfoCtrl',
				title: '人员信息',
				size: 'full',
				resolve: {
					modalParams: function() {
						return {
							staff: staff
						}
					},
					deps: ['uiLoad', function(uiLoad) {
						return uiLoad.load(['app/business/home/contactlist/js/staff-info-ctrl.js']);
					}]
				}
			});
		};
		
		// 查看组织信息
		$scope.orgInfoClick = function(org, e) {
			e.preventDefault();
			console.log($scope.selectedOrg);
			if(!$scope.selectedOrg) {
				return;
			}
			conowModals.open({
				templateUrl: 'app/business/home/contactlist/tpls/org-info-detail.html',
				controller: 'orgInfoDetailCtrl',
				title: '组织详情',
				size: 'full',
				resolve: {
					modalParams: function() {
						return {
							org: $scope.selectedOrg
						}
					},
					deps: ['uiLoad', function(uiLoad) {
						return uiLoad.load(['app/business/home/contactlist/js/org-info-detail-ctrl.js']);
					}]
				}
			});
		};
		
		// 查看所有人员
		$scope.showAllStaffsClick = function(e) {
			e.preventDefault();
			
			options.showAllStaffs = !options.showAllStaffs;
		};
		
		// 切换部门人员展示样式
		$scope.changeShowTypeClick = function(e) {
			if(options.orgStaffsShowType === 'list') {
				options.orgStaffsShowType = 'th';
			} else if(options.orgStaffsShowType === 'th') {
				options.orgStaffsShowType = 'list';
			}
			
			e.stopPropagation();
		};
		
		// 搜索
		$scope.orgAndStaffSearchClick = function(e) {
			e.preventDefault();
			
			conowModals.open({
				templateUrl: 'app/business/home/contactlist/tpls/org-and-staff-search.html',
				controller: 'orgAndStaffSearchCtrl',
				title: '查找组织和人员',
				size: 'full',
				resolve: {
					modalParams: function() {
						return {
							// 
						}
					}
				}
			});
		};
		
	}
]);