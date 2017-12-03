'use strict';

const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    //入口
    entry:{
        'main':'./src/main.js'
    },
    //出口
    output:{
        //资源路径
        path:path.join(__dirname,'dist'),
        //产出的js文件名
        filename:'build.js'
    },
    module:{
        loaders:[
            {
                test:/\.css$/,
                loader:'style-loader!css-loader'
            },
            {
                test:/\.less$/,
                loader:'style-loader!css-loader!less-loader'
            },
            {
                test:/\.(jpg|png|svg|gif|ttf)$/,
                loader:'url-loader',
                options:{
                    //如果文件查过limit，生成新文件，否则base64
                    limit:4096,
                    name:'[name].[ext]',//原文件名
                }
            },
            {
                test:/\.vue$/,
                loader:'vue-loader'
            },
            //es6
            {
                test:/\.js$/,
                exclude:/node_modules/,//路径包含node_modules
                loader:'babel-loader',
                //将配置提取到babel配置文件中，当前目录下
                // options:{   
                //     presets:['env'],
                //     plugins:['transform-runtime']
                // }
            }

        ]
    },
    plugins:[
        new htmlWebpackPlugin({
            template:'./src/index.html'
        })

    ]
}