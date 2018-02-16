import React, { PureComponent } from 'react';
import { Alert, Table, Switch } from 'antd';
import styles from './index.less';
import { columnsForSort } from '../../utils/utils';

/**
 * 为了2者都可用
 * 引入tableRowSelectionProps
 */
export default class RechargeCardTable extends PureComponent {
  state = {
    selectedRowKeys: [],
  };
  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
      });
    }
  }
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    // const totalCallNo = selectedRows.reduce((sum, val) => {
    //   return sum + parseFloat(val.callNo, 10);
    // }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }
  render() {
    const { selectedRowKeys } = this.state;
    const { data: { list, pagination }, loading
      , subPageClickSupplier, tableRowSelectionProps,
    } = this.props;
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    // console.log('filteredInfo:', filteredInfo);
    // colSpan
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        sorter: true,
        render: (value) => {
          if (!subPageClickSupplier) { return value; }
          return <span onClick={subPageClickSupplier(value)}>{value}</span>;
        },
      },
      {
        title: '卡密',
        dataIndex: 'code',
        sorter: true,
      },
      {
        title: '面额',
        dataIndex: 'amount',
        sorter: true,
      },
      {
        title: '已使用',
        dataIndex: 'used',
        sorter: true,
        filterMultiple: false,
        filters: [
          { text: '未使用', value: 'false' },
          { text: '已使用', value: 'true' },
        ],
        filteredValue: filteredInfo.used,
        render: (value) => {
          return <Switch disabled checked={value} />;
        },
      },
      {
        title: '使用者',
        dataIndex: 'user',
        sorter: true,
      },
      {
        title: '使用时间',
        dataIndex: 'usedTime',
        sorter: true,
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
      ...tableRowSelectionProps,
    };

    return (
      <div className={styles.standardTable} >
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                {/* 服务调用总计 <span style={{ fontWeight: 600 }}>{totalCallNo}</span> 万 */}
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey="id"
          // rowKey={record => record.key}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columnsForSort(columns, sortedInfo)}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}
