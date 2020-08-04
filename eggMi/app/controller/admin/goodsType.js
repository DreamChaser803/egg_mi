'use strict';

// 继承基础控制器base
const BaseController = require("./base.js");

class GoodsTypeController extends BaseController {



    //商品类型列表
    async index() {

        //查询数据库角色列表
        let result = await this.ctx.model.GoodsType.find({});

        //模板渲染
        await this.ctx.render("admin/goodsType/index", { list: result })

    }

    //商品类型增加页面
    async add() {

        await this.ctx.render("admin/goodsType/add")
    }

    //商品类型增加功能
    async doAdd() {


        console.log(this.ctx.request.body)
        //设置编辑时间
        let b = new Date();

        //增加数据库数据
        let goodsType = new this.ctx.model.GoodsType(
            {
                title: this.ctx.request.body.title,
                description: this.ctx.request.body.description,
                add_time: b.getTime()
            }
        )
        await goodsType.save();

        await this.success("/admin/goodsType", "商品类型增加成功")


    }

    //商品类型编辑页面
    async edit() {

        //查询数据库数据展示
        let GoodsType = await this.ctx.model.GoodsType.find(
            {
                _id: this.ctx.request.query.id
            }
        )
       console.log(GoodsType)
        await this.ctx.render("admin/goodsType/edit", {
            list: GoodsType[0]
        })
    }

    //商品类型编辑功能
    async doEdit() {
         

        console.log(this.ctx.request.body)
        //获取用户post参数
        let title = this.ctx.request.body.title;
        let description = this.ctx.request.body.description;
        let id = this.ctx.request.body._id;

        //设置编辑时间
        let b = new Date();

        //修改编辑数据库数据
        await this.ctx.model.GoodsType.updateOne(
            {
                _id: id
            },
            {
                title,
                description,
                add_time: b.getTime()
            }
        )
        await this.success("/admin/goodsType", "编辑商品类型成功")
    }
}

module.exports = GoodsTypeController;
