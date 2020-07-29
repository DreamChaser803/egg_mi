'use strict';

const Service = require('egg').Service;

//导入内置模块
const url = require("url")

class AdminService extends Service {

    // 鉴权功能
    async checkAuth() {
        /*
        1、获取当前用户的角色        （忽略权限判断的地址    is_super）
        2、根据角色获取当前角色的权限列表                       
        3、获取当前访问的url 对应的权限id
        4、判断当前访问的url对应的权限id 是否在权限列表中的id中
    */

        // 1,获取用户信息
        let userInfo = this.ctx.session.userInfo;
        // 2,获取用户角色id
        let role_id = userInfo.role_id;
        // 3,获取当前访问的路由url
        let pathname = url.parse(this.ctx.request.url).pathname

        // 4,忽略权限判断的地址    is_super表示是管理员is_super == 1 是超级管理员拥有所有权限
        let ignoreUrl = ["/admin/login", "/admin/dologin", "/admin/loginOut", "/admin/verify"]
        if (ignoreUrl.indexOf(pathname) != -1 || userInfo.is_super == 1) {
            return true //允许访问
        }
        // 5,获取用户权限
        let accessResult = await this.ctx.model.RoleAccess.find(
            {
                role_id: role_id
            }
        )

        let accessArray = []; //储存权限id
        accessResult.map((value) => {
            accessArray.push(value.access_id.toString());
        })


        //查询当前访问的url
        let accessUrlResult = await this.ctx.model.Access.find(
            {
                url: pathname
            }
        )
        // console.log(accessUrlResult)
        
        // 是否存在这个权限
        if (accessUrlResult.length > 0) {
            if (accessArray.indexOf(accessUrlResult[0]._id.toString()) != -1) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }

    }

    //权限页面展示
    async getAuthList(id){
            
        /*

         1、获取全部的权限  

         2、查询当前角色拥有的权限（查询当前角色的权限id） 把查找到的数据放在数组中

         3、循环遍历所有的权限数据     判断当前权限是否在角色权限的数组中，   如果在角色权限的数组中：选中    如果不在角色权限的数组中不选中
         
        */

          // 获取角色有的权限
          let result_access = await this.ctx.model.RoleAccess.find({ role_id: id });

          // 储存该角色的所有权限id
          let result_access_array = [];
  
          result_access.map((value) => {
              result_access_array.push(value.access_id.toString())
          })
          // 查询权限数据列表
          let role_list = await this.ctx.model.Access.aggregate([
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
  
          for (let i = 0; i < role_list.length; i++) {
              // 顶级模块
              if (result_access_array.indexOf(role_list[i]._id.toString()) != -1) {
                  role_list[i].checked = true;
              }
              // 功能模块
              for (let j = 0; j < role_list[i].access.length; j++) {
                  if (result_access_array.indexOf(role_list[i].access[j]._id.toString()) != -1) {
                      role_list[i].access[j].checked = true;
                  }
              }
          }

          return role_list
    }
}

module.exports = AdminService;
