import { updateManageable } from './manager';

// import { getCurrent } from './manager';

describe('演示', () => {
  it('调整权限', () => {
    return updateManageable(123, [])
      .then((rs) => {
        expect(rs).toBeTruthy();
      });
  });
  it('调整权限', () => {
    return updateManageable(123, ['rootGeneral'])
      .then((rs) => {
        expect(rs).toBeTruthy();
      });
  });
});
