import { stringify } from 'qs';
import request, { requestJson, putJson } from '../utils/request';

/**
 * 用户列表
 * @param {*} params 请求参数 loginId,loginType,enable,mobile
 */
export async function getLogin(params) {
  return requestJson(`/login?${stringify(params)}`);
}

/**
 * @param {String} id 用户id
 * @param {boolean} enabled 与调整到的状态
 */
export async function updateEnabled(id, enabled) {
  return putJson(`/login/${id}`, {
    enable: enabled,
  });
}

export async function postExample(params) {
  return request('/api/post', {
    method: 'POST',
    body: params,
  });
}

export function humanReadName(data) {
  return `${data.nickName}(${data.loginName})`;
}
