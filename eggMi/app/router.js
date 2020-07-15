'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {

  // 后台管理
  require("./routers/admin.js")(app)
  // 前    端
  require("./routers/index.js")(app)
  // a  p  i
  require("./routers/api.js")(app)

};
