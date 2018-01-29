// 虽然放在routes中，其实只是一个组件
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Button } from 'antd';
import AbstractTablePage from '../util/AbstractTablePage';
import ItemSelector from '../../components/ItemSelector';
import ItemTable from '../../components/ItemTable/index';

export default class StoreItem extends PureComponent {
    state = {
      showNewModal: false,
    }
    /**
     * 如果是要打开那么我就得先fetch完了 再打开
     */
    updateShowNewModal = (value) => {
      this.setState({
        showNewModal: value,
      });
      if (value) {
        this.props.dispatch({
          type: 'item/fetch',
          payload: this.fixedItemParams(),
        });
      }
    }
    /**
     * 用于搜索项目的固定参数
     */
    fixedItemParams = () => {
      const { merchantId } = this.props;
      return {
        merchantId,
        enabled: true,
      };
    }
    doCreateItem = (item) => {
      this.updateShowNewModal(false);
      const { current: { id } } = this.props;
      // salesPrice
      this.props.dispatch({
        type: 'storeItem/add',
        payload: {
          store: id,
          item: item.id,
          price: item.salesPrice,
        },
      });
    }
    tableListOperator = () => {
      return (
        <Button icon="plus" type="primary" onClick={() => this.updateShowNewModal(true)}>引入
        </Button>
      );
    }

    fetchData = (params) => {
      const { dispatch, current: { id } } = this.props;
      dispatch({
        type: 'storeItem/fetch',
        payload: {
          ...params,
          storeId: id,
        },
      });
    }

    bottom = () => {
      const { showNewModal } = this.state;
      const LocalItemSelector = connect((state) => {
        return {
          data: state.item,
        };
      })(ItemSelector);
      return (
        <LocalItemSelector
          fixedParams={this.fixedItemParams()}
          visible={showNewModal}
          onOk={this.doCreateItem}
          onCancel={() => this.updateShowNewModal(false)}
        />
      );
    }

    changeEnabledSupplier = id => (value) => {
      this.props.dispatch({
        type: 'storeItem/changeEnableTo',
        payload: {
          id,
          target: value,
        },
      });
    }

    render() {
      // changing
      const { data: { loading, data } } = this.props;
      return (
        <AbstractTablePage
          cardOnly
          fetchData={this.fetchData}
          bottom={this.bottom}
          tableListOperator={this.tableListOperator}
          data={data}
          loading={loading}
          table={ItemTable}
        //   renderFormComponent={this.searchForm}
          propsTable={{
              storeMode: true,
              changeEnabledSupplier: this.changeEnabledSupplier,
            }}
        />
      );
    }
}
