import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Modal, InputNumber } from 'antd';
import styles from './index.less';
// eslint-disable-next-line
const FormItem = Form.Item;

@Form.create()
export default class RechargeBatchCreationFormModal extends PureComponent {
  ok = () => {
    const { onOk, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      onOk(fieldsValue);
    });
  }
  render() {
    const { globalInit: { systemEmailAddress } } = this.props;
    const { visible } = this.props;
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Modal
        visible={visible}
        title="新增充值卡批次"
        {...this.props}
        onOk={this.ok}
      >
        <Form layout="inline">
          <Row gutter={{ md: 8, sm: 16, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem
                required="true"
                label="数量"
                style={{
                  width: '100%',
                }}
                wrapperCol={{
                  span: 16,
                }}
                labelCol={{
                  span: 8,
                }}
              >
                {getFieldDecorator('number', {
                  rules: [
                    {
                      type: 'number',
                      required: true,
                      min: 0,
                      max: 100,
                      message: '必须输入生成数量',
                    }],
                })(
                  <InputNumber />
                  )}
              </FormItem>
            </Col>
            <Col md={16} sm={24}>
              <FormItem
                required="true"
                label="接收邮箱"
                style={{
                  width: '100%',
                }}
                wrapperCol={{
                  span: 16,
                }}
                labelCol={{
                  span: 8,
                }}
              >
                {getFieldDecorator('emailAddress', {
                  rules: [
                    {
                      required: true,
                      type: 'email',
                      message: '必须输入接收邮箱',
                    }],
                })(
                  <Input placeholder="请输入接收邮箱" />
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col >
              <p className={styles.warning}>请注意提示分享者将{systemEmailAddress}作为安全白名单，避免邮件被意外拦截。</p>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
