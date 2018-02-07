import React, { PureComponent } from 'react';
import { Cascader, Input } from 'antd';
import address from '../../utils/address';
import styles from './index.less';

// npm install -g city
// https://www.npmjs.com/package/city
// city -k label,children,value --output src/utils/address.js -p -j 'allAddress'
const defaultProvince = '330000';
const defaultPrefecture = '330600';
const defaultCounty = '330681';
/**
 * 地址选择器
 * 应该传入form
 */
export default class AddressSelector extends PureComponent {
  onChange = (input) => {
    const { form } = this.props;
    form.setFieldsValue({
      'address.province': input[0],
      'address.prefecture': input[1],
      'address.county': input[2],
    });
  }
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    getFieldDecorator('address.province', {
      initialValue: defaultProvince,
    });
    getFieldDecorator('address.prefecture', {
      initialValue: defaultPrefecture,
    });
    getFieldDecorator('address.county', {
      initialValue: defaultCounty,
    });
    return (
      <div className={styles.component}>
        <Cascader
          defaultValue={[defaultProvince, defaultPrefecture, defaultCounty]}
          options={address}
          onChange={this.onChange}
          expandTrigger="hover"
        />
        {getFieldDecorator('address.otherAddress', {
          rules: [
            {
              required: true,
              min: 3,
              message: '必须输入详细地址',
            }],
        })(
          <Input placeholder="详细地址" />
          )}
      </div>
    );
  }
}
