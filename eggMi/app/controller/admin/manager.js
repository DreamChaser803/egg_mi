'use strict';
// 继承基础控制器base
const BaseController = require("./base.js");
const md5 = require("md5");

class ManagerController extends BaseController {

    /*
    
       用户RBAC管理员管理  

    */

    // 管理员列表
    async index() {

        //查询管理员数据列表
        let manager = await this.ctx.model.Admin.aggregate([
            {
                $lookup: {
                    from: "role",
                    localField: "role_id",
                    foreignField: "_id",
                    as: "role"
                }
            }
        ])

        await this.ctx.render("admin/manager/index", { manager })
    }

    // 管理员增加页面
    async add() {

        // 查询所有角色放置到管理员增加选择栏 
        let role_list = await this.ctx.model.Role.find({});

        await this.ctx.render("admin/manager/add", { role_list });

    }
    // 管理员增加功能
    async doAdd() {

        //获取要添加的管理员数据
        let model = this.ctx.request.body;

        //管理员密码加密
        model.password = await md5(model.password)

        //查询有没有重名的管理员
        let admin_list = await this.ctx.model.Admin.find({ username: this.ctx.request.body.username });

        if (admin_list.length == 0) {
            let manager_list = await this.ctx.model.Admin(
                model
            )
            await manager_list.save();
            await this.success(this.ctx.state.prevPage, "管理员增加成功")
        } else {
            await this.error(this.ctx.state.prevPage, "用户名已存在")
        }
    }

    //管理员编辑页面
    async edit() {
        console.log(this.ctx.request.query)
        //查询管理员数据列表
        let manager = await this.ctx.model.Admin.findOne(
            {
                _id: this.ctx.request.query.id
            }
        )
        console.log(manager)

        // 查询所有角色放置到管理员增加选择栏 
        let role_list = await this.ctx.model.Role.find({});
        console.log(role_list)
        await this.ctx.render("admin/manager/edit", { manager, role_list })
    }
    //管理员编辑功能
    async doEdit() {


    }

}

module.exports = ManagerController;
