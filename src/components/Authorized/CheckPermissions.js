import React from 'react';
import intersection from 'array-intersection';
import PromiseRender from './PromiseRender';
import { CURRENT } from './index';
/**
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定 Permission judgment type string |array | Promise | Function } authority
 * @param { 你的权限 Your permission description  type:string | array } currentAuthority
 * @param { 通过的组件 Passing components } target
 * @param { 未通过的组件 no pass components } Exception
 */
const checkPermissions = (authority, currentAuthority, target, Exception) => {
  // 没有判定权限.默认查看所有
  // Retirement authority, return target;
  if (!authority) {
    return target;
  }
  // root 无所畏惧，除了要求是匿名
  if (authority.constructor.name !== 'String' || authority !== 'guest') {
    if (currentAuthority && currentAuthority.constructor.name === 'String' && currentAuthority === 'root') {
      return target;
    }
    if (currentAuthority && currentAuthority.constructor.name === 'Array' && currentAuthority.includes('root')) {
      return target;
    }
  }
  // 数组处理
  if (authority.constructor.name === 'Array') {
    if (currentAuthority.constructor.name === 'String' && authority.includes(currentAuthority)) {
      return target;
    }
    if (currentAuthority.constructor.name === 'Array' && intersection(authority, currentAuthority).length > 0) {
      return target;
    }
    return Exception;
  }

  // string 处理
  if (authority.constructor.name === 'String') {
    if (currentAuthority.constructor.name === 'String' && authority === currentAuthority) {
      return target;
    }
    if (currentAuthority.constructor.name === 'Array' && currentAuthority.includes(authority)) {
      return target;
    }
    return Exception;
  }

  // Promise 处理
  if (authority.constructor.name === 'Promise') {
    return () => (
      <PromiseRender ok={target} error={Exception} promise={authority} />
    );
  }

  // Function 处理
  if (authority.constructor.name === 'Function') {
    try {
      const bool = authority();
      if (bool) {
        return target;
      }
      return Exception;
    } catch (error) {
      throw error;
    }
  }
  throw new Error('unsupported parameters');
};

export { checkPermissions };

const check = (authority, target, Exception) => {
  return checkPermissions(authority, CURRENT, target, Exception);
};

export default check;
