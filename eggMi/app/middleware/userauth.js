

module.exports = (options, app) => {
  return async function init(ctx, next) {

    // 判断前台用户是否登录   如果登录可以进入 （ 去结算  用户中心）    如果没有登录直接跳转到登录
     
    const userinfo = ctx.service.cookies.get('userinfo');

    if (userinfo && userinfo._id && userinfo.phone) {
      // 判断数据库里面有没有当前用户
      const userResutl = await ctx.model.User.find({ _id: userinfo._id, phone: userinfo.phone });

      if (userResutl && userResutl.length > 0) {
        // 注意
        await next();

      } else {
        ctx.redirect('/login');
      }
    } else {

      ctx.redirect('/login');
    }


  };
};
