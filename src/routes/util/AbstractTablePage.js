import React, { PureComponent } from 'react';
import { Card, Form, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FormModal from '../../components/FormModal';
import styles from './AbstractTablePage.less';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

/**
 * 抽象的列表页面
 * 支持props
 * propsForm object 可选 给form更多的参数
 * renderFormComponent function 可选 渲染form内部
 * fetchData function 必选 请求获取数据
 * data object 必选 获取当前数据，结果结构为{list,pagination}
 * loading boolean 必选 获取当前loading状态
 * table class 必选 获取table的实现类
 * propsLayout object 可选 给layou更多参数
 * propsTable object 可选 给table更多参数
 * creationFormOptions object https://ant.design/components/form-cn/#Form.create(options)
 * creationTitle string 可选 创建新的表单的标题
 * creationRender function 可选 创建新的表单的渲染器
 * creationPrepare function 可选 渲染新的表单之前
 * creationAction function 可选 执行新增
 * creationProps object 可选 form的其他补充属性
 * bottom function 可选下方拓展
 * 具备selectedRows的功能
 */
@Form.create()
export default class AbstractTablePage extends PureComponent {
    state = {
      selectedRows: [],
      formValues: {},
      modalVisible: false,
    };
    componentDidMount() {
      const { fetchData } = this.props;
      fetchData();
    }
    // 隐藏or显示Modal
    handleModalVisible = (flag) => {
      this.setState({
        modalVisible: !!flag,
      });
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
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

      const { fetchData } = this.props;
      fetchData(params);
    }

    handleSelectRows = (rows) => {
      this.setState({
        selectedRows: rows,
      });
    }
    handleFormReset = () => {
      const { form, fetchData } = this.props;
      form.resetFields();
      this.setState({
        formValues: {},
      });
      fetchData({});
    }
    handleSearch = (e) => {
      e.preventDefault();

      const { form, fetchData } = this.props;

      form.validateFields((err, fieldsValue) => {
        if (err) return;

        const values = {
          ...fieldsValue,
          updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        };

        this.setState({
          formValues: values,
        });

        fetchData(values);
      });
    }

    renderForm() {
      const { propsForm, renderFormComponent } = this.props;
      if (!renderFormComponent) {
        return;
      }
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.handleSearch} layout="inline" {...propsForm}>
          {renderFormComponent(getFieldDecorator, () => (
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>))}
        </Form>
      );
    }

    render() {
      const { selectedRows, modalVisible } = this.state;
      const { data, loading, table, propsLayout, propsTable, bottom, creationTitle, creationRender
        , creationAction, creationPrepare, creationFormOptions, creationProps
        , cardOnly, tableOnly, tableListOperator } = this.props;
      const myAction = (formData) => {
        return creationAction(formData, () => {
          this.handleModalVisible(false);
        });
      };
      const Table = table;
      const creation = creationTitle && creationRender && creationAction;
      let LocalFormModal;
      if (creation) {
        LocalFormModal = Form.create(creationFormOptions || {})(FormModal);
      }

      const tableResult = (
        <Table
          selectedRows={selectedRows}
          loading={loading}
          data={data}
          onSelectRow={this.handleSelectRows}
          onChange={this.handleStandardTableChange}
                // doDelete={this.handleRemove}
          {...propsTable}
        />
      );
      if (tableOnly) {
        return tableResult;
      }

      const cardResult = (
        <Card bordered={false}>
          <div className={styles.standardList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              {creation ? (
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>新建
                </Button>) : null}
              {tableListOperator ? tableListOperator() : null}
              {/*

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
            {tableResult}
          </div>
        </Card>
      );

      const allResult = (
        <div>
          {cardResult}
          {creation ? (
            <LocalFormModal
              {...creationProps}
              title={creationTitle}
              visible={modalVisible}
              onFormRender={creationRender}
              onFormPrepare={creationPrepare}
              onCancel={() => this.handleModalVisible()}
              onOk={myAction}
            />
          ) : null }
          {bottom ? bottom() : null}
        </div>
      );

      if (cardOnly) {
        return allResult;
      }

      return (
        <PageHeaderLayout {...propsLayout}>
          {allResult}
        </PageHeaderLayout>
      );
    }
}
