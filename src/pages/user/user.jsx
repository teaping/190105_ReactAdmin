import React, {Component} from 'react';
import {Card, Button, Table, Modal, message} from "antd";
import LinkButton from "../../components/link-button";
import {formateDate} from "../../utils/dateUtils";
import {PAGE_SIZE} from "../../utils/constants";
import {reqDeleteUser, reqUsers, reqAddOrUpdateUser} from "../../api";
import UserForm from "./user-form";

// 用户路由
class User extends Component {

    state = {
        users: [],
        isShow: false,
        roles: [],
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },

            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
                )
            },
        ]
    }
    showUpdate = (user) => {
        this.user = user // 保存user
        this.setState({
            isShow: true
        })
    }


    /*
    * 删除用户
    * */
    deleteUser = (user) => {
        Modal.confirm({
            title : `确认删除${user.username}吗?`,
            onOk: async () => {
               const result = await reqDeleteUser(user._id)
                if (result.status ===0 ) {
                    message.success('删除用户成功！')
                    this.getUsers()
                }
            }
        })

    }


    /*添加或者更新用户*/
    addOrUpdateUser = async () => {
        this.setState({isShow: false})

        // 1. 收集输入数据
        const user = this.form.getFieldsValue()
        this.form.resetFields()
        // 如果是更新, 需要给user指定_id属性
        if (this.user) {
            user._id = this.user._id
        }

        // 2. 提交添加的请求
        const result = await reqAddOrUpdateUser(user)
        // 3. 更新列表显示
        if(result.status===0) {
            message.success(`${this.user ? '修改' : '添加'}用户成功`)
            this.getUsers()
        }
    }


    /*
    * 根据role数组 生成包含所有角色名的对象  属性名用角色的id值
    * */

    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        // 保存
        this.roleNames = roleNames
    }


    getUsers = async () => {
        const result = await reqUsers();
        if (result.status === 0 ) {
            const {users, roles} = result.data
            this.initRoleNames(roles)
            this.setState({
                users,roles
            })
        }
    }

    /*
 显示添加界面
  */
    showAdd = () => {
        this.user = null // 去除前面保存的user
        this.setState({isShow: true})
    }


    componentDidMount() {
        this.getUsers()
    }

    componentWillMount() {
        this.initColumns()
    }

    render() {

        const {users,isShow,roles} = this.state
        const user = this.user || {}
        const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>
        return (
            <Card title={title}>
                <Table rowKey='_id'
                       pagination={{defaultCurrent: PAGE_SIZE}}
                       dataSource={users} columns={this.columns} bordered />;
                <Modal title={user._id ? '修改用户': '添加用户'}
                       visible={isShow}
                       onOk={this.addOrUpdateUser}
                       onCancel={()=> this.setState({isShow: false},this.form.resetFields())}>
                    <UserForm setForm={form => this.form = form}
                              roles={roles}
                              user={user}/>
                </Modal>

            </Card>
        )
    }
}

export default User;