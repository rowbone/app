'use strict';

app.controller('qrcodeCtrl', ['$scope', 
	function($scope){
		//
		console.log('111111111111111111')

		var data = [ "BEGIN:VCARD",
            "VERSION:3.0",
            "N:Kent;Clark;W;;",
            // "FN:Clark W Kent",
            "ORG:Daily Planet",
            // "TITLE:Senior Reporter",
            "EMAIL;type=INTERNET;type=WORK:clark.kent@dailyplanet.com",
            "TEL;type=CELL:800-555-1212",
            "TEL;type=WORK:212-787-3762 x 6",
            // "TEL;type=HOME:800-579-7866",
            "ADR;type=WORK:;;One Daily Planet Way;Metropolis;NY;11111;USA",
            // "ADR;type=HOME:;;One Jor El Place;Krypton City;Krypton;32.54323;Kryptonian Planetary Alliance",
            // "BDAY;value=date:1932-01-01",
            // "URL;type=WORK:http://www.dailyplanet.com",
            // "URL;type=HOME:http://www.iamnotsuperman.com",
            "END:VCARD" ];
		var result = data.join(String.fromCharCode(13) + String.fromCharCode(10));
console.log('result-->', result)

		$scope.qrcodeString = result;
	  $scope.size = 250;
	  $scope.correctionLevel = '';
	  $scope.typeNumber = 0;
	  $scope.inputMode = '';
	  $scope.image = true;
		$scope.string = result;
	}
]);