import React, { Component, PropTypes } from 'react';
import { Router, Route, Link ,hashHistory} from 'react-router';
import _ from 'underscore';
import classNames from 'classnames'

//导入样式 start
import './login.scss'
//导入样式 end



class Login extends Component{
    constructor(){
        super();
    }
    componentWillMount(){

        var state = {
            isPasswordLogin: false,
            phoneNum: '',
            password: '',
            validCode: '',
            msgCode: '',
            uuid: Date.now(),
            gainMsgCode: true
        };

        this.state=state
    }

    componentDidMount(){


    };
    componentWillUnmount(){

    };


    render(){
        var that = this;


        return (
            <div className="login bgWhite">
                this is login

            </div>
        )
    }

}

export default Login;
