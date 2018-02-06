import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import AbstractTablePage from '../util/AbstractTablePage';
import MerchantManagerTable, { levelSet } from '../../components/MerchantManagerTable';
import LoginSelector from '../../components/LoginSelector';
import LevelChooser from '../../components/LevelChooser';

@connect(state => ({
  data: state.merchantManager,
}))
export default class ManagerList extends PureComponent {
  state = {
    /**
     * 开启选择用户
     */
    showNewModal: false,
    openLevelChooser: false,
  }

  bottom = () => {
    const { showNewModal, openLevelChooser } = this.state;
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
        <LevelChooser
          visible={openLevelChooser}
          data={levelSet}
          onOk={this.levelSetDone}
          onCancel={() => this.setState({ openLevelChooser: false })}
        />
      </div>
    );
  }
  levelSetDone = (target) => {
    this.setState({
      openLevelChooser: false,
    });
    this.changeManagerLevel(this.state.loginId, target);
  }
  forLoginOk = (login) => {
    this.setState({
      loginId: login.id,
      showNewModal: false,
      openLevelChooser: true,
    });
  }
  forLoginClose = () => {
    this.setState({
      showNewModal: false,
    });
  }
  forLogin = () => {
    this.setState({
      showNewModal: true,
    });
  }

  fetchData = (params) => {
    const { dispatch } = this.props;
    dispatch({
      merchantId: this.myMerchantId(),
      type: 'merchantManager/fetch',
      payload: params,
    });
  }
  /**
   * 它即可以调整权限，又可以新增管理员；屌炸天了
   */
  changeManagerLevel = (id, target) => {
    this.props.dispatch({
      merchantId: this.myMerchantId(),
      type: 'merchantManager/updateManageable',
      payload: {
        loginId: id,
        level: target,
      },
      callback: this.fetchData,
    });
  }
  revokeManagerSupplier = id => () => {
    this.changeManagerLevel(id, []);
  }
  changeManagerEnabled = (id, target) => {
    this.props.dispatch({
      merchantId: this.myMerchantId(),
      type: 'merchantManager/changeEnableTo',
      payload: {
        id,
        target,
      },
    });
  }
  changeEnabledSupplier = id => (target) => {
    this.changeManagerEnabled(id, target);
  }
  myMerchantId = () => {
    const { match: { params: { merchantId } } } = this.props;
    return parseInt(merchantId, 10);
  }
  tableListOperator = () => {
    return (
      <Button icon="plus" type="primary" onClick={() => this.forLogin()}>新增管理员
      </Button>
    );
  }

  render() {
    const { data: { loading, data, changingEnableId } } = this.props;
    return (
      <AbstractTablePage
        fetchData={this.fetchData}
        data={data}
        loading={loading}
        table={MerchantManagerTable}
        tableListOperator={this.tableListOperator}
        bottom={this.bottom}
        propsTable={
            {
              changeEnabledSupplier: this.changeEnabledSupplier,
              revokeManagerSupplier: this.revokeManagerSupplier,
              changingEnableId,
              changeManagerLevel: this.changeManagerLevel,
            }
        }
      />
    );
  }
}
