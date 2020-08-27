'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  let initMiddleware = app.middleware.init({},app)
 
  router.get('/',initMiddleware, controller.default.index.index);  

  router.get('/plist',initMiddleware, controller.default.product.list);

  router.get('/pinfo',initMiddleware, controller.default.product.info);

  router.get('/cart',initMiddleware, controller.default.flow.cart);



  //用户中心

  router.get('/login', controller.default.user.login);

  router.get('/register', controller.default.user.register);

  router.get('/user', controller.default.user.welcome);

  router.get('/user/order', controller.default.user.order);
};
