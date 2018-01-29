import { connect } from 'dva';
import { Redirect } from 'dva/router';
import React, { PureComponent } from 'react';
import { Tabs, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StoreRepresent from './StoreRepresent';
import StoreItem from './StoreItem';

// eslint-disable-next-line
const TabPane = Tabs.TabPane;
/**
 * 门店详情
 * 提供基本情况介绍
 * 以及项目以及操作员的相关信息
 */
@connect(state => ({
  storeItem: state.storeItem,
  storeRepresent: state.storeRepresent,
  current: state.store.currentStore,
}))
export default class StoreDetail extends PureComponent {
    myMerchantId = () => {
      const { match: { params: { merchantId } } } = this.props;
      return parseInt(merchantId, 10);
    }

    render() {
      const { current } = this.props;
      // 若是直接路由而至，那么强行跳过去
      if (!current) {
        return <Redirect exact to={`/merchant/${this.myMerchantId()}/store`} />;
      }

      const { storeItem, storeRepresent } = this.props;

      return (
        <PageHeaderLayout title={current.name}>
          <Tabs>
            {/* defaultActiveKey="2" */}
            <TabPane tab={<span><Icon type="table" />项目</span>} key="1">
              <StoreItem
                {...this.props}
                merchantId={this.myMerchantId()}
                data={storeItem}
              />
            </TabPane>
            <TabPane tab={<span><Icon type="team" />代表</span>} key="2">
              <StoreRepresent
                {...this.props}
                merchantId={this.myMerchantId()}
                data={storeRepresent}
              />
            </TabPane>
          </Tabs>
        </PageHeaderLayout>
      );
    }
}
