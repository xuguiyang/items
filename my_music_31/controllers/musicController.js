'use strict';
const formidable = require('formidable');
const path = require('path');
const config = require('../config.js');
const db = require('../db.js');
const ObjectID = require('mongodb').ObjectID;
exports.addMusic = (req,res,next)=>{
    //3:去了干嘛，接收数据
    let form = new formidable.IncomingForm();
 
    //配置上传路径的./基于app.js目录
    // form.uploadDir = path.resolve('./public/files');

    //基于app.js也就是项目的根目录
    // console.log(path.resolve('../public/files'));
    

    //配置文件中存储项目根绝对路径，好理解好维护
    form.uploadDir = config.root_path + '/public/files';

    form.parse(req, function(err, fields, files) {
      console.log(fields);//文字数据{ title: 'abc', singer: 'def' }
      let insertSong = {
        title:fields.title,
        singer:fields.singer,
        time:fields.time
      }
      // console.log(files); //获取各个文件的路径
      //使用path核心对象解析路径，获取路径中的base属性(name + ext)
      // let filePath = files.file.path;
      // let filename = path.parse(filePath).base;
      // //upload_c38018a51a0ce4eb12c83a254fa82f35
      // // console.log(filename);
      // //留给前端发请求的网络URL路径
      // let fileUrl = '/public/files/' + filename;

      // let filelrcPath = files.filelrc.path;
      // let filelrcname = path.parse(filelrcPath).base;
      // //留给前端发请求的网络URL路径
      // let filelrcUrl = '/public/files/' + filelrcname;


        if(files.file){
          let filePath = files.file.path;
          let filename = path.parse(filePath).base;
          let fileUrl = '/public/files/' + filename;
          insertSong.file = fileUrl;
        }
      //判断是否选择了歌词
        if(files.filelrc){
          let filelrcPath = files.filelrc.path;
          let filelrcname = path.parse(filelrcPath).base;
          let filelrcUrl = '/public/files/' + filelrcname;
          insertSong.filelrc = filelrcUrl;
        }




      // 获取登录用户的id
      // console.log(req.session.user);
      let uid = req.session.user._id;
      // console.log(typeof req.session.user._id);//类型是字符串
      
        insertSong.uid = uid;

   


    //保存数据
        db.insert('musics',[insertSong],(err,result)=>{
            if(err) return next(err);

            if(result.insertedCount == 1){
                //插入成功
                res.json({
                    code:'001',msg:'添加歌曲成功'
                })
            }else{
                //歌曲已经存在
                res.json({
                    code:'002',msg:'歌曲已经存在'
                })
            }
        })



    });
}

exports.showMuisc = (req,res,next)=>{// 列表
  //1:获取session中的登录id
    let uid = req.session.user._id;
    console.log(typeof uid);
    //查询数据
    db.find('musics',{uid:uid},(err,musics)=>{
      if(err) return next(err);
      console.log(musics);
        res.render('index',{
          musics:musics
      });
    });
}
exports.editMusic = (req,res,next)=>{ //编辑
  //3:去了干嘛，接收数据
    let form = new formidable.IncomingForm();
    form.uploadDir = config.root_path + '/public/files';

    form.parse(req, function(err, fields, files) {

      let updateSong = {
        title:fields.title,
        singer:fields.singer,
        time:fields.time
      }

      //判断是否选择了上传歌曲
      if(files.file){
        let filePath = files.file.path;
        let filename = path.parse(filePath).base;
        let fileUrl = '/public/files/' + filename;
        updateSong.file = fileUrl;
      }
      //判断是否选择了歌词
      if(files.filelrc){
        let filelrcPath = files.filelrc.path;
        let filelrcname = path.parse(filelrcPath).base;
        let filelrcUrl = '/public/files/' + filelrcname;
        updateSong.filelrc = filelrcUrl;
      }

      //获取歌曲id
      let _id = ObjectID(fields._id);
      //查找指定id
      // db.find('musics',{_id},(err,musics)=>{
      //   if(err) return next(err);
      //   console.log(musics);
      // });
      //更新数据
      db.update('musics',{_id},updateSong,(err,result)=>{
        if(err) return next(err);
        if(result.modifiedCount == 1){
          //更新成功
          res.json({
            code:'001',msg:'更新成功'
          })
        }else{
          //如果更新的原值与新值一模一样,modifiedCount = 0
          res.json({
            code:'002',msg:'更新失败'
          })
        }
      })

    });
}
exports.delMusic = (req,res,next)=>{
  //获取下划线id
  let _id = ObjectID(req.query._id); //   /del-music?_id=xxxx
  //删除数据
  db.remove('musics',{_id},(err,result)=>{
    if(err) return next(err);
    if(result.deletedCount == 1){
      //删除成功
      res.json({
        code:'001',
        msg:'删除成功'
      })
    }else{
      //没有删除到数据
      res.json({
        code:'002',
        msg:'歌曲不存在'
      })
    }
  });
}
exports.showEditMusic = (req,res,next)=>{
  //获取查询字符串
  let _id = ObjectID(req.query._id);
  //查询
  db.find('musics',{_id},(err,musics)=>{
     //默认认为就是一个
     let music = musics[0];
     res.render('edit',{
      music
     })
  });

}