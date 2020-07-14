'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
   
  // 后台管理
  require("./routers/admin.js")(app)

};
