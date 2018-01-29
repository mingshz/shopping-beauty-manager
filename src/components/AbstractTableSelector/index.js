import React, { PureComponent } from 'react';
// import { connect } from 'dva';
import { Modal } from 'antd';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

/**
 * 建立一个基于Table的选择器标准！
 * 如果参数中传入了fixedParams 则查询必须传入以上参数
 */
export default class AbstractTableSelector extends PureComponent {
  state = {
    selectedRows: [],
  }
  // fetchType String
  // width title
  // //// 要求的props
  fetchData = (params) => {
    const { dispatch, fetchType, fixedParams } = this.props;
    dispatch({
      type: fetchType,
      payload: {
        ...params,
        ...fixedParams,
      },
    });
  }

  handleOk = () => {
    // 如果压根没有选，那么就当做cancel
    const { selectedRows } = this.state;
    const { onCancel, onOk } = this.props;
    if (!selectedRows || selectedRows.length === 0) {
      onCancel();
      return;
    }
    onOk(selectedRows[0]);
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.fetchData(params);
  }

  render() {
    const { selectedRows } = this.state;
    const { data: { loading, data }, table } = this.props;
    // const { visible, onClose } = this.props;
    const DataTable = table;
    return (
      <Modal
        {...this.props}
        onOk={this.handleOk}
      >
        <DataTable
          simpleMode
          tableRowSelectionProps={{
          hideDefaultSelections: true,
          type: 'radio',
        }}
          selectedRows={selectedRows}
          loading={loading}
          data={data}
          onSelectRow={this.handleSelectRows}
          onChange={this.handleStandardTableChange}
        />
      </Modal>
    );
  }
}
