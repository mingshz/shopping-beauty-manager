import { getManager, newManager, updateEnabled } from './merchantManager';


describe('商户管理员测试', () => {
  it('获取管理员测试', () => {
    return getManager(3399).then((result) => {
      expect(result.list.length).toBeGreaterThanOrEqual(10);
    });
  });
  it('新增管理员', () => {
    return newManager(3399, {
      loginId: 9988,
    }).then((rs) => {
      expect(rs).toBeTruthy();
    });
  });
  it('更新状态', () => {
    return updateEnabled(3399, 9988, true).then((rs) => {
      expect(rs).toBeTruthy();
    });
  });
  it('更新状态2', () => {
    return updateEnabled(3399, 9988, false).then((rs) => {
      expect(rs).toBeTruthy();
    });
  });
});
