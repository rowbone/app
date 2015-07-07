'use strict';

app.controller('qrcodeCtrl', ['$scope', '$http', '$filter', 
    function($scope, $http, $filter) {
      // $scope.qrcodeString = '';
      
      $http.get('views/components/conow-qrcode/data/qrcode.json')
        .success(function(data) {
          console.log(data);

          $scope.qrcodeObj = data.obj;

          $scope.qrcodeString = $filter('vcardFormat')(data.obj);
        })
        .error(function(msg) {
          console.error(msg);
        });

        // $scope.qrcodeObj = {
        //   "NAME": "胡一刀",
        //   "ORG": "科南软件",
        //   "TITLE": "软件开发",
        //   "EMAIL": "hyd@conow.conow.cn",
        //   "CELLPHONE": "13245798432",
        //   "PHONE": "02032541789"
        // };

        // var data = ["BEGIN:VCARD",
        //     "VERSION:3.0",
        //     // "N:CHARSET=UTF-8:胡;一峰",
        //     // "FN:Clark W Kent",
        //     "FN:LANGUAGE=zh-CN:胡一峰",
        //     //"ORG:CHARSET=UTF-8:科南软件",
        //     // "TITLE:Senior Reporter",
        //     "EMAIL;type=INTERNET;type=WORK:hyf@conow.cn",
        //     "TEL;type=CELL:13245798432",
        //     "TEL;type=WORK:121554545",
        //     // "TEL;type=HOME:800-579-7866",
        //     // "ADR;type=WORK:;;One Daily Planet Way;Metropolis;NY;11111;USA",
        //     // "ADR;type=HOME:;;One Jor El Place;Krypton City;Krypton;32.54323;Kryptonian Planetary Alliance",
        //     // "BDAY;value=date:1932-01-01",
        //     // "URL;type=WORK:http://www.dailyplanet.com",
        //     // "URL;type=HOME:http://www.iamnotsuperman.com",
        //     "END:VCARD"
        // ];
        // var result = data.join(String.fromCharCode(13) + String.fromCharCode(10));
        // console.log('result-->', result)
        // result = '中国';
        // $scope.qrcodeString = result;
        // $scope.size = 250;
        // $scope.correctionLevel = '';
        // $scope.typeNumber = 0;
        // $scope.inputMode = '';
        // $scope.image = true;
        // $scope.string = result;
    }
]);