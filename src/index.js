/*
入口js
 */
import React from 'react'
import ReactDOM from 'react-dom'
import storageUtils from "./utils/storageUtils";
import memoryUtils from "./utils/memoryUtils";
// import 'antd/dist/antd.css'

import App from './App'

// 读取local中保存user 保存到内存zhong
const user= storageUtils.getUser()
memoryUtils.user(user)
// 将app组件标签渲染到index页面上的div上
ReactDOM.render(<App/>, document.getElementById('root'))

