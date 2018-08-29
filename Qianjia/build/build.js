const async =  require('async') ;
const webpack = require("webpack");
const child_process = require('child_process');



var clientConfig = require('./webpack.config');
var serverConfig = require('./webpack.config.serverRender')



console.log(' webpack --编译client开始')
webpack(clientConfig).run((err, stats) => {
    if (err) {
        console.error(err.stack || err);
        if (err.details) {
            console.error(err.details);
        }
        return;
    }
    console.log(stats.toString({
        // ...
        // Add console colors
        chunks: false,
        colors: true
    }))
    console.log(' webpack --编译client结束')


    console.log(' webpack --编译 server 开始')
    webpack(serverConfig).run((err, stats) => {
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            return;
        }
        console.log(stats.toString({
            // ...
            // Add console colors
            chunks: false,
            colors: true
        }))
        console.log(' webpack --编译 server 结束')



        var workerProcess = child_process.exec(
            'node ./server/server.js',
            function (error, stdout, stderr) {
                if (error) {
                    console.log(error.stack);
                    console.log('Error code: '+error.code);
                    console.log('Signal received: '+error.signal);
                }
                //输出执行结果
                console.log(stdout);
                //输出执行错误
                console.log(stderr);
            }
        );





    });


});


