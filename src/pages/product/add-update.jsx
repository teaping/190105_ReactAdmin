import React, {Component} from 'react';
import {Card, Form, Input, Icon, Cascader, Upload, Button, message} from "antd";
import LinkButton from "../../components/link-button";
import {reqCategorys, reqAddOrUpdateProduct} from "../../api";
import PicturesWall from "./pictures-wall";
import RichTextEditor from "./rich-text-editor";
const {Item} = Form
const {TextArea} = Input




/*
*  ProductHome的添加更新子路由组件
* */
class ProductAddUpdate extends Component {

    state={
        options: [],
    }

    constructor(props) {
        super(props);

        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    initOptions = async (categorys) => {
        // 根据categorys生成options数组
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false, // 不是叶子
        }))

        // 如果是一个二级分类商品更新
        const {isUpdate, product} = this
        const {pCategoryId}  = product
        if (isUpdate && pCategoryId!=='0') {
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            // 生成二级列表
            const childOptions = subCategorys.map(c=>({
                value: c._id,
                label: c.name,
                isLeaf: true, // 不是叶子
            }))

            // 找到当前商品对应的options
            const targetOptions = options.find(options => options.value===pCategoryId)

            // 关联对应的一级的optins
            targetOptions.children = childOptions

        }

        //更新options状态
        this.setState({options})
    }

    // 获取一级或二级分类列表
    getCategorys =async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status===0) {
            const categorys = result.data
            // 如果是一级分类
            if (parentId==='0') {
                this.initOptions(categorys)
            }else {
                // 二级列表
                return categorys
            }
        }
    }

    /*
    * 验证价格*/
    validatePrice = (rule, value, callback) => {
        if (value*1>0) {
            callback()
        }else {
            callback('价格必须大于0')
        }
    }

    submit = () => {
        // 进行表单验证
        this.props.form.validateFields( async (error, values)=>{
            if (!error) {
                console.log('成功')
                // 收集数据

                const {name, desc, price, categoryIds} = values
                let pCategoryId, categoryId
                if (categoryIds.length===1) {
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                } else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()

                const product= {
                    name, desc, price,imgs,detail, pCategoryId, categoryId
                }
                // 如果更新需要添加下划线id
                if (this.isUpdate) {
                    product._id = this.product._id
                }
                // 调用接口添加

                const result = await reqAddOrUpdateProduct(product)
                // 根据结果提示
                if (result.status === 0) {
                    message.success(`${this.isUpdate? '更新': '添加'}商品成功！`)
                    this.props.history.goBack()
                } else {

                    message.error(`${this.isUpdate? '更新': '添加'}商品失败！`)
                }
            }
        })
    }
    /*
    * 用于加载下一级列表的回调函数
    * */
    loadData =async selectedOptions => {
        // 得到选择option的对象
        const targetOption = selectedOptions[selectedOptions.length - 1];
        // 显示loading
        targetOption.loading = true;

        // 根据选择的分类，请求获取下一级列表
        const subCategorys = await this.getCategorys(targetOption.value)

        targetOption.loading = false;
        if (subCategorys && subCategorys.length>0) {
            // 生成一个二级列表是options
            const childOptions = subCategorys.map(c=>({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            // 关联到当前的options上
            targetOption.children = childOptions
        }else {
            //当前选择分类没有二级分类
            targetOption.isLeaf = true
        }



        // 更新
        this.setState({
            setOptions:[...this.state.options],
        })

    };


    componentDidMount() {
        this.getCategorys('0')
    }

    componentWillMount() {
        // 取出携带的state
        const  product = this.props.location.state
        // 保存是否更新的标识
        this.isUpdate = !!product
        // 保存商品
        this.product = product || {}
    }


    render() {
        const {isUpdate, product} =this
        const {pCategoryId, categoryId, imgs, detail} = product
        const categoryIds = []
        // 接收级联分类Id数组
        if (isUpdate) {

            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }

        }
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{fontSize:20}}/>
                </LinkButton>
                <span>{isUpdate? '修改商品': '添加商品'}</span>
            </span>
        )

        // 指定item布局的配置对象
        const formItemLayout = {
            labelCol: {span:2}, // 左侧label宽度
            wrapperCol: {span:8},
        }

        const {getFieldDecorator}  =this.props.form


        return (
            <Card title={title}>

                <Form {...formItemLayout}>
                    <Item label="商品名称">
                        {
                            getFieldDecorator('name', {
                                initialValue:product.name,
                                rules: [
                                    {required: true, message: '必须输入'}
                                ]
                            })(
                                <input placeholder='商品名称'/>
                            )
                        }
                    </Item>
                    <Item label="商品描述">
                        {
                            getFieldDecorator('desc', {
                                initialValue:product.desc,
                                rules: [
                                    {required: true, message: '必须输入'}
                                ]
                            })(
                                <TextArea placeholder='商品描述' autosize={{minRows:2, maxRows:6}} />
                            )
                        }

                    </Item>
                    <Item label="商品价格">
                        {
                            getFieldDecorator('price', {
                                initialValue:product.price,
                                rules: [
                                    {required: true, message: '必须输入'},
                                    {validator: this.validatePrice}
                                ]
                            })(
                                <input type='number' placeholder='商品价格' addonAfter='元'/>
                            )
                        }

                    </Item>
                    <Item label="商品分类">


                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
                            })(
                                <Cascader
                                    placeholder='商品分类'
                                    options={this.state.options} // 显示列表数据数组//选择某个列表项加载下一级的监听回调
                                          loadData={this.loadData} />
                                          )
                        }


                    </Item>
                    <Item label="商品图片">
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label="商品详情"    labelCol={{span:2}}
                     wrapperCol={{span:20}} >
                       <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate);