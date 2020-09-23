
module.exports = app => {
  const { router, controller } = app;


  router.get('/api/index', controller.api.default.index);  

  router.get('/api/productList', controller.api.default.productList);  


  router.post('/api/register', controller.api.default.register);  


  router.put('/api/editUser', controller.api.default.editUser);  


  router.delete('/api/deleteUser', controller.api.default.deleteUser);  

  
  //ajax Session跨域
  router.get('/api/login', controller.api.session.login);  


  router.post('/api/user', controller.api.session.user);  


};
