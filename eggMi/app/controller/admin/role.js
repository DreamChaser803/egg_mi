'use strict';

const Controller = require('egg').Controller;

class RoleController extends Controller {

    /*
    
      用户RBAC角色管理  
    
    */

    //角色列表
    async index() {
        this.ctx.body = "角色列表"
    }

    //角色增加
    async add() {
        this.ctx.body = "角色增加"
    }

    //角色编辑
    async edit() {
       this.ctx.body = "角色编辑" 
    }

    //角色删除
    async delete() {
        this.ctx.body = "角色删除"
    }
    
}

module.exports = RoleController;
