const express = require('express');
const userController = require('../controllers/userController.js');
const musicController = require('../controllers/musicController.js');

//数据接口
let router = express.Router();
// 127.0.0.1:8888/api/check-username?username=111dsadsada
router.get('/check-username', userController.checkUsername )
.post('/do-register', userController.doRegister)
.post('/do-login', userController.doLogin)
.post('/add-music',musicController.addMusic)
.get('/logout',userController.doLogout)
.put('/edit-music',musicController.editMusic)
.delete('/del-music',musicController.delMusic)
.get('/get-pic',userController.getPic)
module.exports = router;