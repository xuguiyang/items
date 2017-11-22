'use strict';
//引入第三方对象（程序）
const mongo = require('mongodb');
//从程序中启动一个类似黑窗口的客户端(node中的客户端)
const mongoClient = mongo.MongoClient;
const config = require('./config.js');


//创建url -> mongodb IP 端口 数据库
const url = `mongodb://${config.db_host}:${config.db_port}/${config.db_database}`;

let dbTools = {};

//外部: xxx.insert('users',[{name:'jack'}],function(err,users){ //操作   })
dbTools.insert = function(collectionName,insertArr,callback){
    //插入数据
    mongoClient.connect(url,(err,db) =>{
        // if(err) throw err;
        if(err){
            callback(err,null); //数据库连接异常
            return;
        }
        //核心思想: db有多个，db中有多个集合，集合中有多个文档对象
        //通过bd拿集合对象
        let usersCollection = db.collection(collectionName);

        //通过集合对象操作文档对象
        usersCollection.insertMany(insertArr,(err,result)=>{
                //关闭连接
                db.close();  //即时db关闭了，数据还是存在的
                callback(err,result);//数据查询异常
        });
    });
}


//更新数据
dbTools.update = function(collectionName,filter,modifyObj,callback){
    mongoClient.connect(url,(err,db) =>{
       if(err){
           return callback(err,null);
       }
       let usersCollection = db.collection(collectionName);
       usersCollection.updateMany(filter,{$set:modifyObj  },(err,result)=>{
               //关闭连接
               db.close();
               callback(err,result);
       });
   });
}

// //外部调用find()获取数据,callback(err,数据)
// //查询数据
dbTools.find = function(collectionName,filter,callback){
    mongoClient.connect(url,(err,db) =>{
        if(err) return callback(err,null);
        let usersCollection = db.collection(collectionName);

        usersCollection.find(filter).toArray( (err,docs)=>{
            //关闭连接
            db.close();
            callback(err,docs);
        });
    });
}


// //删除数据
dbTools.remove = function(collectionName,filter,callback){
    mongoClient.connect(url,(err,db) =>{
    if(err) return callback(err,null)

    let usersCollection = db.collection(collectionName);
    usersCollection.deleteMany(filter,(err,result)=>{
        //关闭连接
       db.close();
       callback(err,result)
    });
    });

}

module.exports = dbTools;