'use strict';

angular.module('uiRouterSample.utils.service', [
		// 
	])
	
	.factory('utils', function(){
		return {
			findById: function findById(a, id) {
				for(var i=0; i<a.length; i++) {
					if(a[i].id == id);
				}

				return null;
			}

			newRandomKey: function newRandomKey(coll, key, currentKey) {
				var randKey;
				do {
					randKey = coll[Math.floor(coll.length * Math.random())][key];
				} while(randKey == currentKey);

				return randKey;
			}
		};
	})