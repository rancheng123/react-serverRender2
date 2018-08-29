

var path = require('path');
var current_path = path.resolve(__dirname);

var express = require('express');
var app = express();
app.set('view engine', 'html');


var rootPath = path.resolve(__dirname,'../frontEnd/qianjia/dist/');
app.use(express.static( rootPath  ));//设置静态文件目录


console.log('start server')
var router = express.Router();
app.use(router);
app.listen(8388, function () {
    console.log('Listening on 8388');
});



var serverRender = require(rootPath + '/serverRender');

router.get('/*', function(req, res){


    debugger

    var route = req.url.split('?')[0];
    //空
    if(route == '/'){

        console.log(serverRender)

        serverRender(req, res)
    }
    //静态资源
    else if(route.match(/\.(js|css|html|gif|jpg|jpeg|png|bmp|ico|txt|swf)/)){


        var clientJS = path.resolve(current_path, '../dist111'+route);
        res.sendFile( clientJS  );
    }
    //接口转发
    else if(route.match(/^\/api\//)){
        request({
            headers: {"Connection": "close"},
            //代理路径
            url: 'http://localhost:3000'+ route,
            method: req.method.toUpperCase(),
            json: true,
            body: req.body
        },function (error, response, data) {
            if (!error && response.statusCode == 200) {
                res.jsonp(data);
            }
        });

    }
    //页面路由
    else{
        serverRender(req, res)
    }


});
