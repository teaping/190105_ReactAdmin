import React, {Component} from 'react';
import {Card, Table, Button, Icon, message, Modal} from 'antd'
import LinkButton from "../../components/link-button";
import {reqAddCategorys, reqCategorys, reqUpdateCategory, reqWeather} from "../../api";
import AddForm from "./add-Form";
import UpdateForm from "./update-Form";
// 商品分类路由
class Category extends Component {

    state = {
        loading: false, // 是否正在获取数据
        categorys: [],  // 一级分类列表
        subCategorys:[], // 子分类列表
        parentId: '0', // 当前需要显示的分类列表 父类id
        parentName: '', // 当前需要显示的分类列表 父类名称
        showStatus: 0, //标识确认框添加更新是否显示， 0：都不显示

    }
    /*初始化table所有列的数组
    * */

    initColums = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name', // 显示数据对应的属性名
            },
            {
                title: '操作',
                width:300,
                render: (categorys) => ( // 返回需要显示的界面标签
                    <span>
                        <LinkButton  onClick={()=>this.showUpdate(categorys)}>修改分类</LinkButton>
                        {/*如何向事件回调函数传递参数： 先定一个匿名函数，在函数中调用处理的函数并传递*/}
                        {this.state.parentId==='0'? <LinkButton onClick={() => {this.showSubCategorys(categorys)}}>查看子分类</LinkButton>:null
                        }
                          </span>
                )
            },
        ];
    }

    /*
    * 显示指定一级分类对象的二级分类
    * */
    showSubCategorys = (category) => {
        // 更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, ()=> { // 在状态更新且重新render 后执行
            this.getCategorys()
        })

    }


    // 异步获取一级分类列表显示/二级 parentId没有指定根据state中的parentId查询

    getCategorys = async ( parentId ) => {

        this.setState({loading:true})

        parentId = parentId || this.state.parentId
        // 发异步
        const  result = await reqCategorys(parentId)

        this.setState({loading:false})
        if (result.status===0) {
            // 取出分类数组
            const categorys = result.data
            // 更新
            if (parentId==='0') {
                this.setState({categorys})
            }else {
                this.setState({subCategorys:categorys})
            }
        }else{
            message.error('获取列表失败')
        }
    }

    // 显示添加确认框
    showAdd =() =>{
        this.setState({showStatus:1})
    }

    // 更新分类确认框
    showUpdate=(categorys) =>{
        // 保存分类对象
        this.category = categorys
        // 更新状态
        this.setState({showStatus:2})
    }


    // 异步获取一级分类列表显示
    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys:[]
        })
    }

    /*
    * 响应点击取消：隐藏确认框
    * */
    handleCancel= () => {
        // 清除所有数据
        this.form.resetFields()
        this.setState({showStatus:0})
    }

    // 添加分类
    addCategory = () => {

        // 进行表单验证，只有通过才处理
        this.form.validateFields( async (err, values) => {
            if (!err) {
                // 隐藏确认框
                this.setState({showStatus:0})

                const { parentId,categoryName} =  values

                // 清除所有数据
                this.form.resetFields()


                const result = await reqAddCategorys(parentId, categoryName)
                if (result.status===0) {
                    // 添加的分类就是当前分类列表
                    if (this.state.parentId === parentId) {
                        //重新刷新列表
                        this.getCategorys()
                    } else if (parentId === '0') { // 在二级分类下添加一级分类，重新获取一级分类列表单不需要显示
                        this.getCategorys('0')

                    }

                }
            }

        })

    }

    // 更新分类
    updateCategory = () => {

        // 进行表单验证，只有通过才处理
        this.form.validateFields( async (err, values) => {
            if (!err) {
                // 隐藏确认框
                this.setState({showStatus:0})

                const categoryId = this.category._id
                const {categoryName} = values

                // 清除所有数据
                this.form.resetFields()

                // 发请求
                const result = await reqUpdateCategory({categoryId, categoryName})
                if (result.status===0) {
                    //重新刷新列表
                    this.getCategorys()
                }
            }
        })

    }


    // 为第一次render准备数据
    componentWillMount() {
        this.initColums()
    }

    // 发异步qjax请求
    componentDidMount() {
        this.getCategorys()
    }

    render() {

        const {categorys, loading, subCategorys, parentId, parentName, showStatus} = this.state
        // 读取指定分类
        const category = this.category || {} // 如果没有指定空
        // card 的左侧
        const title = parentId==='0'?'一级分类列表':(<span><LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton><Icon type='arrow-right' style={{marginRight:5}}/><span>{parentName}</span></span>)

        // Card 右侧
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus'></Icon>
                添加
            </Button>
        )

     return (
            <Card title={title} extra={extra} >
                <Table rowKey='_id' loading={loading}
                       pagination={{defaultCurrent:10, showQuickJumper: true}}
                       dataSource={parentId==='0' ?categorys : subCategorys} columns={this.columns} bordered />;
                <Modal title="添加分类"
                       visible={showStatus===1}
                       onOk={this.addCategory}
                       onCancel={this.handleCancel}>
                    <AddForm categorys={categorys} parentId={parentId} setForm={(form) => {this.form=form}}/>
                </Modal>

                <Modal title="修改分类"
                       visible={showStatus===2}
                       onOk={this.updateCategory}
                       onCancel={this.handleCancel}>
                    <UpdateForm categoryName={category.name} setForm={(form) => {this.form=form}}/>
                </Modal>

            </Card>
        )
    }
}

export default Category;