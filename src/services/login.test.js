import { getLogin, updateEnabled } from './login';

describe('用户测试', () => {
  it('获取用户', () => {
    return getLogin().then((result) => {
      expect(result.list.length).toBeGreaterThanOrEqual(10);
    });
  });
  it('设置激活', () => {
    return updateEnabled(33997, true).then((rs) => {
      expect(rs).toBeTruthy();
    });
  });
  it('设置激活2', () => {
    return updateEnabled(33997, false).then((rs) => {
      expect(rs).toBeTruthy();
    });
  });
});
