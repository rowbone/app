'use strict';

app.filter('uppercase', function() {
	return function(item) {
		if(item) {
			return item[0].toUpperCase() + item.slice(1);
		}
	};
});

app.filter('test', function($filter) {
	return function(item) {
		if(item) {
			var testVal = $filter('uppercase')(item);
			return testVal;
		}
	}
});