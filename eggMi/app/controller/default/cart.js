'use strict';

const Controller = require('egg').Controller;

class CartController extends Controller {

    async addCart() {

        // 获取 goods 的id color id
        var goods_id = this.ctx.request.query.goods_id;
        var color_id = this.ctx.request.query.color_id;

        // 获取对应goods color数据
        var goodsResult = await this.ctx.model.Goods.find({ _id: goods_id });
        var colorResult = await this.ctx.model.GoodsColor.find({ _id: color_id });
        // console.log(goodsResult)
        //判断数据是否存在
        if (goodsResult.length == 0 || colorResult.length == 0) {
            this.ctx.status = 404;
            this.ctx.body = "404 数据不存在"
        } else {
            // 赠品
            if (goodsResult[0].goods_gift) {
                var goodsGiftIds = this.ctx.service.goods.strToArray(goodsResult[0].goods_gift);
                var goodsGift = await this.ctx.model.Goods.find({
                    $or: goodsGiftIds
                });
            }

            // 储存的单条数据
            var currentData = {
                _id: goods_id,
                title: goodsResult[0].title,
                price: goodsResult[0].shop_price,
                goods_version: goodsResult[0].goods_version,
                num: 1,
                color: colorResult[0].color_name,
                goods_img: goodsResult[0].goods_img,
                goods_gift: goodsGift,  /*赠品*/
                checked: true           /*默认选中*/
            }

            //判 断 cookies cart里面是否有数据
            var cartList = await this.ctx.service.cookies.get("cartList"); // 结果 true / false
            if (cartList && cartList.length > 0) {

                //4、判断购物车有没有当前数据  
                 var cartHasData = await this.ctx.service.cart.cartHasData(cartList, currentData);
                if (cartHasData) {
                    for (var i = 0; i < cartList.length; i++) {
                        if (cartList[i]._id == currentData._id) {
                            cartList[i].num = cartList[i].num + 1;
                        }
                    }
                    this.ctx.service.cookies.set("cartList", cartList)
                } else {

                    //如果购物车里面没有当前数据   把购物车以前的数据和当前数据拼接 然后重新写入
                    var tempArr = cartList;
                    tempArr.push(currentData);
                    this.ctx.service.cookies.set("cartList", tempArr);
                }
            } else {
                var tempArr = [];
                tempArr.push(currentData);
                this.ctx.service.cookies.set("cartList", tempArr)
            }


        }

        this.ctx.body = '加入cart成功';
    }
    async cartList() {
        var cartList = this.ctx.service.cookies.get("cartList");

        this.ctx.body = cartList;
    }
}

module.exports = CartController;
