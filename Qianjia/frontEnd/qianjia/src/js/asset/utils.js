/*
*   2017.4.13 唐丹
*       新增 : 处理状态码判断
*       使用方法 ：
                 error: {
                     '502' : function () {
                        Toast.info('连接服务器失败', 2);
                     },
                     '404' : function () {
                        Toast.info('页面不存在', 2);
                     }
                 }

* */

import 'babel-polyfill';

/* eruda start*/
var isUseEruda = location.href.match(config.debug.mobile);
if( isUseEruda ){
    const eruda = require('eruda');
    var el = document.createElement('div');
    document.body.appendChild(el);
    eruda.init({
        container: el,
        tool: ['console', 'elements']
    });
}
/* eruda end*/

import { Modal } from 'antd-mobile';
import promise from 'es6-promise';
promise.polyfill();

import fetch from 'isomorphic-fetch';
import { browserHistory} from 'react-router';
import _ from 'underscore';

class Utils{
    constructor(){
        this.momery = {
            from: {},
            to: {}
        }
    }

    requestData(opts){
        var that = this;
        var url = opts.url || null;
        var method = opts.method || 'post';
        var data = opts.data || {};
        var callback = opts.callback;
        var error = opts.error;
        var qpToken = opts.qpToken || that.Storage.get('user').token;

        if(method.toLowerCase() == 'get'){
            var arr = [];
            for(var key in data){
                var subStr = (key + '=' + data[key])
                arr.push(subStr)
            }

            var req = new Request(url+ '?' + arr.join('&'), {
                method: method,
                //不缓存响应的结果
                cache: 'reload'
            });
        }
        else if(method.toLowerCase() == 'post'){
            var req = new Request(url, {
                method: method,
                //不缓存响应的结果
                cache: 'reload',
                body: JSON.stringify(data),
                headers: { // headers: fetch事实标准中可以通过Header相关api进行设置
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    "qpToken": qpToken
                }
            });
        }

        fetch(req)
            .then(response => {
                // 处理状态码
                let status = response.status;
                switch (status){
                    case 502:
                        error[502]();
                        break;
                    case 404:
                        error[404]();
                        break;
                    default:
                        return response.json(); //此处必须有返回值，否则数据返回
                        break;
                }
            })
            .then(data => {

                if (!data)return false;
                if(data.resultCode == 0){
                    callback && callback(data);

                    //自定义错误捕捉器
                    // if(opts.errorAlert){

                    //     //默认未捕捉到
                    //     opts.errorAlert.jail = false;

                    //     opts.errorAlert(data);

                    //      捕捉到，中断 默认错误
                    //     //未捕捉到，执行 默认错误
                    //     if(opts.errorAlert.jail /*捕捉信号*/){
                    //         return;
                    //     }

                    // }
                }
                //报错处理
                else{





                    //自定义错误捕捉器
                    if(opts.errorAlert){

                        //默认未捕捉到
                        opts.errorAlert.jail = false;

                        opts.errorAlert(data);

                        //  捕捉到，中断 默认错误
                        //未捕捉到，执行 默认错误
                        if(opts.errorAlert.jail /*捕捉信号*/){
                            return;
                        }

                    }


                     if(data.resultCode == '20001'){
                        return;
                     }


                    //默认错误提示
                    Modal.alert('提示',data.resultMsg, [
                        { text: '取消', onPress: () => {} },
                        { text: '确定', onPress: () => {}, style: { fontWeight: 'bold' } },
                    ])
                }



            })
    };


