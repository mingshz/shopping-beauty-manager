// 虽然放在routes中，其实只是一个组件
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Button, message } from 'antd';
import AbstractTablePage from '../util/AbstractTablePage';
import LoginSelector from '../../components/LoginSelector';
import RechargeBatchTable from '../../components/RechargeBatchTable';
import RechargeBatchCreationFormModal from '../../components/RechargeBatchCreationFormModal';

export default class RechargeBatch extends PureComponent {
    state = {
      /**
       * 显示 loginSelector
       */
      showNewModal: false,
      /**
       * 显示 NewForm modal
       */
      showNewModal2: false,
    }
    sendEmail = id => () => {
      this.props.dispatch({
        type: 'rechargeBatch/send',
        payload: id,
        callback: () => {
          message.info('已重新发送');
        },
      });
    }
    /**
     * 如果是要打开那么我就得先fetch完了 再打开
     */
    updateShowNewModal = (value) => {
      this.setState({
        showNewModal: value,
      });
    }
    doAdd = (item) => {
      this.forLoginClose();
      // salesPrice
      this.props.dispatch({
        type: 'rechargeBatch/add',
        payload: {
          ...item,
          guideId: this.state.selectLogin.id,
        },
        callback: this.fetchData,
      });
    }
    tableListOperator = () => {
      return (
        <Button icon="plus" type="primary" onClick={() => this.updateShowNewModal(true)}>新增批次
        </Button>
      );
    }

    fetchData = (params) => {
      this.props.dispatch({
        type: 'rechargeBatch/fetch',
        payload: params,
      });
    }

    forLoginOk = (login) => {
      this.setState({
        selectLogin: login,
        showNewModal: false,
        showNewModal2: true,
      });
    }
    forLoginClose = () => {
      this.setState({
        showNewModal: false,
        showNewModal2: false,
      });
    }

    bottom = () => {
      // 先选择人，再输入数量和邮箱
      const { showNewModal, showNewModal2 } = this.state;
      const LocalLoginSelector = connect((state) => {
        return {
          list: state.login.select,
        };
      })(LoginSelector);
      return (
        <div>
          <LocalLoginSelector
            visible={showNewModal}
            onClose={this.forLoginClose}
            onOk={this.forLoginOk}
          />
          <RechargeBatchCreationFormModal
            {...this.props}
            visible={showNewModal2}
            onCancel={this.forLoginClose}
            onOk={this.doAdd}
          />
        </div>
      );
    }

    render() {
      const { data: { loading, data } } = this.props;
      return (
        <AbstractTablePage
          cardOnly
          fetchData={this.fetchData}
          bottom={this.bottom}
          tableListOperator={this.tableListOperator}
          data={data}
          loading={loading}
          table={RechargeBatchTable}
        //   renderFormComponent={this.searchForm}
          propsTable={{
            auditOperationSupplier: {
              send: this.sendEmail,
            },
            }}
        />
      );
    }
}
