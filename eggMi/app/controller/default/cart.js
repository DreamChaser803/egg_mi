'use strict';

const goods = require('../../model/goods');

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

        this.ctx.redirect('/addCartSuccess?goods_id=' + goods_id + '&color_id=' + color_id);
    }

    async addCartSuccess() {

        var goods_id = this.ctx.request.query.goods_id;
        var color_id = this.ctx.request.query.color_id;

        var goodsResult = await this.ctx.model.Goods.find({ _id: goods_id });
        var colorResult = await this.ctx.model.GoodsColor.find({ _id: color_id });

        if (goodsResult.length == 0 || colorResult.length == 0) {
            this.ctx.status = 404;
            this.ctx.body = "错误404"
        } else {
            var title = goodsResult[0].title + "--" + goodsResult[0].goods_version + "--" + colorResult[0].color_name;
            await this.ctx.render('default/add_cart_success.html', { title: title, goods_id: goods_id });
        }

    }

    async incCart() {

        var goods_id = this.ctx.request.query.goods_id;
        var color = this.ctx.request.query.color;

        var goodsResult = await this.ctx.model.Goods.find({ _id: goods_id });
        if (goodsResult.length == 0) {
            this.ctx.status = 404;
            this.ctx.body = "404错误"
        } else {
            var cartList = this.ctx.service.cookies.get("cartList");
            //  console.log(cartList);
            var currentNum = 0; // 当前数量
            var allPrice = 0; // 总价
            for (var i = 0; i < cartList.length; i++) {
                if (cartList[i]._id == goods_id && cartList[i].color == color) {
                    cartList[i].num += 1;
                    currentNum = cartList[i].num;
                }
                if (cartList[i].checked) {
                    allPrice += cartList[i].num * cartList[i].price
                }
            }
            this.ctx.service.cookies.set("cartList", cartList);
            this.ctx.body = {
                "success": true,
                num: currentNum,
                allPrice: allPrice
            }
        }

    }

    async decCart() {
        var goods_id = this.ctx.request.query.goods_id;
        var color = this.ctx.request.query.color;

        var goodsResult = await this.ctx.model.Goods.find({ _id: goods_id });
        if (goodsResult.length == 0) {
            this.ctx.status = 404;
            this.ctx.body = "404错误"
        } else {
            var cartList = this.ctx.service.cookies.get("cartList");
            //  console.log(cartList);
            var currentNum = 0; // 当前数量
            var allPrice = 0; // 总价
            for (var i = 0; i < cartList.length; i++) {
                if (cartList[i]._id == goods_id && cartList[i].color == color) {
                    cartList[i].num -= 1;
                    currentNum = cartList[i].num;
                }
                if (cartList[i].checked) {
                    allPrice += cartList[i].num * cartList[i].price
                }
            }
            this.ctx.service.cookies.set("cartList", cartList);
            this.ctx.body = {
                "success": true,
                num: currentNum,
                allPrice: allPrice
            }
        }

    }

    //改变购物车商品的状态  
    async changeOneCart() {

        var goods_id = this.ctx.request.query.goods_id;
        var color = this.ctx.request.query.color;

        var goodsResult = await this.ctx.model.Goods.find({ "_id": goods_id });

        if (!goodsResult || goodsResult.length == 0) {
            this.ctx.body = {
                "success": false,
                msg: '改变状态失败'
            }
        } else {
            var cartList = this.service.cookies.get('cartList');
            var allPrice = 0;   //总价格
            for (var i = 0; i < cartList.length; i++) {
                if (cartList[i]._id == goods_id && cartList[i].color == color) {
                    cartList[i].checked = !cartList[i].checked;
                }
                //计算总价
                if (cartList[i].checked) {
                    allPrice += cartList[i].price * cartList[i].num;
                }
            }

            this.service.cookies.set('cartList', cartList);
            this.ctx.body = {
                "success": true,
                allPrice: allPrice
            }
        }


    }

    //改变所有购物车商品的状态  
    async changeAllCart() {
        var type = this.ctx.request.query.type;
        var cartList = this.service.cookies.get('cartList');
        var allPrice = 0;   //总价格
        for (var i = 0; i < cartList.length; i++) {

            if (type == 1) {
                cartList[i].checked = true;
            } else {
                cartList[i].checked = false;
            }
            //计算总价
            if (cartList[i].checked) {
                allPrice += cartList[i].price * cartList[i].num;
            }
        }

        this.service.cookies.set('cartList', cartList);
        this.ctx.body = {
            "success": true,
            allPrice: allPrice
        }

    }

    async removeCart() {

        var goods_id = this.ctx.request.query.goods_id;
        var color = this.ctx.request.query.color;

        var goodsResult = await this.ctx.model.Goods.find({ "_id": goods_id });

        if (!goodsResult || goodsResult.length == 0) {

            this.ctx.redirect('/cart');

        } else {
            var cartList = this.service.cookies.get('cartList');

            for (var i = 0; i < cartList.length; i++) {
                if (cartList[i]._id == goods_id && cartList[i].color == color) {

                    cartList.splice(i, 1);

                }
            }
            this.service.cookies.set('cartList', cartList);
            this.ctx.redirect('/cart');
        }


    }

    async cartList() {

        var cartList = this.ctx.service.cookies.get("cartList");
        // console.log(cartList)
        if (cartList.length > 0) {
            var allPrice = 0;
            for (var i = 0; i < cartList.length; i++) {
                if (cartList[i].checked) {
                    allPrice += cartList[i].price * cartList[i].num;
                }
            }
        }
        await this.ctx.render('default/cart.html', {
            cartList: cartList,
            allPrice: allPrice
        });
    }
}

module.exports = CartController;
