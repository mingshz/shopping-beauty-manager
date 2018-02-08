import { stringify } from 'qs';
import { requestJson, putJson, trueOnSuccessful } from '../utils/request';

/**
 * 用户列表
 * @param {*} params 请求参数 loginId,loginType,enabled,mobile
 */
export async function getLogin(params) {
  return requestJson(`/login?${stringify(params)}`);
}

/**
 * @param {String} id 用户id
 * @param {boolean} enabled 与调整到的状态
 */
export async function updateEnabled(id, enabled) {
  return putJson(`/login/${id}/enabled`, enabled).then(trueOnSuccessful);
}

export function humanReadName(data) {
  if (data.wxNickName) { return `${data.mobile}(${data.wxNickName})`; }
  return `${data.mobile}`;
}
