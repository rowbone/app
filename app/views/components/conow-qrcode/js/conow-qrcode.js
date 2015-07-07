'use strict';

// filter to convert object data to vcard string
app.filter('vcardFormat', [
	function() {
		return function(input, params) {
			var vcardPrefix = 'BEGIN:VCARD,',
					vcardArr = [],
					vcardSuffix = ',END:VCARD',
					vcardStr = '';
			// prefix
			vcardArr.push(vcardPrefix);
			// content
			vcardArr.push('N:' + input.NAME);
			vcardArr.push('ORG:' + input.ORG);
			vcardArr.push('TITLE:' + input.TITLE);
			vcardArr.push('TEL;type=CELL:' + input.CELLPHONE);
			vcardArr.push('TEL;type=WORK:' + input.PHONE);
			vcardArr.push('EMAIL;type=INTERNET;type=WORK:' + input.EMAIL);
			// suffix
			vcardArr.push(vcardSuffix);

			vcardStr = vcardArr.join(String.fromCharCode(13) + String.fromCharCode(10));

			return vcardStr;
		}
	}
]);

// conow-qrcode directive
app.directive('conowQrcode', ['DataService', '$filter', 
	function(DataService, $filter) {
		return {
			restrict: 'AE',
			template: '<div class="conow-qrcode"></div>',
			scope: {
				text: '='
			}, 
			link: function(scope, elem, attrs) {
				console.log(scope.text);
								
				var $qrcode = elem.find('.conow-qrcode');
				var qrcodeDom = $qrcode[0];
				var qrcode = new QRCode(qrcodeDom, {
					text: scope.text,
				  // width: 128,
				  // height: 128,
				  colorDark : "#000000",
				  colorLight : "#ffffff",
				  correctLevel : QRCode.CorrectLevel.H
				});

				// DataService.getData('views/components/conow-qrcode/data/qrcode.json')
				// 	.then(function(data) {
				// 		var text = $filter('vcardFormat')(data.obj);
												
				// 		var $qrcode = elem.find('.conow-qrcode');
				// 		var qrcodeDom = $qrcode[0];
				// 		var qrcode = new QRCode(qrcodeDom, {
				// 			text: text,
				// 		  // width: 128,
				// 		  // height: 128,
				// 		  colorDark : "#000000",
				// 		  colorLight : "#ffffff",
				// 		  correctLevel : QRCode.CorrectLevel.H
				// 		});

				// 	}, function(msg) {
				// 		console.error('msg-->', msg);
				// 	});

			}
		};
	}
]);