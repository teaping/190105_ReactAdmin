import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import { Menu, Icon } from 'antd';
import './index.less'
const { SubMenu } = Menu;

/*左侧导航组件*/
class LeftNav extends Component {

    render() {
        return (
                <div to='/' className="left-nav">
                    <Link to='/' className="left-nav-header">
                        <img src={logo} alt="logo"/>
                        <h1>后台</h1>
                    </Link>

                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                >
                    <Menu.Item key="/home" >
                        <Link to='/home' >
                            <Icon type="pie-chart"/>
                            <span>首页</span>
                        </Link>
                    </Menu.Item>

                    <SubMenu key="sub1"title={<span><Icon type="mail"/> <span>商品</span></span>}>
                        <Menu.Item key="/category">
                            <Link to='/category' >
                                <Icon type="pie-chart"/>品类管理
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/product">
                                <Link to='/product' >
                                    <Icon type="pie-chart"/>商品管理
                                </Link>
                            </Menu.Item>
                    </SubMenu>

                </Menu>
            </div>
        )
    }
}

export default LeftNav;