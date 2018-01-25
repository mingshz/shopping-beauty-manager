import { stringify } from 'qs';
import request, { requestJson } from '../utils/request';

/**
 * 用户列表
 * @param {*} params 请求参数 loginId,loginType,enable,mobile
 */
export async function getLogin(params) {
  return requestJson(`/login?${stringify(params)}`);
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
