import React, { Component, PropTypes } from 'react';

class Icon extends Component{
    constructor(){
        super();
    }
    componentWillMount(){
        var style = document.createElement('style')
        style.innerHTML = '[class^="icon-"]{margin: 10px}';
        document.getElementsByTagName('head')[0].appendChild(style);
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

    render(){

        return (
            <div>
                <span className="icon-clock"></span>
                <span className="icon-speaker"></span>
            </div>
        )
    }

}

export default Icon;
