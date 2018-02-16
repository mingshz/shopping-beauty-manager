import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Tabs, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import RechargeBatch from './RechargeBatch';
import RechargeCard from './RechargeCard';

// eslint-disable-next-line
const TabPane = Tabs.TabPane;
/**
 * 充值卡管理
 */
@connect(state => ({
  globalInit: state.global.init,
  rechargeBatch: state.rechargeBatch,
  rechargeCard: state.rechargeCard,
}))
export default class Recharge extends PureComponent {
  componentWillMount() {
    this.props.dispatch({
      type: 'global/fetchInit',
    });
  }
  render() {
    const { rechargeBatch, rechargeCard } = this.props;

    return (
      <PageHeaderLayout title="充值卡管理">
        <Tabs defaultActiveKey="1">
          <TabPane tab={<span><Icon type="table" />充值卡批次</span>} key="1">
            <RechargeBatch
              {...this.props}
              data={rechargeBatch}
            />
          </TabPane>
          <TabPane tab={<span><Icon type="database" />充值卡列表</span>} key="2">
            <RechargeCard
              {...this.props}
              data={rechargeCard}
            />
          </TabPane>
        </Tabs>
      </PageHeaderLayout>
    );
  }
}
