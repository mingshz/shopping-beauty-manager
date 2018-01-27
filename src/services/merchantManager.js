import { stringify } from 'qs';
import { requestJson, postJson } from '../utils/request';

/**
 * 获得特定商户旗下的管理员
 * @param {string} merchantId 商户管理员
 * @param {object} params 包含username
 */
export async function getManager(merchantId, params) {
  return requestJson(`/merchant/${encodeURIComponent(merchantId)}/manage?${stringify(params)}`);
}

export async function getDetail(merchantId, managerId) {
  return requestJson(`/merchant/${encodeURIComponent(merchantId)}/manage/${encodeURIComponent(managerId)}`);
}

export async function newManager(merchantId, params) {
  return postJson(`/merchant/${encodeURIComponent(merchantId)}/manage`, params);
}

