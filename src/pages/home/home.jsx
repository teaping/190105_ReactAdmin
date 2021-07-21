import React, {Component} from 'react';
import './home.less'
import {
    NavLink
} from "react-router-dom";

// 首页路由
class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="home">
                欢迎使用后台管理系统
            </div>
        )
    }
}

export default Home;