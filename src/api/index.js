import jsonp from 'jsonp'
import ajax from "./ajax";
import {message} from "antd";

/*包含n个接口请求参数的模块*/

// 登录
export const reqLogin = (username, password) =>  ajax('/login', {username, password}, 'POST')

// 添加用户
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')

// 获取分类列表
export const reqCategorys = (parentId) => ajax('/manage/category/list', {parentId})
// 添加分类

export const reqAddCategorys =  (parentId, categoryName) => ajax('/manage/category/add',
    {
        parentId,
        categoryName
    }, 'POST')
// 更新品类名称
export const reqUpdateCategory = ({categoryId, categoryName}) =>
    ajax('/manage/category/update', {
        categoryId,
        categoryName
    }, 'POST')

/*josnp请求的接口函数*/
/*export const reqWeather = () => {
    return new Promise((resolve , reject) => {
        const url =`https://api.map.baidu.com/weather/v1/?district_id=430300&data_type=all&ak=I7coUMsiKNIbpnzyvE8tMaPa0avCLeGh`
        jsonp(url, {}, (err, data) => {
            console.log('jsonp()', err, data)
           /!* // 如果成功了
            if (!err && data.status==='success') {
                // 取出需要的数据
                const {dayPictureUrl, weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl, weather})
            } else {
                // 如果失败了
                message.error('获取天气信息失败!')
            }*!/
        })
    })


}*/

export const reqWeather = (city) => {

    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        // 发送jsonp请求
        jsonp(url, {}, (err, data) => {
            console.log('jsonp()', err, data)
            // 如果成功了
            if (!err && data.status==='success') {
                // 取出需要的数据
                const {dayPictureUrl, weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl, weather})
            } else {
                // 如果失败了
                message.error('获取天气信息失败!')
            }

        })
    })
}
// reqWeather('北京')

// reqWeather()
