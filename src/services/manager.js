import { stringify } from 'qs';
import request, { requestJson } from '../utils/request';

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

export function getExample(params) {
  return request(`/api/get?${stringify(params)}`);
}

export function postExample(params) {
  return request('/api/post', {
    method: 'POST',
    body: params,
  });
}

