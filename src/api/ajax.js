/*
* 能发送异步ajax请求的函数模块
* 封装axios库
* 函数返回值是promise对象
* 优化请求异常
* */

import  axios from 'axios'
import {message} from "antd";

export default function ajax(url, data={}, type='GET') {
    return new Promise((resolve, reject) => {
        let promise

        if (type=='GET') {
            // 发GET
           promise = axios.get(url, {
                // 配置对象
                params: data   // 指定请求参数
            })

        } else {
            //    post
            promise = axios.post(url, data)
        }

        promise.then(response => {
            resolve(response.data)
        }).catch(error => {
            message.error('请求出错:'+error.message)
        })

    })

}
