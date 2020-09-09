'use strict';

const Controller = require('egg').Controller;

class BuyController extends Controller {

  //去结算
  async checkout() {

    var orderList = [];
    var allPrice = 0;

    var cartList = this.ctx.service.cookies.get("cartList");
    // console.log(cartList)
    if (cartList && cartList.length > 0) {
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i].checked) {
          orderList.push(cartList[i]);
          allPrice += cartList[i].price * cartList[i].num;
        }
      }
      
      var uid = this.ctx.service.cookies.get("userinfo")._id;
      var addressResult = await this.ctx.model.Address.find({ "uid": uid }).sort({ default_address: -1 });
      await this.ctx.render('default/checkout.html', {
        orderList: orderList,
        allPrice: allPrice,
        addressList: addressResult
      });
    } else {
      // 恶意操作
      this.ctx.redirect("/cart");
    }



  }
  //确认订单  支付
  async confirm() {
    this.ctx.body = 'confirm';
  }
}

module.exports = BuyController;
