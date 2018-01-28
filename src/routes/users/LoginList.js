import React, { PureComponent } from 'react';
// eslint-disable-next-line
import moment from 'moment';
import { connect } from 'dva';
// eslint-disable-next-line
import { List, Card, Form, Row, Col, Radio, Input, Progress, Button, Icon, Dropdown, Menu, Avatar } from 'antd';
import LoginTable from '../..//components/LoginTable';
import styles from './LoginList.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

// eslint-disable-next-line
const RadioButton = Radio.Button;
// eslint-disable-next-line
const RadioGroup = Radio.Group;
// eslint-disable-next-line
const Search = Input.Search;

@connect(state => ({
  data: state.login,
}))
@Form.create()
class LoginList extends PureComponent {
  state = {
    selectedRows: [],
    // formValues: {},
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/fetch',
    });
  }
  fetchData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/fetch',
    });
  }
  updateLoginManageableSupplier = id => (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'manager/updateManageable',
      payload: {
        id,
        target: value,
      },
      callback: this.fetchData,
    });
  }
  changeEnabledSupplier = id => (value) => {
    this.props.dispatch({
      type: 'login/changeEnableTo',
      payload: {
        id,
        target: value,
      },
    });
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'login/fetch',
      payload: params,
    });
  }
  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'login/fetch',
      payload: {},
    });
  }
  handleRemove = id => () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/remove',
      payload: {
        id: [id],
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  }
  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'login/fetch',
        payload: values,
      });
    });
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户编号">
              {getFieldDecorator('loginId')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机号码">
              {getFieldDecorator('mobile')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={16} sm={36}>
            <FormItem label="用户状态">
              {getFieldDecorator('enable')(
                <RadioGroup >
                  <RadioButton value="true">已激活</RadioButton>
                  <RadioButton value="false">未激活</RadioButton>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { data: { loading, data, changingEnableId } } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderLayout title="用户列表">
        <Card bordered={false}>
          <div className={styles.standardList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              {/* <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {
                selectedRows.length > 0 && (
                  <span>
                    <Button>批量操作</Button>
                    <Dropdown overlay={menu}>
                      <Button>
                        更多操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </span>
                )
              } */}
            </div>
            <LoginTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              doDelete={this.handleRemove}
              updateLoginManageableSupplier={this.updateLoginManageableSupplier}
              changeEnabledSupplier={this.changeEnabledSupplier}
              changingEnableId={changingEnableId}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default LoginList;
