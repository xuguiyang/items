const express = require('express');
const musicController = require('../controllers/musicController.js');

//音乐相关路由对象
let musicRouter = express.Router();
musicRouter.get('/list-music',musicController.showMuisc)
.get('/add-music',(req,res)=>{// 添加音乐
    res.render('add');
})
.get('/edit-music',musicController.showEditMusic);

module.exports = musicRouter;