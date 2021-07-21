import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd';

import LinkButton from "../link-button";
import storageUtils from "../../utils/storageUtils";
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import menuList from "../../config/menuConfig";
import './index.less'

/*导航组件*/
class Header extends Component {


    state = {
        currentTime: formateDate(Date.now()),  // 当前时间字符串
        dayPictureUrl:'http://api.map.baidu.com/images/weather/day/qing.png',  // 天气图片
        weather: '晴', // 天气文本
    }

    getTime =() => {
        this.intervalId = setInterval(()=> {
            const  currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }

    /*getWeather = async () => {
         //引入
         import {reqWeather} from '../../api/index'
         const {dayPictureUrl, weather}  = await reqWeather('北京')
        //更新状态
        this.setState({dayPictureUrl, weather})

    }*/



    gitTitle= () => {
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key===path) {   // 如果当前key===path item.tetle就是要显示的值
                title = item.title
            } else if (item.children) {
                // 在所有子item 中查找匹配的title
                const cItem = item.children.find(cItem => cItem.key===path)
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }


    // 退出登入
    logout= () => {
    //    显示确认框
        Modal.confirm({
            content: '确定退出吗?',
            onOk: () => {
                console.log('OK', this)
                // 删除保存的user数据
                storageUtils.removerUser()
                memoryUtils.user = {}

                // 跳转到login
                this.props.history.replace('/login')
            }
        })
    }

    /*
    * 当前组件卸载之前
    * */
    componentWillMount() {
    //    清除定时器
        clearInterval(this.intervalId)
    }


    /*
    * 第一次render后执行
    * 执行异步操作
    * */
    componentDidMount() {
        // 获取当前时间
        this.getTime()

    //    获取当前天气显示
    //     this.getWeather()
    }


    render() {

        const {currentTime, dayPictureUrl, weather} = this.state
        const username = memoryUtils.user.username
        const title = this.gitTitle()
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton href='javascript:' onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                            <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>

                </div>
            </div>
        )
    }
}

export default withRouter(Header);