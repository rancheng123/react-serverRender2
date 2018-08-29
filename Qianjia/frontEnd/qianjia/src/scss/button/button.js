import React, { Component, PropTypes } from 'react';

class Button extends Component{
    constructor(){
        super();
    }
    componentWillMount(){
        /*var style = document.createElement('style')
        style.innerHTML = '[class^="icon-"]{margin: 10px}';
        document.getElementsByTagName('head')[0].appendChild(style);*/
        /*console.log('sssssssss:----'+this.props.click);*/
        this.state={
                btnSt:this.props.initBtnSt,
               lysBtn:this.props.lysBtn
        }
    }
    componentDidMount(){
        // 存储 start
        componentStore.set(this);
        // 存储 end
    };
    componentWillUnmount(){
        // 清除 start
        componentStore.clear(this);
        // 清除 end
    };
    onTouchBtn(){
        this.props.click();
    }
    render(){
       /* var btnSt=this.state.btnSt;*/
        return (
            <div>
                {/*<span className="btn-red">立即投资</span>
                 <span className="btn-red btn-red-2line">
                 13:25:56<br/>
                 后结束
                 </span>*/}
                <div className="buttonBtn" onTouchStart={this.onTouchBtn.bind(this)} style={{background:this.props.bkg,lineHeight:this.props.lineH,height:this.props.height,width:this.props.width,borderRadius:this.props.radius,border:this.props.border,color:this.props.color}}>{this.props.content}</div>
            </div>
        )

    }

}

export default Button;
