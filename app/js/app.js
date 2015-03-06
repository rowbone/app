'use strict';

var app = angular.module('demoApp', [
	'ngStorage',
	'ui.router',
	'ui.bootstrap',
	'ui.load',
	'app.demo',
	'app.form',
	'app.ngSweetAlert',
	'app.directives',
	'w5c.validator',
	'ngDialog'
	]);

// app.config(['w5cValidatorProvider'], function(w5cValidatorProvider) {
// 	w5cValidatorProvider.config({
// 		blurTrig: false,
// 		showError: true,
// 		removeError: true
// 	});

// 	w5cValidatorProvider.setRules({
// 		email: {
// 			required: '输入的邮箱地址不能为空',
// 			email: '输入的邮箱地址格式不正确'
// 		},
// 		username: {
// 			required: '输入的用户名不能为空',
// 			pattern: '用户名必须输入字母/数字/下划线，字母开始',
// 			w5cuniquecheck: '输入用户名已经存在，请重新输入'
// 		},
// 		password: {
// 			required: '密码不能为空',
// 			minlength: '密码长度不能小于{minlength}'
// 		}
// 	})
// }])