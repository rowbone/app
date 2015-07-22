'use strict';

/*
http://www.thinksaas.cn/group/topic/264600/
http://blog.jobbole.com/51178/
http://www.111cn.net/wy/js-ajax/71384.htm
http://my.oschina.net/ilivebox/blog/293771
http://www.tuicool.com/articles/rUfmq2
*/

// 后台数据 get/post 同步操作
app.service('DataService', ['$http', '$q', '$interval', 
	function($http, $q, $interval) {

		var dataGetUrl = '';

		this.setUrl = function(url) {
			dataGetUrl = url;
		};

		this.getUrl = function() {
			return dataGetUrl;
		};

		this.postData = function(url, params) {
			var deferred = $q.defer();
			$http.post(url, params)
				.success(function(data, status, headers, config) {
					deferred.resolve(data);
				})
				.error(function(data, status, headers, config) {
					deferred.reject('Post "' + url + '" wrong...');
				})

			return deferred.promise;
		};

		this.getData = function(url) {
			var deferred = $q.defer();

			$http.get(url)
				.success(function(data, status, headers, config) {
					deferred.resolve(data);
				})
				.error(function(data, status, headers, config) {
					deferred.reject('Get data from "' + url + '" wrong...');
				});

			return deferred.promise;
		};

		$http.get()
			.sucess(function() {
				// 
			})
			.error(function() {
				// 
			});

			promise.then(function() {
				//
			})
	}
]);