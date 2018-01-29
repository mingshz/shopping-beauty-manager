// 虽然放在routes中，其实只是一个组件
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Button } from 'antd';
import LoginSelector from '../../components/StoreSelector/index';
import RepresentTable from '../../components/RepresentTable/index';
import AbstractTablePage from '../util/AbstractTablePage';


export default class StoreRepresent extends PureComponent {
  state = {
    showNewModal: false,
  }

  bottom = () => {
    const { showNewModal } = this.state;
    const LocalLoginSelector = connect((state) => {
      return {
        list: state.login.select,
      };
    })(LoginSelector);
    return (
      <LocalLoginSelector
        visible={showNewModal}
        onClose={this.forLoginClose}
        onOk={this.forLoginOk}
      />
    );
  }

  changeEnabledSupplier = id => (value) => {
    const { current } = this.props;
    this.props.dispatch({
      type: 'storeRepresent/changeEnableTo',
      payload: {
        id,
        target: value,
        store: current.id,
      },
    });
  }

  forLoginOk = (login) => {
    const { current } = this.props;
    this.props.dispatch({
      type: 'storeRepresent/creationLoginSelected',
      payload: login,
    });
    this.forLoginClose();
    this.props.dispatch({
      type: 'storeRepresent/add',
      payload: {
        login: login.id,
        store: current.id,
      },
      callback: this.fetchData,
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
  tableListOperator = () => {
    return (
      <Button icon="plus" type="primary" onClick={() => this.forLogin()}>新增
      </Button>
    );
  }

  fetchData = (params) => {
    const { dispatch } = this.props;
    const { current } = this.props;
    dispatch({
      type: 'storeRepresent/fetch',
      payload: {
        ...params,
        store: current.id,
      },
    });
  }

  deleteRPSupplier = id => () => {
    const { current } = this.props;
    this.props.dispatch({
      type: 'storeRepresent/deleteOne',
      payload: {
        store: current.id,
        id,
      },
    });
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
        table={RepresentTable}
        propsTable={{
          changeEnabledSupplier: this.changeEnabledSupplier,
          doDelete: this.deleteRPSupplier,
          // subPageClickSupplier: this.subPageClickSupplier,
        }}
        // creationTitle="新增商户"
        // creationRender={this.onCreateRender}
        // creationAction={this.doAdd}
        // creationProps={{
        //   confirmLoading: changing,
        // }}
      // 此处情况比较复杂，我们意图将这些值绑定在model中
      // creationProps={{
      //   data: creation,
      // }}
      // creationFormOptions={{
      //   mapPropsToFields: (props) => {
      //     console.log('creationFormOptions', props);
      //     return {
      //       loginId: Form.createFormField(props.data.id),
      //     };
      //   },
      // }}
      />
    );
  }
}