    requestData2(opts){
        var that = this;

        return Promise.all(opts.requestArr.map(requestObj =>{

            var url = requestObj.url || null;
            var method = requestObj.method || 'post';
            var data = requestObj.data || {};
            var callback = requestObj.callback;
            var error = requestObj.error;
            var qpToken = opts.qpToken || that.Storage.get('user').token;


            if(method.toLowerCase() == 'get'){
                var arr = [];
                for(var key in data){
                    var subStr = (key + '=' + data[key])
                    arr.push(subStr)
                }

                var req = new Request(url+ '?' + arr.join('&'), {
                    method: method,
                    //不缓存响应的结果
                    cache: 'reload'
                });
            }
            else if(method.toLowerCase() == 'post'){
                var req = new Request(url, {
                    method: method,
                    //不缓存响应的结果
                    cache: 'reload',
                    body: JSON.stringify(data),
                    headers: { // headers: fetch事实标准中可以通过Header相关api进行设置
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        "qpToken": qpToken
                    }
                });
            }


            return  fetch(req)
                .then(response => {

                    // 处理状态码
                    let status = response.status;
                    switch (status){
                        case 502:
                            error[502]();
                            break;
                        case 404:
                            error[404]();
                            break;
                        default:
                            return response.json(); //此处必须有返回值，否则数据返回
                            break;
                    }
                })

        })).then(function (dataArr) {

            if(dataArr && dataArr.length){

                var isSuccess=true;

                for(var dataObj of dataArr){
                    var data = dataObj;

                    if(data.resultCode != 0){
                        //自定义错误捕捉器
                        if(opts.errorAlert){
                            //默认未捕捉到
                            opts.errorAlert.jail = false;

                            opts.errorAlert(dataArr);

                            //  捕捉到，中断 默认错误
                            //未捕捉到，执行 默认错误
                            if(opts.errorAlert.jail /*捕捉信号*/){
                                return;
                            }

                        }

                        if(data.resultCode != '20001'){
                            //默认错误提示
                            Modal.alert('提示',data.resultMsg, [
                                { text: '取消', onPress: () => {} },
                                { text: '确定', onPress: () => {}, style: { fontWeight: 'bold' } },
                            ]);
                        }



                        isSuccess=false;
                        break;
                    }
                }

            }

            //报错抛出异常 并return
            if(!isSuccess) return false;
            //全部接口成功之后的回调
            opts.callback && opts.callback(dataArr);

        })

    };

    //保留几位小数（不四舍五入）
    getFloatNum(num,reserveNum){
        var a = 1;
        for(var i=0;i<reserveNum;i++){
            a*=10
        }

        //return  (Math.floor(num * a) / a).toFixed(2)
        return  num.toFixed(2)
    }

    tokenExpireJumpToLogin(callback,url){
        var that = this;
        that.requestData({
            url: config.api +"qj/front/v2/account/queryAccountBalance",
            method: 'post',
            data: {},
            callback: function(data){
                callback && callback();
            },
            errorAlert:function(data){
                //用户登录失败(token失效引起)，调至登录页面
                if(data.resultCode == '20001'){

                    if(url){
                        //首页 详情页 投资业
                        that.switchRoute(url);
                    }else{
                        //首页 详情页 投资业
                        that.switchRoute('/login');
                    }



                    //传递捕捉信号  给捕捉器
                    this.errorAlert.jail = true;
                }
            }
        });



    }


    deepCopy(source) {
        var result={};
        for (var key in source) {
            result[key] = typeof source[key]==='object'? this.deepCopy(source[key]): source[key];
        }
        return result;
    }

    //切换路由
    switchRoute(routeStr){
        var that = this;


        switch (arguments.length){
            case 1:
                var routeStr = arguments[0];
                break;
            case 2:
                var arr = [];
                for(var name in arguments[1]){
                    arr.push(name+'='+arguments[1][name])
                }
                var routeStr = arguments[0] + '?' + arr.join('&');
                break;

        }

        that.momery.from = {
            path: location.pathname,
            params: that.Url.parseUrl(location.href).params
        }


        //定时器 等待软键盘落下
        setTimeout(function () {

            if(that.Url.parseUrl(location.href).params.isWap){
                location.href=routeStr;
            }else{
                browserHistory.push(routeStr);
            }



            that.momery.to = {
                path: location.pathname,
                params: that.Url.parseUrl(location.href).params
            };
        },500)

    }

    //返回路由
    backRoute(){
        var that = this;

        that.momery.from = {
            path: location.pathname,
            params: that.Url.parseUrl(location.href).params
        };

        //页面无刷新切换路由
        let scrollTop = browserHistory.getCurrentLocation().query.scrollTop;
        if(scrollTop){
            setTimeout(function () { //定时器是为了解决进入页面直接调用window.scrollTo不执行
                window.scrollTo(0,scrollTop);
            },30)
        }
        browserHistory.goBack();

        var timer1 = setTimeout(function () {
            that.momery.to = {
                path: location.pathname,
                params: that.Url.parseUrl(location.href).params
            };
            clearTimeout(timer1);
        },100)

    }

    eventHanlder(callback){

        //跟踪组件更新
        var isDebug = location.href.match(config.debug.event);
        if(isDebug){
            debugger;
        }

        callback && callback()


    }

