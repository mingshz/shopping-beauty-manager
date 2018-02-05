import { AuthorityRoot, AuthorityPlatformMerchantManage, AuthorityMerchantOwner, AuthorityMerchantItem, AuthorityMerchantStore, AuthorityPlatformItemAudit } from '../services/manager';
import { getLocalMerchantId } from '../utils/authorityStorage';

/**
 * 若是登录了关联商户的角色，则可以直接路由至特定商户的路由
 */
function toMerchantId() {
  const merchantId = getLocalMerchantId();
  if (!merchantId) { return ':merchantId'; }
  return merchantId;
}

const menuData = [{
  name: '首页',
  icon: 'welcome',
  path: 'index',
}, {
  name: '用户管理',
  icon: 'user',
  path: 'users',
  authority: [AuthorityRoot, AuthorityPlatformMerchantManage],
  children: [{
    name: '管理员',
    path: 'manager',
  }, {
    name: '用户',
    path: 'login',
  }, {
    name: '商户',
    path: 'merchant',
  }],
}, {
  name: '业务管理',
  icon: 'schedule',
  path: 'business',
  authority: [AuthorityRoot, AuthorityPlatformItemAudit],
  children: [{
    name: '项目审核',
    path: 'itemAudit',
    authority: [AuthorityRoot, AuthorityPlatformItemAudit],
  }],
}, {
  name: '商户管理',
  icon: 'solution',
  path: `merchant/${toMerchantId()}`, // 在获取关联商户之后 改成商户号 则可以稳稳地静态渲染了
  authority: [AuthorityMerchantOwner, AuthorityMerchantItem, AuthorityMerchantStore],
  children: [{
    name: '操作员',
    path: 'manager',
  }, {
    name: '门店',
    path: 'store',
  }, {
    name: '项目',
    path: 'item',
  }],
}, {
  name: '账户',
  icon: 'login',
  path: 'login',
  authority: 'guest',
  children: [{
    name: '登录',
    path: 'login',
  // }, {
  //   name: '注册',
  //   path: 'register',
  // }, {
  //   name: '注册结果',
  //   path: 'register-result',
  }],
// }, {
//   name: '使用文档',
//   icon: 'book',
//   path: 'http://pro.ant.design/docs/getting-started',
//   target: '_blank',
}, {
  name: '系统设置',
  icon: 'book',
  path: `${location.protocol}//${location.hostname}/_managerSystemString`,
  target: '_blank',
  authority: [AuthorityRoot, '_M_CJ_SYSTEM_STRING'],
}];
function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    const result = {
      ...item,
      path: `${parentPath}${item.path}`,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
