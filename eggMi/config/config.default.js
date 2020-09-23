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
        if (ctx.request.url == '/admin/goods/goodsUploadImage' || ctx.request.url == '/admin/goods/goodsUploadPhoto' || ctx.request.url == '/pass/doLogin' || ctx.request.url == '/user/addAddress' || ctx.request.url == '/user/editOneAddressList' || ctx.request.url == '/alipay/alipayNotify') {
          return true;
        } else if (ctx.request.url.indexOf('/api') != -1) { // 前后端分离 关闭 api 接口 csrf验证
          return true;
        } else {
          return false;
        }
      },
    },
    domainWhiteList: [ 'http://localhost:8080' ] // 配置安全域名  白名单
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



  //支付宝支付的配置
  exports.alipayOptions = {
    app_id: '2018122062672017',
    appPrivKeyFile: "MIIEowIBAAKCAQEAytRAWUJE+t7Xg62PFPpwCxaIBwO942bZX2ehlHbdLSs0i1H3xHlIGTF/0pAYksLuXq8ovyGW263MqvAjt5n97JPjD1ip9eFuIZhZ2wbrOac+MerE+x7agDOBgmJGwdffxbGRRkjz/OtwrIfIVf7TcAm/MPSAuD3RAIkvVXzQO16x6BnBnev1JR+HybeyUssMCk1y6JZ2pZ4H62gGKGvDQcV8NW0q7g4qu2CwQKMVhbnMpG/wRuIla/MOB9MPZiV4CINsxNGya5mmzkXTemjheRl9me6dEZEgKU+tcgTH5Y36faRphbQQ9ATAt3EZQXw4gkoO9vHyEsf7mAAOofQyVQIDAQABAoIBAG+PpUEzKRvPnDyqJuwD/8KphvJMxZIhjOhj6MTvSCJDBGipEh24E8b/qe3YIhv/KftcXo4aXI7CHrPa19px0e/hO9/CBeHfN6M02B+Xw6P3cEcmeWgihU5EhjR/96lBIqzrSRuensz7dwL+wFtEiWmzgrzbjz1HiwC/dBCSUTqFlT7+M+xx8N6w3gQbZ8bpW33XY4KB26C5G8/g6ImEMUbNez8p+24qVztszHWfDHmGJp//Z4g6dgyd2RNrNZdzCyNmlsFRYRXgKa1WbC7qi2ihPUMmYLhlD5OFwZkGbk7bPy+GTYfAK6JjHRjONtdcE06pVFPUMlr7OL96MsABt1UCgYEA8YEPuvbE0Y4i+YlHrYxJ8iJ8WceWL1mNp6QFG6cNQ06+ohPhVVjEdKSFLQIz03aRGQI+E6Kuki5JVwlUeUmqJM1LJxA7NEm9b+YNQG+Y/23FcYAbuaiJp22qpo45XNLSs6QoKcqyJkZwM/Niv07mLP907PSt6WzM4a10vVs+pu8CgYEA1wDpWdxPpUsVfggCrfel6DveLzHvtX4DWPbL9NXj2j39B6Y0+1BuHMw5WZ/GoZxC0Gi/buuspwaqws9HiGg5ttMJqz23YOKUwHkpZrIpZjyVAjDoRduKcaX3q4/NCs5CPzWoGjfcJXoxcoZuYos5/kg+tXhmsH/DA0jmTfyR2vsCgYATZ71t1npGJFenGWLLDSS78g1v4Vut/lIlkEZgzHGCYQdsWpCWnQVcIgQZc73aVgKesdFvHnlMga+e8L765/Jl9qD9SI6ZSvuPzDpwXQc8LwPYdOTFbEdzTpqRu4fcb4xCpwQbJ5BdBvfpFLtwh9Ry9SveBmMbCIUF9TwWIwjLvQKBgFcQpG5iO9J4zFREFCm0rneTvs6nzyVUyTA+iKs17lYTYiK12KComl6JCPRVMk+BgsD4mgTl5P2iQoYvAA2p/y0c2r6AeIEAYDJtHinbHc6r27+OZJDdbXvGNLxBuEuW6NbF+LPdSQXYLKvu6kZ3kN17DgHYpuT0Z9ktrS2JiNr/AoGBAMBMG/25ioZMVuMFL2D1NqW221NLGMnHtFSATT1o6XGNEd5/PABCei7l2KSSrv93wyXllnk6cVauSn32zmKNWC0i6Ei89wYIUlgF7grRxBWHm0H8hgbss4YHqEf19t8Fu9QW0g48VXWsZaDmoNQotxytWx3rJ5jIuvz8xWz+UkbH",
    alipayPubKeyFile: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhb/KlxYfhRE8KRp92MQM8ZB8NVjoM9LYFOnPIuNtcMZVA8ld7ybDP2FiA+QEE7wLGqMImwl1Y4xzkrTLCjHVC8fdR8ZvzZR2I3ZOrARerI9+RbkCfT+7YLv55+A+WTHEyiB+v7PfXVTT28s0CHNLPXMyQD1u8UVEQEpbMSs8hH3pJF55Li7kc5VvJpV3RVO9TXZTVAA5mSp9FvO3u+47IJDgFVLnqqHh6ETL1nHVpxiAY2LGer+RWpVYD8v+We+VWsrfJP7bO0xr2pwizldepo8YNYPgcIAIwd7KiveypL1pA0xWgSjUHzrkVh1j/nSnvJgKSdydU/VRcaVt/Mt8wwIDAQAB"
  }
  exports.alipayBasicParams = {
    return_url: 'http://127.0.0.1:7001/alipay/alipayReturn', //支付成功返回地址
    notify_url: 'http://127.0.0.1:7001/alipay/alipayNotify' //支付成功异步通知地址
  }


  //微信支付的配置
  exports.weixinPayConfig = {
    mch_id: '1502539541',
    wxappid: "wx7bf3787c783116e4",
    wxpaykey: 'zhongyuantengitying6666666666666'
  }
  exports.weixinpayBasicParams = {

    //注意回调地址必须在  微信商户平台配置
    notify_url: "http://video.apiying.com/weixinpay/weixinpayNotify"
  }


  // 配置全文搜索
  exports.elasticsearch = {
    host: 'localhost:9200',
    apiVersion: '6.6'
  };

  //配置允许跨域
  // https://www.npmjs.com/package/koa2-cors
  exports.cors = {
    origin: 'http://localhost:8080',
    allowMethods: 'GET,PUT,POST,DELETE',
    credentials: true //专门为 cookie 跨域配置的 前端也需配置
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