    //阻止移动端浏览器自带默认行为->页面整体上拉下拉
    preventPull(container, selectorScrollable){
        /*
        * container : 最外层元素
        * selectorScrollable : 滚动区域元素
        * */
        // 如果没有滚动容器选择器，或者已经绑定了滚动时间，忽略
        if (!selectorScrollable || container.getAttribute('isBindScroll')) {
            return;
        }

        // 是否是搓浏览器
        // 自己在这里添加判断和筛选
        let isSBBrowser;

        let data = {
            posY: 0,
            maxscroll: 0
        };
        let checkHasParent = function (elTarget,targetParent){  //检测父级

            if(elTarget==targetParent){
                return true;
            }
            let el = elTarget;
            while (el.parentNode){
                if(el.parentNode == targetParent){
                    el = targetParent;
                    return true;
                }else{
                    el = el.parentNode;
                }
            }
            return false;
        }
        // 事件处理
        container.addEventListener('touchstart',function (event) {

            let events = event.touches[0] || event;

            // 先求得是不是滚动元素或者滚动元素的子元素
            let elTarget = event.target;

            let elScroll;

            // 获取标记的滚动元素，自身或子元素皆可
            if ( checkHasParent(elTarget,selectorScrollable) ){
                elScroll = selectorScrollable;
            }else{
                elScroll = null;
            }

            if (!elScroll) {
                return;
            }

            // 当前滚动元素标记
            data.elScroll = elScroll;

            // 垂直位置标记
            data.posY = events.pageY;
            data.scrollY = elScroll.scrollTop;
            // 是否可以滚动
            data.maxscroll = elScroll.scrollHeight - elScroll.clientHeight;
        })
        container.addEventListener('touchmove',function (event) {
            // 如果不足于滚动，则禁止触发整个窗体元素的滚动
            if (data.maxscroll <= 0 || isSBBrowser) {
                // 禁止滚动
                event.preventDefault();
            }
            // 滚动元素

            let elScroll = data.elScroll;
            // 当前的滚动高度
            let scrollTop = elScroll.scrollTop;

            // 现在移动的垂直位置，用来判断是往上移动还是往下
            let events = event.touches[0] || event;
            // 移动距离
            let distanceY = events.pageY - data.posY;

            if (isSBBrowser) {
                elScroll.scrollTop(data.scrollY - distanceY);
                elScroll.trigger('scroll');
                return;
            }

            // 上下边缘检测
            if (distanceY > 0 && scrollTop == 0) {
                // 往上滑，并且到头
                // 禁止滚动的默认行为
                event.preventDefault();
                return;
            }

            // 下边缘检测
            if (distanceY < 0 && (scrollTop + 1 >= data.maxscroll)) {
                // 往下滑，并且到头
                // 禁止滚动的默认行为
                event.preventDefault();
                return;
            }
        });
        container.addEventListener('touchend',function (event) {
            data.maxscroll = 0;
        });

        // 防止多次重复绑定
        container.setAttribute('isBindScroll', true);
    }

    hasClass(obj,sClass){   //判断是否包含class

        var aClass = obj.className.split(' ');

        if(!aClass[0])return false;

        for(var i=0; i<aClass.length; i++){
            if(aClass[i]==sClass){
                return true;
            }
        }

        return false;
    }

    removeClass(obj,sClass){     //删除lass


        var aClass = obj.className.split(' ');

        if(!aClass[0])return;

        for(var i=0; i<aClass.length; i++){
            if(aClass[i]==sClass){
                aClass.splice(i,1);
                obj.className = aClass.join(' ');
                return;
            }
        }

    }

    addClass(obj,sClass){     //添加class

        var aClass = obj.className.split(' ');
        if(!aClass[0]){
            obj.className = sClass;
            return;
        }

        for(var i=0; i<aClass.length; i++){
            if(aClass[i]==sClass)return;
        }


        obj.className += ' ' + sClass;

    }
    /**
     * 减法运算，避免数据相减小数点后产生多位数和计算精度损失。
     *
     * @param num1被减数  |  num2减数
     */
    numSubtraction(num1, num2) {
        var baseNum, baseNum1, baseNum2;
        var precision;// 精度
        try {
            baseNum1 = num1.toString().split(".")[1].length;
        } catch (e) {
            baseNum1 = 0;
        }
        try {
            baseNum2 = num2.toString().split(".")[1].length;
        } catch (e) {
            baseNum2 = 0;
        }
        baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
        precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
        return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
    }
    /* luhn银行卡合法算法 */
    luhmCheck(bankno){  
        var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhm进行比较）  
       
        var first15Num=bankno.substr(0,bankno.length-1);//前15或18位  
        var newArr=new Array();  
        for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组  
            newArr.push(first15Num.substr(i,1));  
        }  
        var arrJiShu=new Array();  //奇数位*2的积 <9  
        var arrJiShu2=new Array(); //奇数位*2的积 >9  
           
