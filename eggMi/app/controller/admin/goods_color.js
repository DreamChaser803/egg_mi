'use strict';


// 继承基础控制器base
const BaseController = require("./base.js");


class Goods_colorController extends BaseController {
     
  async index() {

    let goodsColor = await this.ctx.model.GoodsColor.find();
    
    await this.ctx.render("admin/goodsColor/index" ,{list : goodsColor});
  }
     
  async add() {

    await this.ctx.render("admin/goodsColor/add");

  }
     
  async doAdd() {

           let goodsColorAdd = new this.ctx.model.GoodsColor(
                this.ctx.request.body
           )
           goodsColorAdd.save()
        
           await this.success("/admin/goodsColor", "商品颜色增加成功")
  }
     
  async edit() {
      
        //查询数据库数据展示
        let edit = await this.ctx.model.GoodsColor.find(
            {
                _id: this.ctx.request.query.id
            }
        )

        await this.ctx.render("admin/goodsColor/edit", {
            list: edit
        })
  }
     
  async doEdit() {
      
        let id = this.ctx.request.body.id;


        //修改编辑数据库数据
        await this.ctx.model.GoodsColor.updateOne(
            {
                _id: id
            },
            this.ctx.request.body
        )
        await this.success("/admin/goodsColor", "编辑商品颜色成功")
  }
}

module.exports = Goods_colorController;
