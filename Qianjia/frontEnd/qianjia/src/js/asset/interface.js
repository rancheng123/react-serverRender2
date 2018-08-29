import Alert from '../module/alert/alert';
import { Modal } from 'antd-mobile';

let tempClickTimer = null;
class Interface{
    constructor(){
    };

    //获取公告列表和 banner列表（轮播图）
    getAd(){
        var that = this;
        Utils.requestData({
            url: config.api +"qj/front/v2/ad/getHeadList",
            method: 'post',
            data: {
                //?????????????
                "adId": 43,
                //?????????????
                "adCity": 0
            },
            callback: function(data){

                if(data.resultCode == 0){

                    if(data.data.imageList && data.data.imageList.length){
                        componentStore.update(that,{
                            imageList: data.data.imageList
                        })
                    }
                    if(data.data.adList && data.data.adList.length){
                        componentStore.update(that,{
                            adList: data.data.adList
                        })
                    }

                }
            }
        });
    }

    isPayAndWithdrawStatus(opt){ //判断是否开户和绑定银行卡\
        let bindBankStr = opt.bindBankStr || "";
        let callback = opt.callback || "";
        let onlyOneClickCallback = opt.onlyOneClickCallback || "";
        let that = this;


        Utils.requestData({ //请求用户信息
            url: config.api + 'qj/front/v2/user/getUserInfo',
            method: 'post',
            data:{

            },
            callback: function(data){
                
                if(data.resultCode==0){
                    var data = data.data;

                    if(data.isHfAccount==0){ //未开户
                        
                        Alert({
                            type:'standard',
                            title:'开通银行存管账户',
                            desc:'钱夹平台资金由陕坝农商银行全程存管，保护您的财产安全',
                            button:[
                                {
                                    text:'下次再说',
                                    handle:()=>{

                                    }
                                },
                                {
                                    text:'立即开通',
                                    handle:()=>{
                                        // Utils.switchRoute('/openBank');
                                        
                                        Utils.requestData({
                                            url: config.api+'qj/front/v2/account/openAccount',
                                            method: 'post',
                                            data:{
                                                "path": '/my'
                                            },
                                            callback: function(data){
                                                if(data.resultCode==0){
                                                   
                                                    // location.href = data.data.url;
                                                    Utils.switchRoute('/shanba?shanbaTitle=开通银行存管账户&backFromShanba=my&goShanbaUrl='+data.data.url);
                                                    
                                                }
                                            },
                                            //错误处理 特殊情况特殊处理
                                            errorAlert: function(data){
                                             
                                                //传递捕捉信号  给捕捉器
                                                this.errorAlert.jail = true;
                                            }
                                        });
                                    }
                                }
                            ]

                        });

                    }else if(data.isHfAccount==1){ //已开户
                        
                        if(data.isBindCard==0){ //未绑定银行卡

                            if(opt.type=="withdraw"){
                              
                                Alert({
                                    type:'standard',
                                    title:'绑定银行卡',
                                    desc:'提现前请先绑定主卡',
                                    button:[
                                        {
                                            text:'下次再说',
                                            handle:()=>{
                                                
                                            }
                                        },
                                        {
                                            text:'立即绑定',
                                            handle:()=>{

                                                Utils.requestData({
                                                    url: config.api+'qj/front/v2/account/bindCard',
                                                    method: 'post',
                                                    data:{
                                                        "appType" : "WAP",
                                                        "cardType" : 0,
                                                        "path" : "/my"
                                                    },
                                                    callback: function(data){
                                                        if(data.resultCode==0){
                                                           
                                                            Utils.switchRoute('/shanba?shanbaTitle=绑定银行卡&backFromShanba=my&goShanbaUrl='+data.data.url);
                                                            
                                                        }
                                                    },
                                                    //错误处理 特殊情况特殊处理
                                                    errorAlert: function(data){
                                                     
                                                        //传递捕捉信号  给捕捉器
                                                        this.errorAlert.jail = true;
                                                    }
                                                });

                                                
                                            }
                                        }
                                    ]
    
                                });
                            }else if(opt.type=="pay"){
                                Alert({
                                    type:'standard',
                                    title:'绑定银行卡',
                                    desc:'充值前请先绑定银行卡',
                                    button:[
                                        {
                                            text:'下次再说',
                                            handle:()=>{
    
                                            }
                                        },
                                        {
                                            text:'立即绑定',
                                            handle:()=>{
                                                Utils.requestData({
                                                    url: config.api+'qj/front/v2/account/bindCard',
                                                    method: 'post',
                                                    data:{
                                                        "appType" : "WAP",
                                                        "cardType" : 0,
                                                        "path" : "/my"
                                                    },
                                                    callback: function(data){
                                                        if(data.resultCode==0){
                                                           
                                                            Utils.switchRoute('/shanba?shanbaTitle=绑定银行卡&backFromShanba=my&goShanbaUrl='+data.data.url);
                                                            
                                                        }
                                                    },
                                                    //错误处理 特殊情况特殊处理
                                                    errorAlert: function(data){
                                                     
                                                        //传递捕捉信号  给捕捉器
                                                        this.errorAlert.jail = true;
                                                    }
                                                });
                                                
                                            }
                                        }
                                    ]
    
                                });
                            }else if(opt.type=="myBank"){
                                Utils.switchRoute('/bankDetail');
                            }else{
                                Alert({
                                    type:'standard',
                                    title:'绑定银行卡',
                                    desc:'请先绑定银行卡',
                                    button:[
                                        {
                                            text:'下次再说',
                                            handle:()=>{
    
                                            }
                                        },
                                        {
                                            text:'立即绑定',
                                            handle:()=>{
                                                Utils.switchRoute('/bankDetail');
                                            }
                                        }
                                    ]
    
                                });
                                
                            }
                           
                        }else if(data.isBindCard==1){ //已绑定银行卡

                            if(data.taxCode==1){  //已结有支付密码
                                callback && callback();
                            }else{
                                Modal.alert('提示','请设置存管账户交易密码', [
                                    { text: '取消',onPress:()=>{}},
                                    { text: '确定',onPress:()=>{
                                       
                                        var typeArr = opt.type.split('?');
                                       
                                        if(opt.type&&typeArr[0]=="projectIntroduction"){
                                            
                                            Utils.requestData({
                                                url: config.api+'qj/front/v2/account/resetPwd',//config.api+'qj/front/v2/account/openAccount',
                                                method: 'post',
                                                data:{
                                                    'path':'/projectIntroduction&'+typeArr[1]
                                                },
                                                callback: function(data){
                                                    if(data.resultCode==0){
                                                       
                                                        Utils.switchRoute('/shanba?shanbaTitle=重置交易密码&backFromShanba=userSecurity&goShanbaUrl='+data.data.url);
                                                    }
                                                },
                                                //错误处理 特殊情况特殊处理
                                                errorAlert: function(data){
                                                }
                                            });


                                        }else{
                                            // Utils.switchRoute('/paymentPasswordList?backUrl=/my');

                                            Utils.requestData({
                                                url: config.api+'qj/front/v2/account/resetPwd',//config.api+'qj/front/v2/account/openAccount',
                                                method: 'post',
                                                data:{
                                                    'path':'/my'
                                                },
                                                callback: function(data){
                                                    if(data.resultCode==0){
                                                       
                                                        Utils.switchRoute('/shanba?shanbaTitle=重置交易密码&backFromShanba=userSecurity&goShanbaUrl='+data.data.url);
                                                    }
                                                },
                                                //错误处理 特殊情况特殊处理
                                                errorAlert: function(data){
                                                }
                                            });
                                        }
                                        

                                    }}
                                ])
                            }
                            
                        }
                        
                    }

                }

                clearTimeout(tempClickTimer);
                tempClickTimer = setTimeout(function(){
                    onlyOneClickCallback && onlyOneClickCallback()
                },300)

            },
            errorAlert : function(data){

                if(data.resultCode!=0){
                    if(data.resultCode==20001){   //用户没有登录
                        Utils.switchRoute("/login");
                    }else{
                        Modal.alert('提示',data.resultMsg, [
                            { text: '确定',onPress:()=>{}}
                        ])
                    }
                }

                clearTimeout(tempClickTimer);
                tempClickTimer = setTimeout(function(){
                    onlyOneClickCallback && onlyOneClickCallback()
                },300)

                this.errorAlert.jail = true;
            }
        });
    }

    
};

window.Utils.Interface = new Interface();