        var arrOuShu=new Array();  //偶数位数组  
        for(var j=0;j<newArr.length;j++){  
            if((j+1)%2==1){//奇数位  
                if(parseInt(newArr[j])*2<9)  
                arrJiShu.push(parseInt(newArr[j])*2);  
                else  
                arrJiShu2.push(parseInt(newArr[j])*2);  
            }  
            else //偶数位  
            arrOuShu.push(newArr[j]);  
        }  
           
        var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数  
        var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数  
        for(var h=0;h<arrJiShu2.length;h++){  
            jishu_child1.push(parseInt(arrJiShu2[h])%10);  
            jishu_child2.push(parseInt(arrJiShu2[h])/10);  
        }          
           
        var sumJiShu=0; //奇数位*2 < 9 的数组之和  
        var sumOuShu=0; //偶数位数组之和  
        var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和  
        var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和  
        var sumTotal=0;  
        for(var m=0;m<arrJiShu.length;m++){  
            sumJiShu=sumJiShu+parseInt(arrJiShu[m]);  
        }  
           
        for(var n=0;n<arrOuShu.length;n++){  
            sumOuShu=sumOuShu+parseInt(arrOuShu[n]);  
        }  
           
        for(var p=0;p<jishu_child1.length;p++){  
            sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);  
            sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);  
        }        
        //计算总和  
        sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);  
           
        //计算Luhm值  
        var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;          
        var luhm= 10-k;  
        //最终判断
        if(lastNum==luhm && lastNum.length != 0){  
            //Luhm验证通过
               return true;  
        }else{  
           //银行卡号必须符合Luhm校验  
           return false;  
        }          
    }
    
    isWap(){
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = false;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = true;
                break;
            }
        }
        
        return flag;
    }
    isIOS(){
        var userAgentInfo = navigator.userAgent;
        var Agents = ["iPhone","iPad", "iPod"];
        var flag = false;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = true;
                break;
            }
        }
        
        return flag;
    }

    isNumberPos(val) {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        // var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if(regPos.test(val)) {
            return true;
        } else {
            return false;
        }
    }
};
window.Utils = new Utils();

class Url{
    constructor(){

    };

    parseUrl(url){
        var a = document.createElement('a');
        a.href = url;
        return {
            host: a.hostname,
            query: a.search,
            params: (function () {
                var ret = {},
                    seg = a.search.replace(/^\?/, '').split('&'),
                    len = seg.length,
                    i = 0,
                    s;
                for (; i < len; i++) {
                    if (!seg[i]) {
                        continue;
                    }
                    s = seg[i].split('=');
                    //ret[s[0]] = s[1];
                    ret[s[0]] = decodeURIComponent(s[1]);


                }
                return ret;
            })(),
            hash: a.hash.replace('#', '')
        };
    }
}
window.Utils.Url = new Url();

class Storage {
    constructor(){
    };

    set(name,data){

        if(!this.isLocalStorageNameSupported()){
            alert('您的浏览器处于无痕浏览模式，此模式不支持本地存储，请关闭此模式，否则会影响您的正常使用');
            return false;
        };


        if(data.expire_custom){
            data.expireTime = Date.now() + data.expire_custom;
        }


        localStorage.setItem(name,JSON.stringify(data));
    }

    get(name){
        if(localStorage[name]){

            //若过期
            if(this.isExpire(name)){
                return '';
            }else{
                return JSON.parse(localStorage[name])
            }


        }else{
            return '';
        }
    }

    isExpire(name){
        var res = false;
        var obj = JSON.parse(localStorage[name]);


        if(obj.expire_custom){
            var nowTime = Date.now();
            if(nowTime>= obj.expireTime){
                localStorage[name] = null;
                delete localStorage[name];
                res = true;
            }
        }

        return res
    }

    isLocalStorageNameSupported(){
        var testKey = 'test', storage = window.localStorage;
        try {
            storage.setItem(testKey, '1');
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

}
window.Utils.Storage = new Storage()
window._ = _
