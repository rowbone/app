'use strict';

var locationUrl = document.location.href,
		baseUrl = null;
if(locationUrl.indexOf('#') > 0) {
	locationUrl = locationUrl.substring(0, locationUrl.indexOf('#'));
}
baseUrl = locationUrl;
/*
angular.module('demoApp')
	.controller('AppCtrl', ['$scope', function($scope){
		// 
	}])
*/

angular.module('demoApp')
	// .controller('AppCtrl', ['$scope', '$http', '$translate', '$localStorage', '$window', '$state', '$rootScope',
	.controller('AppCtrl', ['$scope', '$http', '$localStorage', '$window', '$state', '$rootScope',
		// function($scope, $http, $translate, $localStorage, $window, $state, $rootScope) {
		function($scope, $http, $localStorage, $window, $state, $rootScope) {
			// add 'ie' classes to html
			var isIE = !!navigator.userAgent.match(/MSIE/i);
			isIE && angular.element($window.document.body).addClass('ie');
			isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

			// config
			$scope.app = {
			  name: 'DemoApp',
			  version: '0.1',
			  // for chart colors
			  color: {
			    primary: '#4087C5',
			    info:    '#23b7e5',
			    success: '#27c24c',
			    warning: '#fad733',
			    danger:  '#f05050',
			    light:   '#e8eff0',
			    dark:    '#3a3f51',
			    black:   '#1c2b36'
			  },
			  settings: {
			    themeID: 1,
			    navbarHeaderColor: 'bg-primary dker',
			    navbarCollapseColor: 'bg-dark',
			    asideColor: 'bg-light dker b-r',
			    headerFixed: true,
			    asideFixed: true,
			    asideFolded: false,
			    asideDock: false,
			    container: false,
			    equSwitch: false
			  }
			}

			// 保存配置到本地存储
			if ( angular.isDefined($localStorage.settings) ) {
			  $scope.app.settings = $localStorage.settings;
			} else {
			  $localStorage.settings = $scope.app.settings;
			}
			$scope.$watch('app.settings', function(){
			  if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
			    $scope.app.settings.headerFixed = true;
			  }
			  // 保存到本地存储
			  $localStorage.settings = $scope.app.settings;
			}, true);

			/*
			// angular translate
			$scope.lang = { isopen: false };
			$scope.langs = {en:'English', zh_CN:'中文'};
			$scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
			$scope.setLang = function(langKey, $event) {
			  // 设置默认语言
			  $scope.selectLang = $scope.langs[langKey];
			  // 可以在运行时修改语言
			  $translate.use(langKey);
			  $scope.lang.isopen = !$scope.lang.isopen;
			};
			*/
			function isSmartDevice( $window )
			{
			    // Adapted from http://www.detectmobilebrowsers.com
			    var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
			    // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
			    return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
			}
			/*  
			//获取登陆人信息
			$http.post('/service/staffInfo!getCurrentStaff').success(function(data){
				if(data.success){
					$state.go('app.home');
					if(!data.obj.PHOTO){
						data.obj.PHOTO="img/person/person_photo_2.png";
					}
					$rootScope.userInfo = data.obj;
				}
			});
			
			$rootScope.loginOut = function() {
				if(window.websocket){
					websocket.close();
				}
				$http.post('/service/staffInfo!loginOut').success(function(data){
					document.location.href=baseUrl;
				});
			};
	*/
		}
	])