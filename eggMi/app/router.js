'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {

  // 后台管理
  require("./routers/admin.js")(app)
  // 前端
  require("./routers/default.js")(app)
  // api
  require("./routers/api.js")(app)

};
