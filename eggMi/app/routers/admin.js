'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);

  // 登入页面
  router.get('/admin/login', controller.admin.login.index);
  // 登入
  router.post('/admin/dologin', controller.admin.login.dologin);
  //退出登入
  router.get('/admin/loginOut', controller.admin.login.loginOut);
  //图形验证码
  router.get('/admin/verify', controller.admin.base.verify);
  //统一删除功能
  router.get("/admin/delete", controller.admin.base.delete);
  //改变状态 api接口
  router.get('/admin/changeStatus', controller.admin.base.changeStatus);
  //动态改变数据
  router.get('/admin/editNum', controller.admin.base.editNum);

  //iframe重构
  router.get('/admin', controller.admin.main.index);
  router.get('/admin/welcome', controller.admin.main.welcome);



  //1，权限管理
  router.get("/admin/access", controller.admin.access.index);
  // 权限增加页面
  router.get("/admin/access/add", controller.admin.access.add);
  // 权限增加功能
  router.post("/admin/access/doAdd", controller.admin.access.doAdd);
  // 权限编辑页面
  router.get("/admin/access/edit", controller.admin.access.edit);
  // 权限编辑页面
  router.post("/admin/access/doEdit", controller.admin.access.doEdit);


  //2，管理员管理列表
  router.get("/admin/manager", controller.admin.manager.index);
  // 管理员增加页面
  router.get("/admin/manager/add", controller.admin.manager.add);
  // 管理员增加功能
  router.post("/admin/manager/doAdd", controller.admin.manager.doAdd);
  //管理员编辑页面
  router.get("/admin/manager/edit", controller.admin.manager.edit);
  //管理员编辑功能
  router.post("/admin/manager/doEdit", controller.admin.manager.doEdit);


  //3，角色管理列表
  router.get("/admin/role", controller.admin.role.index);
  //角色增加页面
  router.get("/admin/role/add", controller.admin.role.add);
  //增加角色功能
  router.post("/admin/role/doAdd", controller.admin.role.doAdd);
  //编辑角色页面
  router.get("/admin/role/edit", controller.admin.role.edit);
  //编辑角色功能
  router.post("/admin/role/doEdit", controller.admin.role.doEdit);
  //授权角色页面
  router.get("/admin/role/auth", controller.admin.role.auth);
  //授权角色功能
  router.post("/admin/role/doAuth", controller.admin.role.doAuth);


  //4, 轮播图管理 [上传图片演示] 
  router.get('/admin/upload', controller.admin.upload.index);

  router.get('/admin/upload/add', controller.admin.upload.add);

  router.post('/admin/upload/doAdd', controller.admin.upload.doAdd);

  router.get('/admin/upload/edit', controller.admin.upload.edit);

  router.post('/admin/upload/doEdit', controller.admin.upload.doEdit);


  //商品类型

  router.get('/admin/goodsType', controller.admin.goodsType.index);

  router.get('/admin/goodsType/add', controller.admin.goodsType.add);

  router.post('/admin/goodsType/doAdd', controller.admin.goodsType.doAdd);

  router.get('/admin/goodsType/edit', controller.admin.goodsType.edit);

  router.post('/admin/goodsType/doEdit', controller.admin.goodsType.doEdit);


  //商品类型属性

  router.get('/admin/goodsTypeAttribute', controller.admin.goodsTypeAttribute.index);

  router.get('/admin/goodsTypeAttribute/add', controller.admin.goodsTypeAttribute.add);

  router.post('/admin/goodsTypeAttribute/doAdd', controller.admin.goodsTypeAttribute.doAdd);

  router.get('/admin/goodsTypeAttribute/edit', controller.admin.goodsTypeAttribute.edit);

  router.post('/admin/goodsTypeAttribute/doEdit', controller.admin.goodsTypeAttribute.doEdit);


  //商品分类模块

  router.get('/admin/goodsCate', controller.admin.goodsCate.index);

  router.get('/admin/goodsCate/add', controller.admin.goodsCate.add);

  router.post('/admin/goodsCate/doAdd', controller.admin.goodsCate.doAdd);

  router.get('/admin/goodsCate/edit', controller.admin.goodsCate.edit);

  router.post('/admin/goodsCate/doEdit', controller.admin.goodsCate.doEdit);


  //商品模块
  router.get('/admin/goods', controller.admin.goods.index);

  router.get('/admin/goods/add', controller.admin.goods.add);

  router.post('/admin/goods/doAdd', controller.admin.goods.doAdd);

  router.get('/admin/goods/edit', controller.admin.goods.edit);

  router.post('/admin/goods/doEdit', controller.admin.goods.doEdit);

  router.get('/admin/goods/goodsTypeAttribute', controller.admin.goods.goodsTypeAttribute);

  router.post('/admin/goods/goodsUploadImage', controller.admin.goods.goodsUploadImage);

  router.post('/admin/goods/goodsUploadPhoto', controller.admin.goods.goodsUploadPhoto);

  router.post('/admin/goods/changeGoodsImageColor', controller.admin.goods.changeGoodsImageColor);//图片添加颜色

  router.post('/admin/goods/goodsImageRemove', controller.admin.goods.goodsImageRemove);

  router.get('/admin/goods/goodsDelete', controller.admin.goods.goodsDelete);


  //商品颜色模块
  router.get('/admin/goodsColor', controller.admin.goodsColor.index);

  router.get('/admin/goodsColor/add', controller.admin.goodsColor.add);

  router.post('/admin/goodsColor/doAdd', controller.admin.goodsColor.doAdd);

  router.get('/admin/goodsColor/edit', controller.admin.goodsColor.edit);

  router.post('/admin/goodsColor/doEdit', controller.admin.goodsColor.doEdit);


  //导航模块
  router.get('/admin/nav', controller.admin.nav.index);

  router.get('/admin/nav/add', controller.admin.nav.add);

  router.post('/admin/nav/doAdd', controller.admin.nav.doAdd);

  router.get('/admin/nav/edit', controller.admin.nav.edit);

  router.post('/admin/nav/doEdit', controller.admin.nav.doEdit);


  //文章分类模块
  router.get('/admin/articleCate', controller.admin.articleCate.index);

  router.get('/admin/articleCate/add', controller.admin.articleCate.add);

  router.post('/admin/articleCate/doAdd', controller.admin.articleCate.doAdd);

  router.get('/admin/articleCate/edit', controller.admin.articleCate.edit);

  router.post('/admin/articleCate/doEdit', controller.admin.articleCate.doEdit);


  //文章模块
  router.get('/admin/article', controller.admin.article.index);

  router.get('/admin/article/add', controller.admin.article.add);

  router.post('/admin/article/doAdd', controller.admin.article.doAdd);

  router.get('/admin/article/edit', controller.admin.article.edit);

  router.post('/admin/article/doEdit', controller.admin.article.doEdit);






  // //上传图片演示

  // router.get('/admin/upload', controller.admin.upload.index);

  // router.get('/admin/upload/multi', controller.admin.upload.multi);

  // router.post('/admin/upload/doSingleUpload', controller.admin.upload.doSingleUpload);

  // router.post('/admin/upload/doMultiUpload', controller.admin.upload.doMultiUpload);

};
