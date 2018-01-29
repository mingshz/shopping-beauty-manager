
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Form, Row, Col, Input } from 'antd';
import AbstractTablePage from '../util/AbstractTablePage';
import StoreTable from '../../components/StoreTable';

// eslint-disable-next-line
const FormItem = Form.Item;

@connect(state => ({
  data: state.store,
}))
export default class StoreList extends PureComponent {
    myMerchantId = () => {
      const { match: { params: { merchantId } } } = this.props;
      return merchantId;
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
    revokeManagerSupplier = id => () => {
      this.props.dispatch({
        type: 'manager/updateManageable',
        payload: {
          id,
          target: false,
        },
        callback: this.fetchData,
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
      const { data: { loading, data, changingEnableId } } = this.props;
      return (
        <AbstractTablePage
          fetchData={this.fetchData}
          data={data}
          loading={loading}
          table={StoreTable}
          renderFormComponent={this.searchForm}
          propsTable={
              {
                revokeManagerSupplier: this.revokeManagerSupplier,
                changeEnabledSupplier: this.changeEnabledSupplier,
                changingEnableId,
              }
          }
        />
      );
    }
}
