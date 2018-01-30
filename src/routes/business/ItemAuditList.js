
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Modal } from 'antd';
import AbstractTablePage from '../util/AbstractTablePage';
import ItemTable from '../../components/ItemTable/index';

// eslint-disable-next-line
const FormItem = Form.Item;

/**
 * 项目审核列表
 */
@connect(state => ({
  data: state.itemAudit,
}))
export default class ItemAuditList extends PureComponent {
  state = {
    openComment: false,
    comment: '',
    commentTitle: '未知',
    auditType: null,
    auditId: null,
  }
  commentUpdated = (e) => {
    this.setState({
      comment: e.target.value,
    });
  }
  fetchData = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'itemAudit/fetch',
      payload: params,
    });
  }
  bottom = () => {
    const { openComment, comment, commentTitle } = this.state;
    return (
      <Modal
        title={commentTitle}
        visible={openComment}
        onCancel={() => this.setState({ openComment: false })}
        onOk={() => {
          const currentComment = this.state.comment;
          if (!currentComment) {
            this.setState({ openComment: false });
            return;
          }
          const { auditId, auditType } = this.state;
          const { dispatch } = this.props;
          dispatch({
            type: `itemAudit/${auditType}`,
            payload: {
              auditId,
              comment: currentComment,
            },
            callback: () => {
              this.fetchData();
              this.setState({ openComment: false });
            },
          });
        }}
      >
        <Input placeholder="请输入备注" value={comment} onChange={this.commentUpdated} />
      </Modal>
    );
  }
  auditOperation = type => id => () => {
    this.setState({
      openComment: true,
      comment: '',
      commentTitle: type === 'passItem' ? '通过该项目' : '拒绝该项目',
      auditType: type,
      auditId: id,
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

  render() {
    const { data: { loading, data } } = this.props;
    return (
      <AbstractTablePage
        fetchData={this.fetchData}
        data={data}
        loading={loading}
        table={ItemTable}
        renderFormComponent={this.searchForm}
        propsTable={
          {
            auditOperationSupplier: {
              pass: this.auditOperation('passItem'),
              refuse: this.auditOperation('refuseItem'),
            },
          }
        }
        bottom={this.bottom}
      />
    );
  }
}
