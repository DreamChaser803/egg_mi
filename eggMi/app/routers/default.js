'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  let initMiddleware = app.middleware.init({}, app)

  router.get('/', initMiddleware, controller.default.index.index);

  router.get('/plist', initMiddleware, controller.default.product.list);

  router.get('/pinfo', initMiddleware, controller.default.product.info);

  router.get('/getImagelist', initMiddleware, controller.default.product.getImagelist);


  //用户中心
  router.get('/login', controller.default.user.login);

  router.get('/register', controller.default.user.register);

  router.get('/user', controller.default.user.welcome);

  router.get('/user/order', controller.default.user.order);


  //购物车
  router.get('/addCart',initMiddleware, controller.default.cart.addCart);

  router.get('/cart',initMiddleware, controller.default.cart.cartList);

  router.get('/addCartSuccess', initMiddleware,controller.default.cart.addCartSuccess);

  router.get('/incCart', initMiddleware,controller.default.cart.incCart);
  
  router.get('/decCart', initMiddleware,controller.default.cart.decCart);
  
  router.get('/changeOneCart', initMiddleware,controller.default.cart.changeOneCart);

  router.get('/changeAllCart', initMiddleware,controller.default.cart.changeAllCart);

  router.get('/removeCart', initMiddleware,controller.default.cart.removeCart);

};
