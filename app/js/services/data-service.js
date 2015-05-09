'use strict';

/*
http://www.thinksaas.cn/group/topic/264600/
http://blog.jobbole.com/51178/
http://www.111cn.net/wy/js-ajax/71384.htm
http://my.oschina.net/ilivebox/blog/293771
http://www.tuicool.com/articles/rUfmq2
*/

app.service('DataService', ['$http', '$q', '$interval', 
	function($http, $q, $interval) {

		var dataGetUrl = '';

		this.setUrl = function(url) {
			dataGetUrl = url;
		};

		this.getUrl = function() {
			return dataGetUrl;
		};

		this.getData = function(url) {
			var deferred = $q.defer();

			// deferred.notify('This is the getData func in DataService.');

			// var progress = 0;
			// var interval = $interval(function() {
			// 	if(progress >= 100) {
			// 		$interval.cancel(interval);
			// 		deferred.resolve('All done!');
			// 	}
			// 	progress += 10;
			// 	deferred.notify(progress + '% ...');
			// }, 100);

			$http.get(url)
				.success(function(data, status, headers, config) {
					deferred.resolve(data);
				})
				.error(function(data, status, headers, config) {
					deferred.reject('Get data from "' + url + '" wrong...');
				});

			return deferred.promise;
		};
	}
]);