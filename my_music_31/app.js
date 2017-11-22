'use strict';
const express = require('express');
//引入body-parser处理请求体数据
const bodyParser = require('body-parser');
//引入session
const session = require('express-session');
//创建服务器
let app = express();
//配置对象
const config = require('./config.js');
//引入路由对象
const userRouter = require('./web_routers/userRourer.js');//相关用户页面
const musicRouter = require('./web_routers/musicRouter.js');//相关音乐页面
const apiRouter = require('./web_routers/apiRouter.js');//相关数据接口
const expressArtTemplate = require('express-art-template');
//设置模板配置
//1:声明.html后缀的由art-template来处理
app.engine('html', expressArtTemplate); //.html后缀我来渲染
app.set('view engine', 'html'); //默认以.html为后缀，使用上面这个引擎
//2:设置express默认查找目录
app.set('views','./tmpls');
//3:设置art-template的options
app.set('view options',{
    debug: process.env.NODE_ENV != 'production',    //true不缓存不压缩，false:  缓存，压缩
    extname:'.html',
    imports:{ //引入变量
      mongoid:function(value){ //过滤器
        return value.toString();
      }
    }
});


//处理post请求 json 或者键值对，将对象挂载到req.body上
// // parse application/x-www-form-urlencoded 处理键值对
app.use(bodyParser.urlencoded({ extended: false }));
// // parse application/json 解析json数据作为请求体数据
app.use(bodyParser.json()); 
//处理静态资源

//处理session,挂载req.session
app.use(session({
  rolling:true,//顺延
  secret: 'itcast',
  resave: false,  //不修改数据不覆盖
  saveUninitialized: true, //一连接就生成cookie
  cookie: { 
    // secure: true  true是https，默认是http
    // 这个钥匙默认过期时间是5分钟，如果你在4:：59秒操作了,时间顺延
    // 如果超过过期时间，钥匙重新生成，由钥匙做key挂载的值就丢失了
    maxAge:config.cookieTime
  }
}));
//在一次请求与响应的过程中，给options中的imports.变量名赋值
app.use((req,res,next)=>{
    // console.log(template.template.defaults);  //模板引擎的默认配置
    // expressArtTemplate.template.defaults.imports.user = req.session.user;
    
    //每一个客户端访问的时候都有一个locals,该变量会在render的时候，根据模板语法自动注入这个对象
    app.locals.user = req.session.user;
    next();//都放行
});


//登录过期驱逐(页面权限控制)
// /music或者/api/包含music
app.use(/\/music|\/api\/.*music/,(req,res,next)=>{  //针对以/music开头的请求处理一下
  // /music/list-music  /music/add-music  /music/edit-music
    if(!req.session.user){
        return res.send(`
            您的登录已经过期
            <a href="/user/login">点我去登录</a>
        `)
    }
    next();//放行
});

// /api/add-music /api/edit-music /api/del-music
// app.use('/api',(req,res,next)=>{  //针对以/music开头的请求处理一下
//   // /music/list-music  /music/add-music  /music/edit-music
//     if(!req.session.user){
//         return res.send(`
//             您的登录已经过期
//             <a href="/user/login">点我去登录</a>
//         `)
//     }
//     next();//放行
// });

//处理静态资源 ./public下的所有资源根据url与目录的结构匹配并返回
app.use('/public',express.static('./public'));

app.use('/user',userRouter);  //根据/user选择性调用这个中间件

app.use('/music',musicRouter);// 在musicRouter中，url不需要/music
//异步数据接口
app.use('/api',apiRouter); // ajax:/api/do-register



//错误处理中间件
app.use((err,req,res,next)=>{
    console.log('出异常了');
    console.log(err);
    res.send(`
            <div style="backgroud-color:yellowgreen;">不好意思，系统出了一点异常....稍等片刻..</div>
        `)
})

//开启监听
app.listen(config.server_port,()=>{
    console.log('服务器启动了,8888');
});