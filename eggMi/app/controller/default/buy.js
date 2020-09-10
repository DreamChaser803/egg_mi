'use strict';

const order = require('../../model/order');

const Controller = require('egg').Controller;

class BuyController extends Controller {

  //去结算
  async checkout() {

    var orderList = [];
    var allPrice = 0;

    // 签名 防止订单重复提交
    var orderSign = await this.ctx.service.tools.md5(await this.ctx.service.tools.getRandomNum());
    this.ctx.session.orderSign = orderSign;

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
        addressList: addressResult,
        orderSign: orderSign
      });
    } else {
      // 恶意操作
      this.ctx.redirect("/cart");
    }



  }

  async doOrder() {
    /*
    1、获取收货地址信息
  
    2、需要获取购买商品的信息
  
    3、把这些信息  放在订单表  
          
    4、删除购物车里面的数据
  */

    /*防止提交重复订单*/
    var orderSign = this.ctx.request.body.orderSign;

    if (orderSign != this.ctx.session.orderSign) {
      return false
    }
    this.ctx.session.orderSign = null

    var uid = this.ctx.service.cookies.get("userinfo")._id;
    var addressResult = await this.ctx.model.Address.find({ "uid": uid, "default_address": 1 });
    var cartList = this.ctx.service.cookies.get("cartList");

    if (addressResult && addressResult.length > 0 && cartList && cartList.length > 0) {

      var all_price = 0; // 总价
      var orderList = cartList.filter((value) => {
        if (value.checked) {
          all_price += value.price * value.num;
          return value
        }
      })
      // console.log(orderList)

      // 提交定订单 保存订单数据
      var order_id = await this.ctx.service.tools.getOrderId();
      var name = addressResult[0].name;
      var phone = addressResult[0].phone;
      var address = addressResult[0].address;
      var zipcode = addressResult[0].zipcode;
      var pay_status = 0;
      var pay_type = "";
      var order_status = 0;

      var orderModel = new this.ctx.model.Order({
        order_id, name, phone, address, zipcode, pay_status, pay_type, order_status, all_price
      })
      var orderResult = await orderModel.save();
      // console.log(orderResult)
      if (orderResult && orderResult._id) {

        for (var i = 0; i < orderList.length; i++) {
          var json = {
            "order_id": orderResult._id,   //订单id
            "product_title": orderList[i].title,
            "product_id": orderList[i]._id,
            "product_img": orderList[i].goods_img,
            "product_price": orderList[i].price,
            "product_num": orderList[i].num
          }

          var orderItemModel = new this.ctx.model.OrderItem(json);
          await orderItemModel.save();
        }

        var unCheckedCartList = cartList.filter((value) => {
          if (!value.checked) {
            return value
          }
        })

        this.ctx.service.cookies.set("cartList", unCheckedCartList);
        this.ctx.redirect('/buy/confirm?id=' + orderResult._id);

      } else {
        this.ctx.redirect('/checkout');
      }

    } else {
      this.ctx.redirect('/checkout');
    }
  }
  //确认订单  支付
  async confirm() {

    var id = this.ctx.request.query.id; // order id

    var orderResult = await this.ctx.model.Order.find({ "_id": id });

    if (orderResult && orderResult.length > 0) {

      var orderItemResult = await this.ctx.model.OrderItem.find({ "order_id": id });

      await this.ctx.render('default/confirm.html', {
        orderResult: orderResult[0],
        orderItemResult: orderItemResult
      });
    } else {
      this.ctx.redirect("/")
    }



  }
}

module.exports = BuyController;
