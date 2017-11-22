'use strict';
const express = require('express');
//创建服务器
let app = express();
//创建路由对象
// let router = express.Router();
//引入db对象
let dbTools = require('./db.js');
//获取ID生成器
const ObjectID = require('mongodb').ObjectID;

const userRouter = require('./web_routers/userRourer.js');
const musicRouter = require('./web_routers/musicRouter.js');

//设置模板配置
//1:声明.html后缀的由art-template来处理
app.engine('html',require('express-art-template') ); //.html后缀我来渲染
app.set('view engine', 'html'); //默认以.html为后缀，使用上面这个引擎
//2:设置express默认查找目录
app.set('views','./tmpls');
//2.5设置express 在./tmpls目录下查找的后缀名
// app.set('ext','.html');
//3:设置art-template的options
app.set('view options',{
    debug: process.env.NODE_ENV != 'production',    //true不缓存不压缩，false:  缓存，压缩
    extname:'.html'
});
//测试
// router.get('/test',(req,res)=>{
//     //通过dbTools查找出指定的users集合中的数据
//     //_id:ObjectID("597ea36b52917a1b144b8ce1")  
//     //查询数据
//     dbTools.find('users',{_id:ObjectID('591433ca316e8ebd93caf9c1')},(err,users)=>{
//         if(err) return next(err);
//         //数据肯定唯一
//         let user = users[0];
//          res.render('test',{
//             test:user.name
//         });
//     }); 
// });


//处理静态资源
//URL-> /public/vender/bootstrap/dist/css/bootstrap.css
app.use('/public',express.static('./public'));

app.use('/user',userRouter);  //根据/user选择性调用这个中间件

app.use('/music',musicRouter);

//将路由加入到中间件队列中
// app.use(router);


//错误处理中间件
app.use((err,req,res,next)=>{
    console.log('出异常了');
    res.send(`
            <div style="backgroud-color:yellowgreen;">不好意思，系统出了一点异常....稍等片刻..</div>
        `)
})

//路由规则 开始
// router.get('/user/register',(req,res)=>{ //注册
//     res.render('register');
// })
// .get('/user/login',(req,res)=>{// 登录
//     res.render('login');
// })

// .get('/music/list-music',(req,res)=>{// 列表
//     res.render('index');
// })
// .get('/music/add-music',(req,res)=>{// 添加音乐
//     res.render('add');
// })
// .get('/music/edit-music',(req,res)=>{// 编辑音乐
//     res.render('edit');
// })
//路由规则 结束



//开启监听
app.listen(8888,()=>{
    console.log('服务器启动了,8888');
});