
seajs.config({
	alias: {
		'jquery': 'jquery-1.10.2.js'
	}
});

seajs.use(['jquery', './src/dialog.js'], function($, dialog) {
	$('.simpleDialog').on('click', function() {
		var d = dialog({
			title: '欢迎',
			content: '欢迎使用 artDialog 组件！'
		});
		d.show();
	});

	$('.simpleModalDialog').on('click', function() {
		var d = dialog({
			title: '欢迎',
			content: '欢迎使用 artDialog 组件！'
		});
		d.showModal();
	});

	$('.strModalDialog').on('click', function() {
		var d = dialog({
			title: 'This is title',
			content: 'This is content',
			width: 600
		});

		d.showModal();
	})

	$('.elemModalDialog').on('click', function() {
		var $elem = $('#divHidden');
		$elem.removeClass('hidden');
		dialog({
			title: '新增 demo',
			content: $elem,
			id: 'EF893L',
			width: 600
		}).showModal();
	});

	$('.btn-save').on('click', function() {
		console.log('saving...........');
		return false;
	});

	$('.btn-submit').on('click', function() {
		console.log('submit.......');
		return false;
	})
})