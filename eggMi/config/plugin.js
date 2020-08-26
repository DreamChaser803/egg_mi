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
};
