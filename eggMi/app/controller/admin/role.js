'use strict';
// 继承基础控制器base
const BaseController = require("./base.js");

class RoleController extends BaseController {

    /*
    
      用户RBAC角色管理  
    
    */

    //角色列表
    async index() {
        // this.ctx.body = "角色列表"
        await this.ctx.render("admin/role/index")
        // console.log(this.ctx.state.userInfo)
    }

    //角色增加
    async add() {
        //    this.ctx.body = "角色增加"
        await this.ctx.render("admin/role/add")
    }

    //角色编辑
    async edit() {
        //    this.ctx.body = "角色编辑" 
        await this.ctx.render("admin/role/edit")
    }

    //角色删除
    async delete() {
        this.ctx.body = "角色删除"
    }

}

module.exports = RoleController;
