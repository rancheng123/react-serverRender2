
var onlineConfig = {
    origin: 'https://a.qianjialicai.com',

    api: 'https://a.qianjialicai.com/',
    img: 'https://a.qianjialicai.com',
    kaifa_bghongbao : 'http://img.bigfanxian.com/'
};

/*
var devConfig = {
    api: 'http://192.168.0.44:8083/',
    img: 'http://192.168.0.44:8083',
    kaifa_bghongbao : 'http://192.168.0.44:8080/'
}*/


//开发环境 外网访问地址
var outVisteLink = "http://uat.qianjialicai.com:3000"

var devConfig = {
    //外网访问
    api: location.origin == outVisteLink ? 'http://220.194.45.194:45386/': 'http://192.168.0.44:8083/',
    img: location.origin == outVisteLink ? 'http://220.194.45.194:45386': 'http://192.168.0.44:8083',
    kaifa_bghongbao : location.origin == outVisteLink ? 'http://103.38.224.178:45391/': 'http://192.168.0.44:8080/'
}





var config = {
    debug: {
        event: /event=true/,
        trace: /trace=true/,
        mobile: /mobile=true/,
        interface: /interface=true/
    },

    //接口地址
    api:  location.origin == onlineConfig.origin ? onlineConfig.api: devConfig.api ,
    //图片地址
    img : location.origin == onlineConfig.origin ? onlineConfig.img: devConfig.img,
    //哔咯红包图片
    kaifa_bghongbao : location.origin == onlineConfig.origin ? onlineConfig.kaifa_bghongbao: devConfig.kaifa_bghongbao

};
window.config = config;
window.isInterface = location.href.match(config.debug.interface);
