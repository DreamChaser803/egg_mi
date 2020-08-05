'use strict';


// 继承基础控制器base
const BaseController = require("./base.js");

class GoodsTypeAttributeController extends BaseController {


    //商品类型属性列表
    async index() {


        //显示对应类型的属性

        //获取当前属性的类型id   分类id
        let cate_id = this.ctx.request.query.id;

        //  var result=await this.ctx.model.GoodsTypeAttribute.find({"cate_id":cate_id});

        let result = await this.ctx.model.GoodsTypeAttribute.aggregate([

            {
                $lookup: {
                    from: 'goods_type',
                    localField: 'cate_id',
                    foreignField: '_id',
                    as: 'goods_type'
                }
            },
            {
                $match: {   //cate_id字符串
                    cate_id: this.app.mongoose.Types.ObjectId(cate_id)   //注意
                }
            }
        ])
        // console.log(result)
        await this.ctx.render('admin/goodsTypeAttribute/index', {

            list: result,
            cate_id: cate_id
        });
    }

    //商品类型属性增加页面
    async add() {

        //查询数据库角色列表
        let result = await this.ctx.model.GoodsType.find({});
        // console.log(result)
        await this.ctx.render("admin/goodsTypeAttribute/add", { goodsTypes: result, cate_id: this.ctx.request.query.id })
    }

    //商品类型属性增加功能
    async doAdd() {


        console.log(this.ctx.request.body)
        //设置编辑时间
        let b = new Date();

        //增加数据库数据
        let goodsType = new this.ctx.model.GoodsTypeAttribute(this.ctx.request.body)
        await goodsType.save();

        await this.success("/admin/goodsTypeAttribute?id=" + this.ctx.request.body.cate_id, "商品类型属性增加成功")


    }

    //商品类型属性编辑页面
    async edit() {

        console.log(this.ctx.request.query)

        //查询数据库数据展示
        let GoodsTypeAttribute = await this.ctx.model.GoodsTypeAttribute.find(
            {
                _id: this.ctx.request.query.id
            }
        )
        //所选类型
        let GoodsTypes = await this.ctx.model.GoodsType.find()

        await this.ctx.render("admin/goodsTypeAttribute/edit", {
            list: GoodsTypeAttribute[0],
            goodsTypes: GoodsTypes
        })
    }

    //商品类型属性编辑功能
    async doEdit() {


        // console.log(this.ctx.request.body)
        //获取用户post参数

        let id = this.ctx.request.body._id;

        let title=this.ctx.request.body.title;

        let cate_id=this.ctx.request.body.cate_id;

        let attr_type=this.ctx.request.body.attr_type;

        let attr_value=this.ctx.request.body.attr_value;

        // //设置编辑时间
        let b = new Date();

        //修改编辑数据库数据
        await this.ctx.model.GoodsTypeAttribute.updateOne(
            {
                _id: id
            },
            // this.ctx.request.body
           {
            title,
            cate_id,
            attr_type,
            attr_value,
            add_time : b.getTime()
           }
        )
        await this.success("/admin/goodsTypeAttribute?id=" + this.ctx.request.body.cate_id, "编辑商品类型属性成功")
    }
}

module.exports = GoodsTypeAttributeController;
