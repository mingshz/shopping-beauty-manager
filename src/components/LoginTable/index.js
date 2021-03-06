import React, { PureComponent } from 'react';
import { Alert, Table, Switch, Avatar } from 'antd';
import styles from './index.less';
import { columnsForSort } from '../../utils/utils';
import Authorized from '../Authorized/Authorized';
import { AuthorityRoot } from '../../services/manager';

export default class LoginTable extends PureComponent {
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
    const { data: { list, pagination }, loading
      , changeEnabledSupplier, changeGuidableSupplier, changingEnableId } = this.props;
      // updateLoginManageableSupplier,
    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};

    // const status = ['关闭', '运行中', '已上线', '异常'];

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        sorter: true,
      },
      {
        title: '手机号码',
        dataIndex: 'mobile',
        sorter: true,
      },
      {
        title: '姓氏',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: '昵称',
        dataIndex: 'wxNickName',
        sorter: true,
      },
      {
        title: '头像',
        dataIndex: 'avatar',
        render: (value) => {
          return <Avatar size="small" className={styles.avatar} src={value} />;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
      },
      {
        title: '余额',
        dataIndex: 'balance',
        sorter: true,
      },
      {
        title: '激活',
        dataIndex: 'enabled',
        sorter: true,
        render: (value, obj) => {
          let onChange = null;
          if (changeEnabledSupplier) {
            // 获取改变的方法
            onChange = changeEnabledSupplier(obj.id);
          }
          return (
            <Switch
              onChange={onChange}
              checked={value}
              loading={changingEnableId === obj.id}
            />);
        },
      },
      {
        title: '可推荐',
        dataIndex: 'guidable',
        sorter: true,
        render: (value, obj) => {
          let onChange = null;
          if (changeEnabledSupplier) {
            // 获取改变的方法
            onChange = changeGuidableSupplier(obj.id);
          }
          return (
            <Authorized
              authority={AuthorityRoot}
              noMatch={(
                <Switch checked={value} disable={false} />
              )}
            >
              <Switch
                onChange={onChange}
                checked={value}
              />
            </Authorized>
          );
        },
      },
    ];
    // 设置了 动作才给予响应
    // manageable
    // if (updateLoginManageableSupplier) {
    //   // 如果有权限就给，不然就不给
    //   columns.push({
    //     title: '可管理',
    //     dataIndex: 'manageable',
    //     render: (value, data) => {
    //       const oc = updateLoginManageableSupplier(data.id);
    //       return (
    //         <Authorized
    //           authority={AuthorityRoot}
    //           noMatch={(
    //             <Switch checked={value} disable={false} />
    //           )}
    //         >
    //           <Switch checked={value} onChange={oc} />
    //         </Authorized>
    //       );
    //     },
    //   });
    // }

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
