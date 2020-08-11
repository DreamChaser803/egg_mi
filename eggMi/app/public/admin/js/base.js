$(function () {

	$('.aside .asideh4').click(function () {

		//		$(this).toggleClass('active');


		// $(this).siblings('ul').slideToggle();

		if ($(this).find('span').hasClass('nav_open')) {

			$(this).find('span').removeClass('nav_open').addClass('nav_close');

		} else {

			$(this).find('span').removeClass('nav_close').addClass('nav_open');

		}

		$(this).siblings('ul').slideToggle();

	})

	$('.delete').click(function () {

		var flag = confirm('您确定要删除吗?');
	
		return flag;
	
	})

	app.resizeIframe()


})

let app = {
	 
	//设置iframe 右侧高度
	resizeIframe:function(){

		let heights = document.documentElement.clientHeight-100;	
		
		document.getElementById('rightMain').height = heights
	},

	//状态改变
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
	},

	//改动数据动态改变  ajax请求
	editNum: function (el, model, attr, id) {

		var val = $(el).html();
		// console.log(val)

		var input = $("<input value='' />");//创建input标签


		//把input放在sapn里面
		$(el).html(input);

		//让input获取焦点  给input赋值
		$(input).trigger('focus').val(val);


		//点击input的时候阻止冒泡
		$(input).click(function () {

			return false;
		})
		//鼠标离开的时候给sapn赋值
		$(input).blur(function () {

			var num = $(this).val();

			$(el).html(num);

			// console.log(model,attr,id)

			$.get('/admin/editNum', { model: model, attr: attr, id: id, num: num }, function (data) {

				console.log(data);
			})

		})

	}
}