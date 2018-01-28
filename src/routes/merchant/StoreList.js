
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Form, Row, Col, Input } from 'antd';
import AbstractTablePage from '../util/AbstractTablePage';
import ManagerTable from '../../components/ManagerTable';

// eslint-disable-next-line
const FormItem = Form.Item;

@connect(state => ({
  data: state.manager,
}))
export default class StoreList extends PureComponent {
    fetchData = (params) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'manager/fetch',
        payload: params,
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
      const { data: { loading, data } } = this.props;
      return (
        <AbstractTablePage
          fetchData={this.fetchData}
          data={data}
          loading={loading}
          table={ManagerTable}
          renderFormComponent={this.searchForm}
          propsTable={
              {
                revokeManagerSupplier: this.revokeManagerSupplier,
              }
          }
        />
      );
    }
}
