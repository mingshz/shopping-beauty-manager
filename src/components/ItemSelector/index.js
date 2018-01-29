import React, { PureComponent } from 'react';
// import { connect } from 'dva';
// import { Modal, Select } from 'antd';
// import { humanReadName } from '../../services/login';
import ItemTable from '../ItemTable';
import AbstractTableSelector from '../AbstractTableSelector';
// const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

/**
 * 建立一个基于Table的选择器标准！
 * 如果参数中传入了fixedParams 则查询必须传入以上参数
 */
export default class ItemSelector extends PureComponent {
  render() {
    return (
      <AbstractTableSelector
        fetchType="item/fetch"
        title="选择项目"
        width={720}
        table={ItemTable}
        {...this.props}
      />
    );
  }
}
