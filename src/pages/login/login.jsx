import  React, {Component} from "react";
import {Redirect} from 'react-router-dom'
import {   Form,
    Icon,
    Input,
    Button,
    message } from 'antd';
import './login.less'
import logo from "./images/logo.png"
import {reqLogin} from '../../api'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";

const Item = Form.Item  // 不能写在import之前
/*
登入路由组件
 */

class Login extends Component{

    handleSubmit = (event) => {
    //    阻止事件默认行为
        event.preventDefault()
        // 对所有表单字段进行效验
        this.props.form.validateFields(async (err, values) => {
            // 成功
            if (!err) {
                // console.log('adasdsad', values;
                  const { username, password } = values
                const result = await reqLogin(username, password)
                // console.log('成功')
                if (result.status === 0){
                    message.success('成功')
                //    跳转到管理界面(不需要回退到登录)
                //    保存user
                    const user= result.data
                    memoryUtils.user = user // 存在内存中
                    storageUtils.saverUser(user) // 保存到local

                    this.props.history.replace('/')
                }else {
                    // 提示错误信息
                    message.error(result.msg)
                }
            //    请求登录
            } else {
              console.log('校验失败')
            }

        })



    //    得到form对象
    //     const form = this.props.form
    //    表单输入数据
    //     const values = form.getFieldsValue()
    }

    /*对密码进行自定义验证*/
    validtePwd = (rule, value, callback) => {
        if (!value){
            callback('密码必须输入');
        }else if (value.length<4){
            callback('密码长度不能小于4');
        }else  if (value.length>12) {
            callback('密码长度不能大于12');
        }else if ( !/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('密码错误');
        }else {
            callback() // 验证通过
        }
    }

    render() {
        // 判断用户是否登入
        const user = memoryUtils.user
        if (user || user._id){
            return <Redirect to='/'/>
        }
        // 得到具强大的表单对象
        const form = this.props.form
        const { getFieldDecorator } =form
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {
                                getFieldDecorator('username', { // 配置对象 属性名是一些特定的名称
                                    // 声明式验证：直接使用别人定义号的验证规则进行验证
                                    rules:[{ required: true, whiteSpace:true, message: 'Please input your Username!' },
                                        { min: 4, message: 'Please input your Username!' },
                                        { max: 12, message: 'Please input your Username!' },
                                        { pattern: /^[a-zA-Z0-9_]+$/, message: 'Please input your Username!' }],
                                    initialValue: 'admin', // 指定初始值
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="用户名"
                                    />
                                )
                            }
                        </Item>
                        <Item>
                            {
                                getFieldDecorator('password', {
                                    rules: [
                                        {validator:this.validtePwd},
                                        ],
                                    initialValue: 'admin',
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="密码"
                                    />
                                )
                            }
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登陆
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }

}
/*高级函数
* 高阶组件
* */

const WrapLogin = Form.create()(Login)
export default WrapLogin

/*前台表单验证
* 收集表单收入数据
* */

