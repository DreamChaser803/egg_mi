'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  //配置ejs模板引擎
  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  },
  //配置nj模板引擎
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  // 配置mongoose
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  //配置redis
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  // 配置全文搜索 配置出错
  // elasticsearch: {
  //   enable: true,
  //   package: 'egg-es',
  // },
  // 配置 跨域请求
  cors: {
    enable: true,
    package: 'egg-cors',
  },
};

