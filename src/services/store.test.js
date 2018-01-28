import { getStore, newStore, updateStoreEnabled } from './store';

describe('项目测试', () => {
  it('获取待审核项目', () => {
    return getStore().then((result) => {
      console.log(result);
    });
  });
  it('新增一个门店', () => {
    return newStore({
      merchantId: 3399,
      loginId: 100,
      name: '中文又如何',
      contact: '联系人',
      telephone: '联系电话',
      address: '地址呢？',
    }).then((rs) => {
      expect(rs).toBe(true);
    });
  });
  it('更变状态', () => {
    return updateStoreEnabled(111, true)
      .then((rs) => {
        expect(rs).toBe(true);
      });
  });
});
