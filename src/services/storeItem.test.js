import { getStoreItem, updateStoreItemRecommended, updateStoreItemEnabled, newStoreItem } from './storeItem';

describe('门店项目测试', () => {
  it('获取门店项目', () => {
    return getStoreItem({
      storeId: 3399,
    }).then((result) => {
      expect(result.list.length).toBeGreaterThanOrEqual(10);
    });
  });
  it('推荐更变', () => {
    // const result = JSON.parse('"AUDIT_PASS"');
    return updateStoreItemRecommended(123, true).then((rs) => {
      expect(rs).toBeTruthy();
    });
  });
  it('上下架更变', () => {
    return updateStoreItemEnabled([1, 2, 3], false).then((rs) => {
      expect(rs).toBeTruthy();
    });
  });
  it('新增一个门店项目', () => {
    return newStoreItem(1, 2, 200).then((rs) => {
      expect(rs).toBeTruthy();
    });
  });
});
