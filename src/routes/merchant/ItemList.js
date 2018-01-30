
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Radio } from 'antd';
import AbstractTablePage from '../util/AbstractTablePage';
import ItemTable from '../../components/ItemTable/index';

// eslint-disable-next-line
const FormItem = Form.Item;

@connect(state => ({
  data: state.item,
}))
export default class ItemList extends PureComponent {
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
    const { data: { loading, data } } = this.props;
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
          }
        }
      />
    );
  }
}
