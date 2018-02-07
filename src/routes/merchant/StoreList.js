
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Form, Row, Col, Input } from 'antd';
import AbstractTablePage from '../util/AbstractTablePage';
import StoreTable from '../../components/StoreTable';
import AddressSelector from '../../components/AddressSelector';
import { humanReadName } from '../../services/login';
import LoginSelector from '../../components/LoginSelector';

// eslint-disable-next-line
const FormItem = Form.Item;

@connect(state => ({
  data: state.store,
}))
export default class StoreList extends PureComponent {
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
              label="门店名称"
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    min: 3,
                    message: '必须输入门店名称',
                  }],
              })(
                <Input placeholder="请输入门店名称" />
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
              label="门店地址"
            >
              <AddressSelector form={form} />
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
      type: 'store/creationLoginSelected',
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
      type: 'store/add',
      payload: {
        ...data,
        merchantId: this.myMerchantId(),
      },
      callback: () => {
        this.fetchData();
        closeModal();
      },
    });
  }
  myMerchantId = () => {
    const { match: { params: { merchantId } } } = this.props;
    return parseInt(merchantId, 10);
  }
  fetchData = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'store/fetch',
      payload: {
        ...params,
        merchantId: this.myMerchantId(),
      },
    });
  }
  changeEnabledSupplier = id => (value) => {
    this.props.dispatch({
      type: 'store/changeEnableTo',
      payload: {
        id,
        target: value,
      },
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

  /**
   * 点击id的时候，我们就展示rp队列吧
   */
  subPageClickSupplier= id => () => {
    // 改成展示 详情页
    // 下面是显示rp队
    this.props.dispatch({
      type: 'store/selectStore',
      payload: {
        merchantId: this.myMerchantId(),
        id,
      },
    });
  }

  render() {
    const { data: { loading, data, changingEnableId, changing } } = this.props;
    return (
      <AbstractTablePage
        fetchData={this.fetchData}
        data={data}
        loading={loading}
        table={StoreTable}
        renderFormComponent={this.searchForm}
        propsTable={
          {
            subPageClickSupplier: this.subPageClickSupplier,
            changeEnabledSupplier: this.changeEnabledSupplier,
            changingEnableId,
          }
        }
        creationTitle="新增门店"
        creationRender={this.onCreateRender}
        creationAction={this.doAdd}
        creationProps={{
          confirmLoading: changing,
        }}
        bottom={this.bottom}
      />
    );
  }
}
