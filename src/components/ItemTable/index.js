import React, { PureComponent } from 'react';
import { Alert, Table, Switch, Avatar, Menu, Button, Dropdown, Icon } from 'antd';
import styles from './index.less';
import { shouldCommit } from '../../services/item';
import { columnsForSort } from '../../utils/utils';

/**
 * 为了2者都可用
 * 引入tableRowSelectionProps
 */
export default class ItemTable extends PureComponent {
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
    const { data: { list, pagination, changingEnableId }, loading, doDelete
      , changeEnabledSupplier, subPageClickSupplier, tableRowSelectionProps
      , simpleMode, storeMode, merchantMode, auditOperationSupplier } = this.props;
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
        title: '图片',
        dataIndex: 'thumbnailUrl',
        render: (value) => {
          return <Avatar size="small" src={value} />;
        },
      },
      {
        title: '名称',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: '类型',
        dataIndex: 'itemType',
        sorter: true,
      },
      {
        title: '商户',
        dataIndex: 'merchantName',
        sorter: true,
      },
      {
        title: '原价',
        dataIndex: 'price',
        sorter: true,
      },
      {
        title: '销售价',
        dataIndex: 'salesPrice',
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
        title: '推荐',
        dataIndex: 'recommended',
        sorter: true,
        render: (value) => {
          return <Switch disabled checked={value} />;
          // let onChange = null;
          // if (changeEnabledSupplier) {
          //   // 获取改变的方法
          //   onChange = changeEnabledSupplier(obj.id);
          // }
          // return (
          //   <Switch
          //     onChange={onChange}
          //     checked={value}
          //     loading={changingEnableId === obj.id}
          //   />);
        },
      },
      {
        title: '审核状态',
        dataIndex: 'auditStatus',
        sorter: true,
      },
    ].filter(c => !simpleMode
      || c.title === '图片'
      || c.title === '名称'
      || c.title === '类型'
      || c.title === '原价'
      || c.title === '销售价'
    ).filter(c => !storeMode
      || c.title === 'ID'
      || c.title === '名称'
      || c.title === '激活'
      || c.title === '推荐'
      || c.title === '原价'
      || c.title === '销售价'
    ).filter(c => !merchantMode
      || c.title === 'ID'
      || c.title === '图片'
      || c.title === '名称'
      || c.title === '类型'
      || c.title === '激活'
      || c.title === '推荐'
      || c.title === '原价'
      || c.title === '销售价'
      || c.title === '审核状态'
    );

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
          if (auditOperationSupplier.pass) { items.push(itemGenerator('通过', auditOperationSupplier.pass)); }
          if (auditOperationSupplier.refuse) { items.push(itemGenerator('拒绝', auditOperationSupplier.refuse)); }
          if (auditOperationSupplier.commit && shouldCommit(record)) { items.push(itemGenerator('提交审核', auditOperationSupplier.commit)); }
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
