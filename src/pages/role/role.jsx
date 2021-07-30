import React, {Component} from 'react';
import {Card, Button, Table, Modal, message} from "antd";
import {reqRoles, reqAddRole, reqUpdateRole} from "../../api";
import {PAGE_SIZE} from "../../utils/constants";
import {formateDate} from "../../utils/dateUtils";
import AddForm from "./add-form";
import AuthForm from "./auth-form";
import memoryUtils from "../../utils/memoryUtils";

// 角色路由
class Role extends Component {

    state={
        roles: [], //所有角色列表
        role: {}, // 选中的role
        isShowAdd: false,  // 是否显示添加界面
        isShowAuth: false,
    }

    constructor(props) {
        super(props);
        this.auth = React.createRef()
    }

    initColum = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render:formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
    }

    getRoles = async () => {
        const result = await reqRoles()
        if ( result.status ===0 ) {
            const roles = result.data
            this.setState({roles})
        }
    }

    onRow = (role) => {
        return {
            onClick: event => { // 点击行
                this.setState({role})
            }
        }
    }

    // 添加角色
    addRole = () => {
        // 表单验证
        this.form.validateFields( async (error, values) => {
            if (!error) {
                // 搜集输入数据
                const {roleName} = values
                // 清空文本框数据
                this.form.resetFields()
                //请求添加
                const result = await reqAddRole(roleName);
                if (result.status === 0) {
                    // 隐藏确认框
                    this.setState({isShowAdd: false})

                    message.success('添加角色成功')
                    // this.getRoles()
                    // 产生新的角色
                    const role = result.data
                    // 更新roles状态
                   /* const roles = [...this.state.roles]
                    roles.push(role)
                    this.setState({roles})*/
                    // 更新rloes状态 基于原本的状态更新
                    this.setState(state => ({
                        reqRoles: [...state.roles, role]
                    }))

                } else {
                    message.success('添加角色失败')
                }
                // 根据结果更新显示
            }
        })
    }

    // 更新角色
    updateRole = async () => {
        const role = this.state.role
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_name = memoryUtils.user.username
        role.auth_time = Date.now()
        // 请求更新
        const rules = await reqUpdateRole(role)
        if (rules.status === 0 ) {
            this.setState({isShowAuth: false})
            message.success('设置角色权限成功')
            // this.getRoles()
            this.setState({
                roles: [...this.state.roles]
            })
        }else {
            message.success('设置角色权限失败')
        }
    }




    componentWillMount() {
        this.initColum()
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {

        const {roles, role, isShowAdd, isShowAuth} = this.state
        // 指定item布局的配置对象


        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>创建角色</Button> &nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={() => this.setState({isShowAuth: true})}>设置角色权限</Button>
            </span>
        )

        return (
            <Card title={title}>

                <Table  rowKey='_id'
                        pagination={{defaultCurrent: PAGE_SIZE}}
                        dataSource={roles}
                        columns={this.columns} bordered
                        rowSelection={{type: 'radio', selectedRowKeys: [role._id]}}
                        onRow={this.onRow}/>
                <Modal title="添加角色"
                       visible={isShowAdd}
                       onOk={this.addRole}
                       onCancel={() => {
                           this.setState({isShowAdd: false})
                           this.form.resetFields()}}>
                    <AddForm setForm={(form)=> this.form = form }/>
                </Modal>

                <Modal title="设置角色权限"
                       visible={isShowAuth}
                       onOk={this.updateRole}
                       onCancel={() => {
                           this.setState({isShowAuth: false})}}>
                    <AuthForm ref ={this.auth} role={role}/>
                </Modal>

            </Card>
        )
    }
}

export default Role;