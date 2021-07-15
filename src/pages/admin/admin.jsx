import  React, {Component} from "react";
import {Redirect} from 'react-router-dom'
import memoryUtils from "../../utils/memoryUtils";

/*
后台管理路由组件
 */

export default class Admin extends Component{


    render() {

        const user = memoryUtils.user
        if (!user||!user._id) {
        //    自动跳转登入
            return <Redirect to = 'login'/>
        }
        return (
            <div>hello{user.name}</div>
        )
    }

}
