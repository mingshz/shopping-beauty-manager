// 虽然放在routes中，其实只是一个组件
// import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Row, Form, Col, Input } from 'antd';
import AbstractTablePage from '../util/AbstractTablePage';
import RechargeCardTable from '../../components/RechargeCardTable';

export default class RechargeCard extends PureComponent {
    fetchData = (params) => {
      this.props.dispatch({
        type: 'rechargeCard/fetch',
        payload: params,
      });
    }

    searchForm = (getFieldDecorator, buttons) => {
      return (
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={10} sm={24}>
            <Form.Item label="卡密">
              {getFieldDecorator('code')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item label="使用者">
              {getFieldDecorator('user')(
                <Input />
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
          cardOnly
          fetchData={this.fetchData}
          renderFormComponent={this.searchForm}
          data={data}
          loading={loading}
          table={RechargeCardTable}
          propsTable={{
            }}
        />
      );
    }
}
