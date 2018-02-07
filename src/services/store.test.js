import { getStore, newStore, updateStoreEnabled, getStoreRepresent, newStoreRepresent, deleteStoreRepresent, updateStoreRepresent } from './store';
import { mockAddress } from '../../tests/common';

describe('门店测试', () => {
  it('获取门店', () => {
    return getStore().then((result) => {
      expect(result.list.length).toBeGreaterThanOrEqual(10);
    });
  });
  it('新增一个门店', () => {
    return newStore({
      merchantId: 3398,
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
    return updateStoreEnabled(111, false)
      .then((rs) => {
        expect(rs).toBe(true);
      });
  });
  it('获取门店代表', () => {
    return getStoreRepresent(3388).then((result) => {
      expect(result.data.length).toBeGreaterThanOrEqual(10);
    });
  });
  it('新增门店代表', () => {
    return newStoreRepresent(3388, 1000).then(
      rs => expect(rs).toBeTruthy()
    );
  });
  it('更新门店代表', () => {
    return updateStoreRepresent(3388, 1000, false).then(
      rs => expect(rs).toBeTruthy()
    );
  });
  it('删除门店代表', () => {
    return deleteStoreRepresent(3388, 1000).then(
      rs => expect(rs).toBeTruthy()
    );
  });
});
