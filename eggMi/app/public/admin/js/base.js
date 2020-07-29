$(function () {

	$('.aside h4').click(function () {

		//		$(this).toggleClass('active');


		$(this).siblings('ul').slideToggle();
	})


})
let app = {
	changeStatus: function (el, model, attr, id) {

		// 客户端 ajax请求
		$.get('/admin/changeStatus', { model: model, attr: attr, id: id }, function (data) {

			if (data.success) {
				if (el.src.indexOf('yes') != -1) {
					el.src = '/public/admin/images/no.gif';
				} else {
					el.src = '/public/admin/images/yes.gif';
				}

			}

		})
	}
}