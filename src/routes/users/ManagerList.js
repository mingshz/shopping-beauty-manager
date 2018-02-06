
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
import AbstractTablePage from '../util/AbstractTablePage';
import ManagerTable, { levelSet } from '../../components/ManagerTable';
import LoginSelector from '../../components/LoginSelector';
import LevelChooser from '../../components/LevelChooser';

// eslint-disable-next-line
const FormItem = Form.Item;

@connect(state => ({
  data: state.manager,
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
      type: 'manager/fetch',
      payload: params,
    });
  }
  changeManagerLevel = (id, target) => {
    this.props.dispatch({
      type: 'manager/updateManageable',
      payload: {
        id,
        target,
      },
      callback: this.fetchData,
    });
  }
  revokeManagerSupplier = id => () => {
    this.props.dispatch({
      type: 'manager/updateManageable',
      payload: {
        id,
        target: [],
      },
      callback: this.fetchData,
    });
  }
  searchForm = (getFieldDecorator, buttons) => {
    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <Form.Item label="关键字">
            {getFieldDecorator('username')(
              <Input placeholder="请输入" />
            )}
          </Form.Item>
        </Col>
        <Col md={8} sm={24}>
          {buttons()}
        </Col>
      </Row>);
  }
  tableListOperator = () => {
    return (
      <Button icon="plus" type="primary" onClick={() => this.forLogin()}>新增管理员
      </Button>
    );
  }

  render() {
    const { data: { loading, data } } = this.props;
    return (
      <AbstractTablePage
        fetchData={this.fetchData}
        data={data}
        loading={loading}
        table={ManagerTable}
        renderFormComponent={this.searchForm}
        tableListOperator={this.tableListOperator}
        bottom={this.bottom}
        propsTable={
          {
            revokeManagerSupplier: this.revokeManagerSupplier,
            changeManagerLevel: this.changeManagerLevel,
          }
        }
      />
    );
  }
}
