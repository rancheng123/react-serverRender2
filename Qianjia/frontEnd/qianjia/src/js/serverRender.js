import React from 'react';
import { renderToString } from 'react-dom/server'
import {match,RouterContext} from 'react-router';
import routes from './routes';



function serverRender(req, res){

    debugger;
    debugger
    match({
        routes: routes,
        location: req.originalUrl
    }, (error, redirectLocation, renderProps) => {

        debugger
        if (error) {
            return res.status(500).send(error.message);
        } else if (redirectLocation) {
            return res.redirect(302, encodeURI(redirectLocation.pathname + redirectLocation.search));
        } else if (renderProps && renderProps.components) {



            debugger;
            debugger;
            var fs = require('fs');
            var path = require('path');

            //创建文件
           /* fs.open('./abcd.js','w',function(error,fd){
                debugger;
                console.log(error);
                console.log(fd)
            })

            因为缘分，工作和生活，我们聚在一起。
            也是因为缘分，工作和生活，我们分道扬镳。

            离开，略有丝丝伤感。
            感谢季总和王总 这段时间的照顾。
            虽然离开，希望我们后期保持联系。
            但愿将来有机会 还能在一起工作。

            致敬
                冉成

            */


            const rootComp = <RouterContext {...renderProps}/>

            //读取文件(异步)
            var data = fs.readFileSync('./frontEnd/qianjia/dist/index.html','utf-8');




            var newData = data//.replace('{{content}}',renderToString(rootComp))
                              .replace('{{keywords}}', renderProps.routes[0].keywords)
                              .replace('{{description}}', renderProps.routes[0].description)
                              .replace('{{title}}', renderProps.routes[0].title)


            return res.status(200).send(newData);

            res.end()


        } else {
            res.status(404).send('Not found');
        }
    });
}


function renderFullPage(renderedContent) {
    return `<!doctype html>
  <html lang="">
    <head>
      <meta http-equiv="content-type" content="text/html;charset=utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
      <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0">
      <meta name="renderer" content="webkit">
      <meta name="force-rendering" content="webkit">
      <title>Up</title>
      
    </head>
    <body>
      <div id="app">${renderedContent}</div>
     
    </body>
  </html>`;
}

module.exports = serverRender;






