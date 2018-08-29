import React, { Component, PropTypes } from 'react';
import { browserHistory} from 'react-router';

//导入样式 start
import './home.scss'


class Home extends Component{
    constructor(){
        super();
    }
    componentWillMount(){


        //在此处初始化状态
        this.state={
            //轮播列表
            imageList: [],
            adList: [],
            viewList: {
                data: [],
                isListen: false,
                loading: false,
                currentPageNum: 1
            },
            //是否有加息特权，默认无
            AddYieldObj: {
                isAlertShow: false,
                data: null
            },
            //测一测弹窗
            isTestShow: false,
            downLoadShow: true,
            downUrl:'',

            //体验金余额
            experienceGoldAmout : -1,
            //是否显示抽奖入口
            wheelSwitch : 0   // 0关闭 1开启
        }
    }

    componentDidMount(){

        console.log('componentDidMount')

    };
    componentWillUnmount(){
        console.log('componentWillUnmount')
    };


    render(){
        var that = this;

        return (
            <div className="homeModule" onClick={()=>{
                browserHistory.push('/login');
            }}>


                this is home22

            </div>
        )
    }

}

export default Home;
