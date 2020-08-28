'use strict';

const Controller = require('egg').Controller;

class ProductController extends Controller {

  async list() {

    //获取goodsCate 的 id
    let goodsCateCid = this.ctx.request.query.cid;

    let goodsCateRes = await this.ctx.model.GoodsCate.findOne({ "_id": goodsCateCid });

    // 判断是否是二级goodsCate
    if (goodsCateRes.pid == "0") {

      // 获取二级goodsCate 的 _id
      var goodsCateResult = await this.ctx.model.GoodsCate.find({ "pid": this.app.mongoose.Types.ObjectId(goodsCateCid) }, "_id");

      var goodsCate_list = [];

      goodsCateResult.forEach((value) => {

        goodsCate_list.push(
          {
            cate_id: value._id
          }
        )

      })

      var goodsRes = await this.ctx.model.Goods.find({ $or: goodsCate_list }, '_id title price sub_title goods_img shop_price');

    } else {

      var goodsRes = await this.ctx.model.Goods.find({ cate_id: goodsCateCid }, '_id title price sub_title goods_img shop_price');

    }

    var tpl = goodsCateRes.template ? goodsCateRes.template : 'default/product_list.html'; // 判断是否是自定义页面 例如 aaa.html

    await this.ctx.render(tpl, { goodsRes: goodsRes });
  }


  async info() {

    let goodsId = this.ctx.request.query.id; // 获取 goods 的 id 

    // 获取 goods 详情
    let goodsRes = await this.ctx.model.Goods.findOne({ _id: goodsId });


    //关联商品版本
    let relationGoodsIds = await this.ctx.service.goods.strToArray(goodsRes.relation_goods)
    let goods_version = await this.ctx.model.Goods.find({ $or: relationGoodsIds }, "goods_version shop_price");// 获取 goods 版本


    //关联商品color
    let goodsColorIds = await this.ctx.service.goods.strToArray(goodsRes.goods_color)
    let goodsColor = await this.ctx.model.GoodsColor.find({ $or: goodsColorIds });// 获取 goods color

    //7、获取规格参数信息
    let goodsAttr = await this.ctx.model.GoodsAttr.find({ "goods_id": goodsId });


    await this.ctx.render('default/product_info.html',
      { 
        goodsRes: goodsRes, 
        goods_version: goods_version, 
        goodsColor: goodsColor,
        goodsAttr : goodsAttr
      });

  }
}

module.exports = ProductController;
