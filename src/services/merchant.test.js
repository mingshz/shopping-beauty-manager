import { getMerchant, newMerchant, updateEnabled } from './merchant';
import { mockAddress } from '../../tests/common';


describe('商户测试', () => {
  it('获取商户', () => {
    return getMerchant().then((result) => {
      expect(result.list.length).toBeGreaterThanOrEqual(10);
    });
  });
  it('新增一个商户', () => {
    return newMerchant({
      loginId: 100,
      name: '中文又如何',
      contact: '联系人',
      telephone: '联系电话',
      address: mockAddress(),
    }).then((rs) => {
      expect(rs).toBe(true);
    });
  });
  it('更变状态', () => {
    return updateEnabled(111, false)
      .then((rs) => {
        expect(rs).toBe(true);
      });
  });
  it('更变状态2', () => {
    return updateEnabled(111, true)
      .then((rs) => {
        expect(rs).toBe(true);
      });
  });
});
