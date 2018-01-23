// 所有的路由在此集合
import React from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';

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
      authority: 'user',
      redirectPath: '/login/login',
    },
    '/login/login': {
      component: dynamicWrapper(app, ['global'], () => import('../routes/LoginPage')),
      authority: 'guest',
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
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
