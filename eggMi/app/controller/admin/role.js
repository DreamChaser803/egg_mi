'use strict';
// 继承基础控制器base
const BaseController = require("./base.js");

class RoleController extends BaseController {

    /*
    
      用户RBAC角色管理  
    
    */

    //角色列表
    async index() {
        
        //查询数据库角色列表
        let result = await this.ctx.model.Role.find({});
        
        //模板渲染
        await this.ctx.render("admin/role/index",{ list: result } )

    }

    //角色增加页面
    async add() {
        
        await this.ctx.render("admin/role/add")
    }

    //角色增加功能
    async doAdd() {
         
        //增加数据库数据
        let role = new this.ctx.model.Role(
            {
                title: this.ctx.request.body.title,
                description: this.ctx.request.body.description
            }
        )
        await role.save();
        
        await this.success("/admin/role","角色增加成功")


    }

    //角色编辑页面
    async edit() {

        //查询数据库数据展示
        let edit = await this.ctx.model.Role.find(
            {
                _id : this.ctx.request.query.id
            }
        )

        await this.ctx.render("admin/role/edit",{
                list : edit
        })
    }

    //角色编辑功能
    async doEdit() {
       
        //获取用户post参数
        let title = this.ctx.request.body.title;
        let description = this.ctx.request.body.description;
        let id = this.ctx.request.body.id;

        //修改编辑数据库数据
        await this.ctx.model.Role.updateOne(
            {
                _id : id
            },
            {
                title ,
                description 
            }
        )
        await this.success("/admin/role","编辑成功")
    }

    //角色删除
    async delete() {
        this.ctx.body = "角色删除"
    }

}

module.exports = RoleController;
