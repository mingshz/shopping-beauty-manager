import React, { PureComponent } from 'react';
// import { connect } from 'dva';
import { Modal, Select } from 'antd';
import { humanReadName } from '../../services/login';
// eslint-disable-next-line
const Option = Select.Option;
/**
 * 变得更轻些
 * 需要dispatch,list(from state.login.select)
 */
// @connect(state => ({
//   list: state.login.select,
// }))
export default class LoginSelector extends PureComponent {
  // state = {
  //   /**
  //    * 当前选中的对象
  //    */
  //   // selectId: null,
  // };
  /**
   * 更新数据
   */
  handleChange = (value) => {
    // console.log('changed:', value);
    let targetValue;
    if (value.constructor.name === 'Object') {
      if (value.label) { return; }
      targetValue = value.key;
    } else {
      targetValue = value;
    }
    this.props.dispatch({
      type: 'login/selectLogin',
      payload: targetValue,
    });
  }
  handleSelect = (value) => {
    // console.log('before select');
    this.setState({
      selectId: value,
    });
    // console.log('after select');
  }
  handleOk = () => {
    // 如果压根没有选，那么就当做cancel
    const { selectId } = this.state;
    const { onClose, onOk, list } = this.props;
    if (!selectId) {
      onClose();
      return;
    }
    // console.log('current:', selectId);
    const afterFilter = list.filter(target => humanReadName(target) === selectId.key);
    // console.log('afterFilter:', afterFilter);
    onOk(afterFilter[0]);
  }
  render() {
    const { visible, onClose, list } = this.props;
    const options = (list || [])
      .filter(d => d.enabled && !d.delete)
      .map(d => (
        <Option key={d.id} value={humanReadName(d)}>
          {humanReadName(d)}
        </Option>));
    return (
      <Modal
        title="选择用户"
        visible={visible}
        onOk={this.handleOk}
        onCancel={onClose}
        width={240}
      >
        <Select
          labelInValue
          mode="combobox"
          placeholder="输入手机号码，搜索用户"
          style={{ width: 200 }}
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
        >
          {options}
        </Select>
      </Modal>
    );
  }
}
