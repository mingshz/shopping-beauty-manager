import React, { PureComponent } from 'react';
import { Alert, Table, Menu, Button, Dropdown, Icon } from 'antd';
import styles from './index.less';
import { columnsForSort } from '../../utils/utils';

/**
 * 为了2者都可用
 * 引入tableRowSelectionProps
 */
export default class RechargeBatchTable extends PureComponent {
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
      // filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }
  render() {
    const { selectedRowKeys } = this.state;
    const { data: { list, pagination }, loading, doDelete
      , subPageClickSupplier, tableRowSelectionProps
      , auditOperationSupplier } = this.props;
    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};

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
        title: '创建日期',
        dataIndex: 'createTime',
        sorter: true,
      },
      {
        title: '总金额',
        dataIndex: 'total',
        sorter: true,
      },
      {
        title: '处理者',
        dataIndex: 'manager',
        sorter: true,
      },
      {
        title: '分享者',
        dataIndex: 'guide',
        sorter: true,
      },
      {
        title: '分享者邮箱',
        dataIndex: 'emailAddress',
        sorter: true,
      },
    ];

    // auditOperationSupplier
    if (doDelete || auditOperationSupplier) {
      // 给一个id 就可以获得一个 Dropdown
      const actionGenerator = (record) => {
        const itemGenerator = (name, onClick) => () => {
          return (
            <Menu.Item>
              <Button onClick={onClick(record.id)}>{name}</Button>
            </Menu.Item>
          );
        };
        const items = [];
        if (doDelete) {
          items.push(itemGenerator('删除', doDelete));
        }
        if (auditOperationSupplier) {
          if (auditOperationSupplier.send) { items.push(itemGenerator('重发', auditOperationSupplier.send)); }
        }

        const menu = (
          <Menu>
            {items.map(g => g())}
          </Menu>
        );
        return (
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link">
              操作<Icon type="down" />
            </a>
          </Dropdown>
        );
      };
      columns.push({
        title: '操作',
        render: (_, record) => (
          actionGenerator(record)
        ),
      });
    }

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
