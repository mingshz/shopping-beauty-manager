import { getAuditItem, passItem, refuseItem, newItem, updateItemEnabled, updateItemRecommended, commitItem } from './item';

describe('项目测试', () => {
  it('获取待审核项目', () => {
    return getAuditItem().then((result) => {
      expect(result.data.length).toBeGreaterThanOrEqual(10);
    });
  });
  it('通过一个项目', () => {
    // const result = JSON.parse('"AUDIT_PASS"');
    return passItem(1111).then((rs) => {
      expect(rs).toBe(true);
    });
  });
  it('通过一个项目', () => {
    return refuseItem(1111).then((rs) => {
      expect(rs).toBe(true);
    });
  });
  it('新增一个项目', () => {
    return newItem({
      merchantId: 3399,
      name: '中文',
      thumbnailUrl: 'http://www.abc.com/xx.png',
      itemType: '消遣',
      price: 200,
      salesPrice: 150,
      costPrice: 100,
      description: 'hello',
      richDescription: '<div>....</div>',
    }).then((rs) => {
      expect(rs).toBe(true);
    });
  });
  it('推荐更变', () => {
    // const result = JSON.parse('"AUDIT_PASS"');
    return updateItemRecommended(123, true).then((rs) => {
      expect(rs).toBe(true);
    });
  });
  it('上下架更变', () => {
    return updateItemEnabled([1, 2, 3], false).then((rs) => {
      expect(rs).toBe(true);
    });
  });
  it('提交审核', () => {
    return commitItem(123, 'ok').then((rs) => {
      expect(rs).toBeTruthy();
    });
  });
});
