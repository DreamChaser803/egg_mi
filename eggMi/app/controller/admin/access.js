'use strict';
// 继承基础控制器base
const BaseController = require("./base.js");

class AccessController extends BaseController {

    /*

      用户RBAC权限管理
     
    */

    //  权限列表
    async index() {
        // this.ctx.body = "权限列表"

        await this.ctx.render("admin/access/index")
    }

    //   权限增加
    async add() {
        // this.ctx.body = "权限增加"

        await this.ctx.render("admin/access/add")
    }

    //   权限编辑
    async edit() {
        // this.ctx.body = "权限编辑"

        await this.ctx.render("admin/access/edit")
    }

}

module.exports = AccessController;
