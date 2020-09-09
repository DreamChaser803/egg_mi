/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1594178783123_1039';

  // add your middleware config here
  config.middleware = ["adminauth"];
  config.adminauth = {
    match: '/admin',//通用设置,只有/admin开头的路由使用这个中间件
  }

  // 上传文件保存的服务器地址
  config.uploadDir = 'app/public/admin/upload';


  //配置模板引擎
  config.view = {
    mapping: {
      '.html': 'ejs',
      '.nj': 'nunjucks',//[egg可以配置多种模板引擎使用,业务需求而定]
    },
  };
  //配置session
  config.session = {
    key: 'SESSION_ID',
    maxAge: 1000 * 60 * 60 * 24 * 7,  //时间限制
    httpOnly: true, //只能服务端访问
    encrypt: true, //加密
    renew: true //  延长会话有效期       
  };

  // 配置mongoose
  config.mongoose = {
    // client: {
    //   url: 'mongodb://egg_mi:803216@127.0.0.1/egg_mi',
    //   options: {},
    //   // mongoose global plugins, expected a function or an array of function and options
    //   // plugins: [createdPlugin, [updatedPlugin, pluginOptions]],
    // },
    client: {
      url: 'mongodb://mimi:123456@127.0.0.1/mimi',
      options: {},
      // mongoose global plugins, expected a function or an array of function and options
      // plugins: [createdPlugin, [updatedPlugin, pluginOptions]],
    },
  };
 
  //配置redis数据库
  config.redis = {
    client: {
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      password: '',
      db: 0,
    },
  }

  // https://github.com/eggjs/egg-multipart/blob/master/config/config.default.js
  // 配置egg-multipart的参数最大数量
  config.multipart = {
    fields: 50 //配置表单数量
  }

  exports.security = {
    csrf: {
      // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
      ignore: ctx => {
        if (ctx.request.url == '/admin/goods/goodsUploadImage' || ctx.request.url == '/admin/goods/goodsUploadPhoto' || ctx.request.url == '/pass/doLogin' || ctx.request.url =='/user/addAddress' || ctx.request.url == '/user/editOneAddressList') {
          return true;
        }
        return false;
      }
    }
  }

  //定义缩略图的尺寸
  exports.jimpSize = [

    {
      width: 180,
      height: 180
    }, {

      width: 400,
      height: 400
    }

  ]


  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
