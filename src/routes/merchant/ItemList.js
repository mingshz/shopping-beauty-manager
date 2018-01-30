
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Radio, Modal, InputNumber } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import AbstractTablePage from '../util/AbstractTablePage';
import ItemTable from '../../components/ItemTable/index';

// eslint-disable-next-line
const FormItem = Form.Item;

@connect(state => ({
  data: state.item,
}))
export default class ItemList extends PureComponent {
  state = {
    openComment: false,
    comment: '',
    auditId: null,
    richDescription: {
      value: '',
    },
  }
  /**
   * 新增用户的表单内容
   */
  onCreateRender = (form) => {
    const { getFieldDecorator } = form;
    const { richDescription } = this.state;
    return (
      // <Row gutter={{ md: 8, sm: 16, lg: 24, xl: 48 }}>
      //   <Col md={8} sm={16}>
      <Form layout="inline">
        <Row>
          <Col>
            <FormItem
              required="true"
              label="项目名称"
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    min: 3,
                    message: '必须输入项目名称',
                  }],
              })(
                <Input placeholder="请输入项目名称" />
                )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              required="true"
              label="项目类型"
            >
              {getFieldDecorator('itemType', {
                rules: [
                  {
                    required: true,
                    min: 3,
                    message: '必须输入项目类型',
                  }],
              })(
                <Input placeholder="请输入项目类型" />
                )}
            </FormItem>
          </Col>
        </Row>
        {/* thumbnailUrl */}
        <Row gutter={{ md: 8, sm: 16, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem
              required="true"
              label="结算价"
            >
              {getFieldDecorator('costPrice', {
                rules: [
                  {
                    required: true,
                    message: '必须输入有效的结算价',
                  }],
              })(
                <InputNumber min={0} step={0.01} />
                )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              required="true"
              label="销售价"
            >
              {getFieldDecorator('salesPrice', {
                rules: [
                  {
                    required: true,
                    message: '必须输入有效的销售价',
                  }],
              })(
                <InputNumber min={0} step={0.01} />
                )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, sm: 16, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem
              required="true"
              label="原价"
            >
              {getFieldDecorator('price', {
                rules: [
                  {
                    required: true,
                    message: '必须输入有效的原价',
                  }],
              })(
                <InputNumber min={0} step={0.01} />
                )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              required="true"
              label="缩略图"
            >
              {getFieldDecorator('thumbnailUrl', {
                rules: [
                  {
                    required: true,
                    min: 3,
                    message: '必须输入缩略图',
                  }],
              })(
                <Input placeholder="请输入缩略图" />
                )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              required="true"
              label="简述"
            >
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    min: 3,
                    message: '必须输入简述',
                  }],
              })(
                <Input placeholder="请输入简述" />
                )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col>
            <BraftEditor onHTMLChange={(value) => {
                richDescription.value = value;
                // this.setState({
                //   richDescription: value,
                // });
                // form.setFieldsValue({
                //   richDescription: value,
                // });
              }}
            />
          </Col>
        </Row>
      </Form>
    );
  }
  commentUpdated = (e) => {
    this.setState({
      comment: e.target.value,
    });
  }
  bottom = () => {
    const { openComment, comment } = this.state;
    return (
      <Modal
        title="提交该项目，平台完成审核之后即可上线"
        visible={openComment}
        onCancel={() => this.setState({ openComment: false })}
        onOk={() => {
          const currentComment = this.state.comment;
          if (!currentComment) {
            this.setState({ openComment: false });
            return;
          }
          const { auditId } = this.state;
          const { dispatch } = this.props;
          dispatch({
            type: 'item/commitItem',
            payload: {
              id: auditId,
              comment: currentComment,
            },
            callback: () => {
              this.fetchData();
              this.setState({ openComment: false });
            },
          });
        }}
      >
        <Input placeholder="请输入备注" value={comment} onChange={this.commentUpdated} />
      </Modal>
    );
  }
  commitItem = id => () => {
    this.setState({
      openComment: true,
      comment: '',
      auditId: id,
    });
  }
  doAdd = (data, closeModal) => {
    // richDescription
    const { dispatch } = this.props;
    const { richDescription } = this.state;
    dispatch({
      type: 'item/add',
      payload: {
        ...data,
        richDescription: richDescription.value,
        merchantId: this.myMerchantId(),
      },
      callback: closeModal,
    });
  }
  myMerchantId = () => {
    const { match: { params: { merchantId } } } = this.props;
    return parseInt(merchantId, 10);
  }
  fetchData = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'item/fetch',
      payload: {
        ...params,
        merchantId: this.myMerchantId(),
      },
    });
  }
  searchForm = (getFieldDecorator, buttons) => {
    return (
      <div>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={36}>
            <Form.Item label="激活">
              {getFieldDecorator('enabled')(
                <Radio.Group >
                  <Radio.Button value="true">已激活</Radio.Button>
                  <Radio.Button value="false">未激活</Radio.Button>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
          <Col md={12} sm={36}>
            <Form.Item label="推荐">
              {getFieldDecorator('recommended')(
                <Radio.Group >
                  <Radio.Button value="true">已推荐</Radio.Button>
                  <Radio.Button value="false">未推荐</Radio.Button>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={72}>
            <Form.Item label="审核状态">
              {getFieldDecorator('auditStatus')(
                <Radio.Group >
                  <Radio.Button value="AUDIT_PASS">审核通过</Radio.Button>
                  <Radio.Button value="AUDIT_FAILED">审核不通过</Radio.Button>
                  <Radio.Button value="NOT_SUBMIT">尚未提交</Radio.Button>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="名称">
              {getFieldDecorator('itemName')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="类型">
              {getFieldDecorator('itemType')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            {buttons()}
          </Col>
        </Row>
      </div>
    );
  }
  changeEnabledSupplier = id => (value) => {
    this.props.dispatch({
      type: 'item/changeEnableTo',
      payload: {
        id,
        target: value,
      },
    });
  }
  render() {
    const { data: { loading, data, changing } } = this.props;
    return (
      <AbstractTablePage
        fetchData={this.fetchData}
        data={data}
        loading={loading}
        table={ItemTable}
        renderFormComponent={this.searchForm}
        propsTable={
          {
            merchantMode: true,
            changeEnabledSupplier: this.changeEnabledSupplier,
            auditOperationSupplier: {
              commit: this.commitItem,
            },
          }
        }
        bottom={this.bottom}
        creationTitle="新增项目"
        creationRender={this.onCreateRender}
        creationAction={this.doAdd}
        creationProps={{
          confirmLoading: changing,
          zIndex: 10,
          // 为了让富文本编辑器顺利工作
        }}
      />
    );
  }
}
