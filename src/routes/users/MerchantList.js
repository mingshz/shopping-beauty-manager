
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import React, { PureComponent } from 'react';
import { Form, Row, Col, Input } from 'antd';
import AbstractTablePage from '../util/AbstractTablePage';
import MerchantTable from '../../components/MerchantTable';
import { humanReadName } from '../../services/login';
import LoginSelector from '../../components/LoginSelector';

// eslint-disable-next-line
const FormItem = Form.Item;

@connect(state => ({
  data: state.merchant,
}))
export default class MerchantList extends PureComponent {
  state = {
    openLoginSelector: false,
  }
  /**
   * 新增用户的表单内容
   */
  onCreateRender = (form) => {
    const { getFieldDecorator } = form;
    const LocalLoginSelector = connect((state) => {
      return {
        list: state.login.select,
      };
    })(LoginSelector);
    const { openLoginSelector } = this.state;
    const { data: { creation } } = this.props;

    return (
      // <Row gutter={{ md: 8, sm: 16, lg: 24, xl: 48 }}>
      //   <Col md={8} sm={16}>
      <Form layout="inline">
        <Row>
          <Col>
            <FormItem
              required="true"
              label="所有者"
            >
              {getFieldDecorator('loginId', {
                rules: [
                  {
                    required: true,
                    message: '必须选择所有者',
                  }],
                initialValue: creation.id,
              })(
                <Input type="hidden" />
                )}
              <span onClick={this.forLogin}>{this.newLoginName()}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              required="true"
              label="商户名称"
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    min: 3,
                    message: '必须输入商户名称',
                  }],
              })(
                <Input placeholder="请输入商户名称" />
                )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              required="true"
              label="联系人"
            >
              {getFieldDecorator('contact', {
                rules: [
                  {
                    required: true,
                    min: 3,
                    message: '必须输入联系人',
                  }],
              })(
                <Input placeholder="请输入联系人" />
                )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              required="true"
              label="联系方式"
            >
              {getFieldDecorator('telephone', {
                rules: [
                  {
                    required: true,
                    min: 3,
                    message: '必须输入联系方式',
                  }],
              })(
                <Input placeholder="请输入联系方式" />
                )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              required="true"
              label="商户地址"
            >
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    min: 3,
                    message: '必须输入商户地址',
                  }],
              })(
                <Input placeholder="请输入商户地址" />
                )}
            </FormItem>
          </Col>
        </Row>
        <LocalLoginSelector
          visible={openLoginSelector}
          onClose={this.forLoginClose}
          onOk={this.forLoginOk}
        />
      </Form>
    );
  }
  changeEnabledSupplier = id => (value) => {
    this.props.dispatch({
      type: 'merchant/changeEnableTo',
      payload: {
        id,
        target: value,
      },
    });
  }
  subPageClickSupplier = id => () => {
    this.props.dispatch(routerRedux.push(`/merchant/${id}/manager`));
  }
  /**
   * 显示在表单中 可以被点击然后弹出选择框的内容
   */
  newLoginName = () => {
    const { data: { creation } } = this.props;
    if (!creation.id) {
      return '请点击选择用户';
    }
    return humanReadName(creation.login);
  }
  forLoginOk = (login) => {
    this.props.dispatch({
      type: 'merchant/creationLoginSelected',
      payload: login,
    });
    this.forLoginClose();
  }
  forLoginClose = () => {
    this.setState({
      openLoginSelector: false,
    });
  }
  forLogin = () => {
    this.setState({
      openLoginSelector: true,
    });
  }
  /**
   * 执行增加任务
   */
  doAdd = (data, closeModal) => {
    this.props.dispatch({
      type: 'merchant/add',
      payload: data,
      callback: () => {
        this.fetchData();
        closeModal();
      },
    });
  }

  fetchData = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'merchant/fetch',
      payload: params,
    });
  }


  searchForm = (getFieldDecorator, buttons) => {
    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <Form.Item label="关键字">
            {getFieldDecorator('username')(
              <Input placeholder="请输入" />
            )}
          </Form.Item>
        </Col>
        <Col md={8} sm={24}>
          {buttons()}
        </Col>
      </Row>);
  }

  render() {
    const { data: { loading, data, changing } } = this.props;
    return (
      <AbstractTablePage
        fetchData={this.fetchData}
        data={data}
        loading={loading}
        table={MerchantTable}
        renderFormComponent={this.searchForm}
        propsTable={{
          changeEnabledSupplier: this.changeEnabledSupplier,
          subPageClickSupplier: this.subPageClickSupplier,
        }}
        creationTitle="新增商户"
        creationRender={this.onCreateRender}
        creationAction={this.doAdd}
        creationProps={{
          confirmLoading: changing,
        }}
      // 此处情况比较复杂，我们意图将这些值绑定在model中
      // creationProps={{
      //   data: creation,
      // }}
      // creationFormOptions={{
      //   mapPropsToFields: (props) => {
      //     console.log('creationFormOptions', props);
      //     return {
      //       loginId: Form.createFormField(props.data.id),
      //     };
      //   },
      // }}
      />
    );
  }
}
