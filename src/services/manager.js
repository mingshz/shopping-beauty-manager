import { stringify } from 'qs';
import request, { requestJson, putJson } from '../utils/request';

/**
 * 登出
 */
export async function logout() {
  request('/logout');
}

/**
 * 获取当前登录的管理员，否者就返回空结果
 */
export async function getCurrent() {
  return requestJson('/currentManager', null, () => null);
}

/**
 * @returns {object} 如果包含 data 则已登录，否则需要执行登录
 */
export async function loginRequest() {
  return requestJson('/managerLoginRequest').then((json) => {
    if (json.id && json.url) {
      return json;
    }
    return { data: json };
  });
}

/**
 * 检查是否完成登录
 * @param {String} id 请求id
 * @return {object} 若不为空则登录成功
 */
export async function loginResult(id) {
  // console.log('id:', id, ',after:', encodeURIComponent(id));
  return request(`/manageLoginResult/${encodeURIComponent(id)}`, {
    Accept: 'application/json',
  }).then((response) => {
    if (response.status === 204) {
      return null;
    }
    if (response.status !== 200) {
      throw new Error(`不期望的响应:${response.status}`);
    }
    return response.json();
  });
}

const authorityTable = {
  ROLE_ROOT: '全权限',
  ROLE_AUDIT_ITEM: '项目审核',
  ROLE_MANAGE_ITEM: '平台未知',
  ROLE_MERCHANT_ROOT: '商户所有者',
  ROLE_MERCHANT_OPERATOR: '商户操作者',
  ROLE_STORE_ROOT: '门店所有者',
  ROLE_STORE_OPERATOR: '门店操作者',
  ROLE_REPRESENT: '未知',
};
/**
 * 将权限变成人类可读
 * @param {String} 原始权限
 * @returns {String} 可读权限
 */
export function authorityName(str) {
  return authorityTable[str] || str;
}

/**
 * 获取管理员
 * @param {*} params 支持username查询
 */
export async function getManager(params) {
  return requestJson(`/manage?${stringify(params)}`);
}

/**
 * 改变某登录的可管理状态
 * @param {String} id id
 * @param {boolean} target 是否可管理
 */
export async function updateManageable(id, target) {
  putJson(`/manage/${encodeURIComponent(id)}`, {
    manageable: target,
  });
}

export function postExample(params) {
  return request('/api/post', {
    method: 'POST',
    body: params,
  });
}

