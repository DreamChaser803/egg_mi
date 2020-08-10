'use strict';


// 继承基础控制器base
const BaseController = require("./base.js");


class GoodsController extends BaseController {

  async index() {

    await this.ctx.render("admin/goods/index");

  }

  async add() {
    
    //获取所有颜色
    let colorResult = await this.ctx.model.GoodsColor.find();

    //获取所有的商品类型
    var goodsType = await this.ctx.model.GoodsType.find({});

    await this.ctx.render("admin/goods/add", { colorResult: colorResult , goodsType : goodsType});

  }

  async doAdd() {

  }
  async goodsTypeAttribute() {

    let cate_id = this.ctx.request.query.cate_id;
    
    // console.log(cate_id);
    //注意 await
    let goodsTypeAttribute = await this.ctx.model.GoodsTypeAttribute.find({ "cate_id": cate_id })

    // console.log(goodsTypeAttribute);

    this.ctx.body = {
      result: goodsTypeAttribute
    }
  }

  async edit() {

  }

  async doEdit() {

  }

}

module.exports = GoodsController;
