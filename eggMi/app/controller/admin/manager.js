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
        
        //查询管理员数据列表
        let manager = await this.ctx.model.Admin.findOne(
            {
                _id: this.ctx.request.query.id
            }
        )

        // 查询所有角色放置到管理员增加选择栏 
        let role_list = await this.ctx.model.Role.find({});

        await this.ctx.render("admin/manager/edit", { manager, role_list })
    }
    //管理员编辑功能
    async doEdit() {

        //获取需要的参数
        let id = this.ctx.request.body.id
        let password = await this.service.tools.md5(this.ctx.request.body.password);
        let mobile = this.ctx.request.body.mobile;
        let email = this.ctx.request.body.email;
        let role_id = this.ctx.request.body.role_id;

        //判断用户是否编辑了密码
        if (this.ctx.request.body.password) {
            
            await this.ctx.model.Admin.updateOne(
                {
                    _id: id
                },
                {
                    password,
                    mobile,
                    email,
                    role_id
                }
            )
        } else {

            await this.ctx.model.Admin.updateOne(
                {
                    _id: id
                },
                {
                    mobile,
                    email,
                    role_id
                }
            )
        }
        await this.success("/admin/manager", "编辑用户成功")

    }
}

module.exports = ManagerController;
