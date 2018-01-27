import React, { PureComponent, Fragment } from 'react';
import { Alert, Table, Switch } from 'antd';
import styles from './index.less';

export default class MerchantTable extends PureComponent {
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
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }
  render() {
    const { selectedRowKeys } = this.state;
    const { data: { list, pagination, changingEnableId }, loading, doDelete
      , changeEnabledSupplier, subPageClickSupplier } = this.props;

    // const status = ['关闭', '运行中', '已上线', '异常'];
    // const clickMe = id => () => {
    //   console.log('click me ', id);
    // };

    const columns = [
      {
        title: 'ID',
        dataIndex: 'merchantId',
        render: (value) => {
          return <span onClick={subPageClickSupplier(value)}>{value}</span>;
        },
      },
      {
        title: '登录名',
        dataIndex: 'username',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '联系人',
        dataIndex: 'contact',
      },
      {
        title: '联系电话',
        dataIndex: 'telephone',
      },
      {
        title: '地址',
        dataIndex: 'address',
      },
      {
        title: '激活',
        dataIndex: 'enabled',
        render: (value, obj) => {
          let onChange = null;
          if (changeEnabledSupplier) {
            // 获取改变的方法
            onChange = changeEnabledSupplier(obj.merchantId);
          }
          return (
            <Switch
              onChange={onChange}
              checked={value}
              loading={changingEnableId === obj.merchantId}
            />);
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createtime',
      },
    ];

    if (doDelete) {
      columns.push({
        title: '操作',
        render: (_, record) => (
          <Fragment>
            <a onClick={doDelete(record ? record.id : null)}>删除</a>
            {/* <Divider type="vertical" />
            <a href="">订阅警报</a> */}
          </Fragment>
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
    };

    return (
      <div className={styles.standardTable}>
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
          rowKey="merchantId"
          // rowKey={record => record.key}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}
