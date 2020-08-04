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



  // //上传图片演示

  // router.get('/admin/upload', controller.admin.upload.index);

  // router.get('/admin/upload/multi', controller.admin.upload.multi);

  // router.post('/admin/upload/doSingleUpload', controller.admin.upload.doSingleUpload);

  // router.post('/admin/upload/doMultiUpload', controller.admin.upload.doMultiUpload);

};
