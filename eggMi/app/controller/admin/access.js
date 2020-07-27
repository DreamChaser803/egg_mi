'use strict';
// 继承基础控制器base
const BaseController = require("./base.js");

class AccessController extends BaseController {

    /*

      用户RBAC权限管理

      var result=await this.ctx.model.Access.find({});

      console.log(result);

      1、在access表中找出  module_id=0的数据        管理员管理 _id    权限管理 _id    角色管理  (模块)

      2、让access表和access表关联    条件：找出access表中  module_id等于_id的数据
     
    */

    //  权限列表
    async index() {

        //查询权限数据列表
        let access_list = await this.ctx.model.Access.aggregate([
            {
                $lookup: {
                    from: "access",
                    localField: "_id",
                    foreignField: "module_id",
                    as: "access"
                }
            },
            {
                $match: {
                    module_id: "0"
                }
            }
        ])
        await this.ctx.render("admin/access/index", { list: access_list })
    }

    //   权限增加
    async add() {

        // 查询所属模块
        let add_list = await this.ctx.model.Access.find({ module_id: "0" })

        await this.ctx.render("admin/access/add", { add_list })
    }

    //   权限增加功能
    async doAdd() {

        let doAdd_list = this.ctx.request.body;
        let module_id = doAdd_list.module_id;

        // 注意access里面 _id和module_id是自关联 但是类型不一样,要保证类型一样
        if (module_id != "0") {
            doAdd_list.module_id = this.app.mongoose.Types.ObjectId(module_id)
        }
        let accessResult = new this.ctx.model.Access(
            doAdd_list
        )
        accessResult.save()

        await this.success("/admin/access", "增加权限成功")
    }

    //   权限编辑页面
    async edit() {
        //获取编辑权限的id
        let id = this.ctx.request.query.id

        let resultAccessEdit = await this.ctx.model.Access.find(
            {
                _id: id
            }
        )
        let resultModule = await this.ctx.model.Access.find(
            {
                module_id: "0"
            }
        )

        await this.ctx.render("admin/access/edit", { list: resultAccessEdit[0], moduleList: resultModule })
    }
    //   权限编辑功能
    async doEdit() {
        // 获取编辑后的数据
        let update_doEdit = this.ctx.request.body;
        let id = this.ctx.request.body.id;
        let moduleID = this.ctx.request.body.module_id;

        // 判断是否为顶级模块
        if (moduleID != "0") {
            //    修改为和_id相同类型的id
            update_doEdit.module_id = this.app.mongoose.Types.ObjectId(moduleID)
        }

        let result_doEdit = await this.ctx.model.Access.updateOne(
            {
                _id: id
            },
            update_doEdit
        )
        //判断是否成功
        if (result_doEdit.ok) {
            await this.success("/admin/access", "修改权限成功")
        } else {
            await this.error("/admin/access", "修改权限失败")
        }
    }

}

module.exports = AccessController;
