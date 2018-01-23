import { checkPermissions } from './CheckPermissions.js';

const target = 'ok';
const error = 'error';

describe('test CheckPermissions', () => {
  it('Correct string permission authentication', () => {
    expect(checkPermissions('user', 'user', target, error)).toEqual('ok');
  });
  it('Correct string permission authentication', () => {
    expect(checkPermissions('user', 'NULL', target, error)).toEqual('error');
  });
  it('authority is undefined , return ok', () => {
    expect(checkPermissions(null, 'NULL', target, error)).toEqual('ok');
  });
  it('Wrong string permission authentication', () => {
    expect(checkPermissions('admin', 'user', target, error)).toEqual('error');
  });
  it('Correct Array permission authentication', () => {
    expect(checkPermissions(['user', 'admin'], 'user', target, error)).toEqual(
      'ok'
    );
  });
  it('Wrong Array permission authentication,currentAuthority error', () => {
    expect(
      checkPermissions(['user', 'admin'], 'user,admin', target, error)
    ).toEqual('error');
  });
  it('Wrong Array permission authentication', () => {
    expect(checkPermissions(['user', 'admin'], 'guest', target, error)).toEqual(
      'error'
    );
  });
  it('Wrong Function permission authentication', () => {
    expect(checkPermissions(() => false, 'guest', target, error)).toEqual(
      'error'
    );
  });
  it('Correct Function permission authentication', () => {
    expect(checkPermissions(() => true, 'guest', target, error)).toEqual('ok');
  });
  // 增加数组测试
  it('已获得数组权限，则若依赖权限也为数组可以正常排除', () => {
    expect(checkPermissions(['user', 'admin'], ['role1', 'role2'], target, error)).toEqual(
      'error'
    );
  });
  it('已获得数组权限，则若依赖权限也为数组可以正常获得', () => {
    expect(checkPermissions(['user', 'admin'], ['user', 'role2'], target, error)).toEqual(
      'ok'
    );
  });
  it('已获得数组权限，则若依赖权限也为数组可以正常获得', () => {
    expect(checkPermissions(['user', 'admin'], ['admin', 'role2'], target, error)).toEqual(
      'ok'
    );
  });
  it('已获得字符串权限，则若依赖权限也为数组可以正常排除', () => {
    expect(checkPermissions('user', ['role1', 'role2'], target, error)).toEqual(
      'error'
    );
  });
  it('已获得字符串权限，则若依赖权限也为数组可以正常获得', () => {
    expect(checkPermissions('user', ['user', 'role2'], target, error)).toEqual(
      'ok'
    );
  });
});
