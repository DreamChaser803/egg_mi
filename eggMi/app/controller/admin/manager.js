'use strict';

const Controller = require('egg').Controller;

class ManagerController extends Controller {

    /*
    
       用户RBAC管理员管理  

    */

    // 管理员列表
    async index() {
        // this.ctx.body = "管理员列表"
        await this.ctx.render("admin/manager/index",{
            username : "yuanbing"
        })
    }

    // 管理员增加
    async add() {
        this.ctx.body = "管理员增加"
    }

    //管理员编辑
    async edit() {
        this.ctx.body = "管理员编辑"
    }

    //管理员删除
    async delete() {
        this.ctx.body = "管理员删除"
    }
}

module.exports = ManagerController;
