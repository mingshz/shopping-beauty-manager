// 所有的路由在此集合
import React from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';
import { AuthorityRoot, AuthorityPlantformMerchantManage, AuthorityMerchantOwner, AuthorityMerchantStore, AuthorityMerchantItem, AuthorityPlatformItemAudit } from '../services/manager';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  // eslint-disable-next-line no-underscore-dangle
  models: () => models.filter(m => !app._models.some(({ namespace }) => namespace === m)).map(m => import(`../models/${m}.js`)),
  // add routerData prop
  component: () => {
    const routerData = getRouterData(app);
    return component().then((raw) => {
      const Component = raw.default || raw;
      return props => <Component {...props} routerData={routerData} />;
    });
  },
});

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

/**
 * 获取路由数据
 * component 表示要渲染的视图
 * authority 表示要求的权限
 * redirectPath 表示权限不满足的要跳转的path
 * @param {*} app dva app实例
 */
export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['global'], () => import('../layouts/BasicLayout')),
    },
    '/login': {
      component: dynamicWrapper(app, [], () => import('../layouts/LoginLayout')),
    },
    '/index': {
      component: dynamicWrapper(app, ['example'], () => import('../routes/IndexPage')),
    },
    '/login/login': {
      component: dynamicWrapper(app, ['global'], () => import('../routes/login/LoginPage')),
      authority: 'guest',
    },
    '/users/login': {
      component: dynamicWrapper(app, ['login', 'manager'], () => import('../routes/users/LoginList')),
    },
    '/users/manager': {
      component: dynamicWrapper(app, ['login', 'manager'], () => import('../routes/users/ManagerList')),
      authority: AuthorityRoot,
    },
    '/users/merchant': {
      component: dynamicWrapper(app, ['merchant', 'login'], () => import('../routes/users/MerchantList')),
      authority: [AuthorityRoot, AuthorityPlantformMerchantManage],
    },
    '/merchant/:merchantId/manager': {
      component: dynamicWrapper(app, ['merchant', 'login'], () => import('../routes/merchant/ManagerList')),
      authority: [AuthorityRoot, AuthorityMerchantOwner],
    },
    '/merchant/:merchantId/store': {
      component: dynamicWrapper(app, ['merchant', 'login'], () => import('../routes/merchant/StoreList')),
      authority: [AuthorityMerchantOwner, AuthorityMerchantStore],
    },
    '/merchant/:merchantId/item': {
      component: dynamicWrapper(app, ['merchant', 'login'], () => import('../routes/merchant/ItemList')),
      authority: [AuthorityMerchantOwner, AuthorityMerchantItem],
    },
    '/business/itemAudit': {
      component: dynamicWrapper(app, ['merchant', 'login'], () => import('../routes/business/ItemAuditList')),
      authority: [AuthorityRoot, AuthorityPlatformItemAudit],
    },
    // '/util/loginSelector': {
    //   component: dynamicWrapper(app, ['login'], () => import('../components/LoginSelector')),
    // },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
  };
    // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  // const menuData = {};
  const routerData = {};
  Object.keys(routerConfig).forEach((item) => {
    const menuItem = menuData[item.replace(/^\//, '')] || {};
    routerData[item] = {
      ...routerConfig[item],
      name: routerConfig[item].name || menuItem.name,
      authority: routerConfig[item].authority || menuItem.authority,
    };
  });
  return routerData;
};
