'use strict';
// 继承基础控制器base
const BaseController = require("./base.js");
const role = require("../../model/role.js");

class RoleController extends BaseController {

    /*
    
      用户RBAC角色管理  
    
    */
    //角色列表
    async index() {

        //查询数据库角色列表
        let result = await this.ctx.model.Role.find({});

        //模板渲染
        await this.ctx.render("admin/role/index", { list: result })

    }

    //角色增加页面
    async add() {

        await this.ctx.render("admin/role/add")
    }

    //角色增加功能
    async doAdd() {
        //设置编辑时间
        let b = new Date();

        //增加数据库数据
        let role = new this.ctx.model.Role(
            {
                title: this.ctx.request.body.title,
                description: this.ctx.request.body.description,
                add_time: b.getTime()
            }
        )
        await role.save();

        await this.success("/admin/role", "角色增加成功")


    }

    //角色编辑页面
    async edit() {

        //查询数据库数据展示
        let edit = await this.ctx.model.Role.find(
            {
                _id: this.ctx.request.query.id
            }
        )

        await this.ctx.render("admin/role/edit", {
            list: edit
        })
    }

    //角色编辑功能
    async doEdit() {

        //获取用户post参数
        let title = this.ctx.request.body.title;
        let description = this.ctx.request.body.description;
        let id = this.ctx.request.body.id;

        //设置编辑时间
        let b = new Date();

        //修改编辑数据库数据
        await this.ctx.model.Role.updateOne(
            {
                _id: id
            },
            {
                title,
                description,
                add_time: b.getTime()
            }
        )
        await this.success("/admin/role", "编辑角色成功")
    }

    //授权页面
    async auth() {

        /*

         1、获取全部的权限  

         2、查询当前角色拥有的权限（查询当前角色的权限id） 把查找到的数据放在数组中

         3、循环遍历所有的权限数据     判断当前权限是否在角色权限的数组中，   如果在角色权限的数组中：选中    如果不在角色权限的数组中不选中
         
        */

        // 获取授权角色id
        let id = this.ctx.request.query.id;
        // 使用service 中的公共方法
        let role_list = await this.ctx.service.admin.getAuthList(id)
        await this.ctx.render("/admin/role/auth", { list: role_list, id })
    }

    //授权功能
    async doAuth() {
        // 获取角色id
        let role_id = this.ctx.request.body.id;
        // 获取保存的权限id
        let access_node = this.ctx.request.body.access_node;

        //增加权限之前先删除权限避免 重复增加
        await this.ctx.model.RoleAccess.deleteMany({ "role_id": role_id })

        //遍历 access_node 中的权限id
        for (let i = 0; i < access_node.length; i++) {
            let role_access = await new this.ctx.model.RoleAccess(
                {
                    role_id: role_id,
                    access_id: access_node[i]
                }
            )
            role_access.save()
        }
        await this.success("/admin/role/auth?id=" + role_id, "授权成功")
    }

}

module.exports = RoleController;
