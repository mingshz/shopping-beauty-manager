import React, { PureComponent } from 'react';
import { Modal } from 'antd';
// import styles from './index.less';

/**
 * 携带有form的Modal
 * 具体的form内容依然由调用者给予
 * 事件 onOk 将fieldsValue返回
 * 事件 onCancel 需要调用者关闭这个Modal
 * 事件 onFormRender 渲染form内容 可以获得form实例
 */
export default class FormModal extends PureComponent {
  state = {};
  componentWillMount() {
    const { onFormPrepare, form } = this.props;
    if (onFormPrepare) {
      onFormPrepare(form);
    }
  }

  onModalOk = () => {
    const { onOk, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      onOk(fieldsValue);
      // const values = {
      //   ...fieldsValue,
      //   updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      // };
      // onOk(values);
    });
  };


  render() {
    const { title, visible, onFormRender, form, onCancel } = this.props;
    // console.log('my event:', onRowRender);
    return (
      <Modal
        {...this.props}
        title={title}
        visible={visible}
        onCancel={onCancel}
        onOk={this.onModalOk}
      >
        {onFormRender(form)}
      </Modal>
      // <div className={styles.component}>
      //   <Button>Component Sample</Button>
      // </div>
    );
  }
}
