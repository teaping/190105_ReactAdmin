import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import { Menu, Icon } from 'antd';
import menuList from '../../config/menuConfig'
import './index.less'
const { SubMenu } = Menu;

/*左侧导航组件*/
class LeftNav extends Component {

    // 根据menu的数据生成对应的标签
    // 使用map 加递归
    getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            if (!item.children){
                return (
                    <Menu.Item key={item.key} >
                        <Link to={item.key} >
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                return (

                    <SubMenu key={item.key}title={<span><Icon type={item.icon}/> <span>{item.title}</span></span>}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }


    // 使用reduce 加递归
    getMenuNodes = (menuList) => {

        // 得到当前请求的路由路劲
        const path = this.props.location.pathname

        return menuList.reduce((pre, item)=>{
            // 向pre添加 submenu /menu.item
            if (!item.children) {
                pre.push((
                    <Menu.Item key={item.key} >
                        <Link to={item.key} >
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            } else {
                // 查找一个与当前路径匹配的子item
                const cItem = item.children.find(cItem=> cItem.key=== path)
                if (cItem) this.openKey = item.key
                pre.push((
                    <SubMenu key={item.key}title={<span><Icon type={item.icon}/> <span>{item.title}</span></span>}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                ))
            }
            return pre
        }, [])
    }
    // 在第一次render之前执行
    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }


    render() {
        // 得到当前请求的路由路劲
        const path = this.props.location.pathname
        // 得到需要打开菜单的key
        const openKey = this.openKey
        return (
                <div to='/' className="left-nav">
                    <Link to='/' className="left-nav-header">
                        <img src={logo} alt="logo"/>
                        <h1>后台</h1>
                    </Link>

                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {this.menuNodes}
                </Menu>
            </div>
        )
    }
}

// 高阶组件 包装一个非路由组件 返回一个新的组件
// 新的组件向非路由组件传递3个属性 history/location/match

export default  withRouter(LeftNav);