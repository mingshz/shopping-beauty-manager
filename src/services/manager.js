import { stringify } from 'qs';
import request, { requestJson } from '../utils/request';

/**
 * 获取当前登录的管理员，否者就返回空结果
 */
export async function getCurrent() {
  return requestJson('/currentManager');
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

