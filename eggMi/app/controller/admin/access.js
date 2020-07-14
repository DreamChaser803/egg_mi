'use strict';

const Controller = require('egg').Controller;

class AccessController extends Controller {

    /*

      用户RBAC权限管理
     
    */

    //  权限列表
    async index() {
        this.ctx.body = "权限列表"
    }

    //   权限增加
    async add() {
        this.ctx.body = "权限增加"
    }

    //   权限编辑
    async edit() {
        this.ctx.body = "权限编辑"
    }

    //   权限删除
    async delete() {
        this.ctx.body = "权限删除"
    }
}

module.exports = AccessController;
