

//使用node内置模块截取url

const url = require("url")


module.exports = (options,app)=>{
    
    //登入鉴权
    return async (ctx,next)=>{
        /*
           1, 用户没有登入跳转到登入页面
           2, 只有登入才能访问后台管理系统
        */

        // 设置全局变量
        ctx.state.csrf = ctx.csrf //post请求csrf验证
        ctx.state.prevPage =ctx.request.headers['referer'];   //上一页的地址

        //截取url
        let pathname = await url.parse(ctx.url).pathname;

        if(ctx.session.userInfo){
            // 设置全局变量
            ctx.state.userInfo = ctx.session.userInfo
            await next();
        }else{

            //排除不需要做权限判断的页面避免死循环   url内置模块截取路由 /admin/verify?mt=0.7466881301614958
            if(pathname == "/admin/login" || pathname == "/admin/dologin" || pathname == "/admin/verify"){
                await next();
            }else{
                ctx.redirect("/admin/login")
            }
        }
    }
}