const express = require('express');
const db = require('../db.js');
//数据接口
let router = express.Router();
router.get('/check-username', (req, res, next) => {
        //获取查询字符串中的username参数
        let username = req.query.username;
        //查询数据
        db.find('users', { username }, (err, users) => {
            if (err) return next(err);

            //判断数组长度是否为0
            if (users.length == 0) {
                //可以注册
                res.json({
                    code: '001',
                    msg: '可以注册！'
                });
            } else {
                //用户名存在
                res.json({
                    code: '002',
                    msg: '用户名已经存在！'
                });
            }
        });
    })
    .post('/do-register', (req, res, next) => { // 处理注册
        //接收请求体数据
        let userData = req.body;
        //通过用户名查询该用户是否存在
        let username = userData.username;
        //查询
        db.find('users', { username }, (err, users) => {
            if (err) return next(err);


            //如果length！= 0 说明,用户存在，直接提示
            if (users.length != 0) {
                return res.json({
                    code: '002',
                    msg: '用户名已经存在！'
                });
            }

            //如果length== 0 说明，用户不存在，插入数据
            db.insert('users', [{ username: userData.username, email: userData.email, password: userData.password }], (err, result) => {
                if (err) return next(err);
                if (result.insertedCount == 0) {
                    return res.json({
                        code: '003',
                        msg: '该用户数据已经存在！'
                    });
                }

                //插入数据成功
                res.json({
                    code: '001',
                    msg: '恭喜,注册成功!'
                })




            });



        });
    })
    .post('/do-login', (req, res, next) => { //登录
        //1:获取请求体数据
        let userData = req.body;
        //2:按照密码和用户名做并且条件的查询
        db.find('users', { username: userData.username, password: userData.password },(err,users) =>{
            if(err) return next(err);
            //判断是否查到用户
            if(users.length == 0){
                //用户名或者密码不正确
                return res.json({
                    code:'002',msg:'用户名或者密码不正确'
                })
            }

            //记住用户已经登录
            req.session.user = users[0];


            //登录成功
            res.json({
                code:'001',
                msg:'登录成功'
            });



        })
    })

module.exports = router;