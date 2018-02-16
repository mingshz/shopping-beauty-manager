import { getRechargeBatches, newRechargeBatch, sendRechargeBatchInfo } from './rechargeBatch';

describe('充值卡批次管理', () => {
  it('获取批次', () => {
    return getRechargeBatches().then((result) => {
      expect(result.list.length).toBeGreaterThanOrEqual(10);
    });
  });
  it('新增', () => {
    return newRechargeBatch({
      number: 100,
      emailAddress: 'abc@def.com',
      guideId: 9999,
    }).then((rs) => {
      expect(rs).toBeTruthy();
    });
  });
  it('发送邮件通知', () => {
    return sendRechargeBatchInfo(99887).then((rs) => {
      expect(rs).toBeTruthy();
    });
  });
});
