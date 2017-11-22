const express = require('express');

let userRouter = express.Router();
//配置user相关的路由，调用后/user被干掉了
userRouter.get('/register',(req,res)=>{ //注册
    res.render('register');
})
.get('/login',(req,res)=>{// 登录
    res.render('login',{
    });
});


module.exports = userRouter;