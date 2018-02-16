import { getRechargeCards } from './rechargeCard';

describe('充值卡管理', () => {
  it('获取充值卡', () => {
    return getRechargeCards().then((result) => {
      expect(result.list.length).toBeGreaterThanOrEqual(10);
    });
  });
});
