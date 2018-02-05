import React, { PureComponent, Fragment } from 'react';
import { Alert, Table, Switch, Tag, Divider } from 'antd';
import LevelChooser from '../../components/LevelChooser';
import styles from './index.less';
import { authorityName } from '../../services/manager';

export default class ManagerTable extends PureComponent {
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
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }
  render() {
    const { selectedRowKeys } = this.state;
    const { data: { list, pagination }, loading, doDelete, revokeManagerSupplier } = this.props;

    // const status = ['关闭', '运行中', '已上线', '异常'];
    // const clickMe = id => () => {
    //   console.log('click me ', id);
    // };

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        // render: (value) => {
        //   return <span onClick={subPageClickSupplier(value)}>{value}</span>;
        // },
      },
      {
        title: '登录名',
        dataIndex: 'username',
      },
      {
        title: '昵称',
        dataIndex: 'nickName',
      },
      // {
      //   title: '联系人',
      //   dataIndex: 'contact',
      // },
      // {
      //   title: '联系电话',
      //   dataIndex: 'telephone',
      // },
      // {
      //   title: '地址',
      //   dataIndex: 'address',
      // },
      // "merchantId": 0,
      // "storeId": 0,
      {
        title: '激活',
        dataIndex: 'enabled',
        render: (value) => {
          // let onChange = null;
          // if (changeEnabledSupplier) {
          //   // 获取改变的方法
          //   onChange = changeEnabledSupplier(obj.merchantId);
          // }
          return (
            <Switch
              // onChange={onChange}
              checked={value}
              // loading={changingEnableId === obj.merchantId}
            />);
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '权限',
        dataIndex: 'authorities',
        render: (value) => {
          return value.map(str => authorityName(str)).map(name => (<Tag>{name}</Tag>));
        },
      },
    ];

    // eslint-disable-next-line
    const openLevelSetChangeFor = this.openLevelSetChangeFor;
    // 此处可以撤销管理员
    if (revokeManagerSupplier) {
      columns.push({
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
          data={{
          rootGeneral: '主管',
          rootSettlementManager: '结算专员',
          rootItemManager: '项目管理专员',
          rootMerchantManager: '商户管理专员',
        }}
          onOk={this.levelSetDone}
          onCancel={() => this.setState({ openLevelChooser: false })}
        />
      </div>
    );
  }
}
