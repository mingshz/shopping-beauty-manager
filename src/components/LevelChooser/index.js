import React, { PureComponent } from 'react';
import { Modal, Select } from 'antd';
// eslint-disable-next-line
const Option = Select.Option;
/**
 * 角色选择器，需要给予我有哪些角色可以选；单选或者多选；最后我会告诉你结果
 * visible
 * data 一个对象；key是 value,值是label
 * defaultValue 默认选中的value
 * onOk: 回调会给你选中的结果
 * onCancel: 关闭它
 */
export default class LevelChooser extends PureComponent {
  componentWillMount() {
    this.setState({
      selects: [],
    });
  }
  onOk = () => {
    //
    const { onOk } = this.props;
    const { selects } = this.state;
    onOk(selects || []);
    this.setState({
      selects: [],
    });
  }
  render() {
    const { visible, data, defaultValue, onCancel } = this.props;
    const options = Object.keys(data).map((s) => {
      const label = data[s];
      return <Option key={s}>{label}</Option>;
    });
    return (
      <Modal
        title="选择角色"
        visible={visible}
        onCancel={() => {
          this.setState({
            selects: [],
          });
          onCancel();
        }}
        onOk={this.onOk}
      >
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择要设置的目标角色"
          defaultValue={defaultValue}
          value={this.state.selects}
          onChange={(value) => {
            this.setState({
              selects: value,
            });
          }}
        >
          {options}
        </Select>
      </Modal>
    );
  }
}
