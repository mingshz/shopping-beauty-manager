import React, { PureComponent, Fragment } from 'react';
import { Alert, Table, Switch, Divider } from 'antd';
import LevelChooser from '../../components/LevelChooser';
import styles from './index.less';
import { columnsForSort } from '../../utils/utils';

export default class MerchantManagerTable extends PureComponent {
  state = {
    selectedRowKeys: [],
    openLevelChooser: false,
  };
  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
      });
    }
  }
  levelSetDone = (targets) => {
    const { forID } = this.state;
    const { changeManagerLevel } = this.props;
    changeManagerLevel(forID, targets);
    this.setState({
      openLevelChooser: false,
    });
  }
  openLevelSetChangeFor = id => () => {
    this.setState({
      openLevelChooser: true,
      forID: id,
    });
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
    const { data: { list, pagination }, loading, revokeManagerSupplier
      , changingEnableId } = this.props;

    // const status = ['关闭', '运行中', '已上线', '异常'];
    // const clickMe = id => () => {
    //   console.log('click me ', id);
    // };
    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};

    const originColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        sorter: true,
      },
      {
        title: '登录名',
        dataIndex: 'username',
        sorter: true,
      },
      {
        title: '权限',
        dataIndex: 'level',
      },
      {
        title: '激活',
        dataIndex: 'enabled',
        sorter: true,
        render: (value, obj) => {
          // const onChange = null;
          // if (changeEnabledSupplier) {
          //   // 获取改变的方法
          //   onChange = changeEnabledSupplier(obj.id);
          // }
          return (
            <Switch
              // onChange={onChange}
              checked={value}
              loading={changingEnableId === obj.id}
            />);
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
      },
      // {
      //   title: '权限',
      //   dataIndex: 'authorities',
      //   render: (value) => {
      //     return value.map(str => authorityName(str)).map(name => (<Tag>{name}</Tag>));
      //   },
      // },
    ];

    // eslint-disable-next-line
    const openLevelSetChangeFor = this.openLevelSetChangeFor;
    // 此处可以撤销管理员
    if (revokeManagerSupplier) {
      originColumns.push({
        title: '操作',
        render(value, data) {
          const revoke = revokeManagerSupplier(data.id);
          return (
            <Fragment>
              <a onClick={revoke}>撤销</a>
              <Divider type="horizontal" />
              <a onClick={openLevelSetChangeFor(data.id)}>调整
              </a>
            </Fragment>
          );
        },
      });
    }

    const columns = columnsForSort(originColumns, sortedInfo);

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

    const { openLevelChooser } = this.state;

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
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
        <LevelChooser
          visible={openLevelChooser}
          data={levelSet}
          onOk={this.levelSetDone}
          onCancel={() => this.setState({ openLevelChooser: false })}
        />
      </div>
    );
  }
}

export const levelSet = {
  merchantItemManager: '门店项目负责人',
  merchantSettlementManager: '结算负责人',
};
