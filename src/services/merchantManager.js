import { stringify } from 'qs';
import { requestJson, postJson, trueOnSuccessful, putJson } from '../utils/request';
import { deleteProperty } from '../utils/utils';

/**
 * 获得特定商户旗下的管理员
 * @param {string} merchantId 商户管理员
 * @param {object} params 包含username
 */
export async function getManager(merchantId, params) {
  return requestJson(`/merchant/${encodeURIComponent(merchantId)}/manage?${stringify(params)}`);
}

export async function updateEnabled(merchantId, id, target) {
  return putJson(`/merchant/${encodeURIComponent(merchantId)}/manage/${id}/enable`, target)
    .then(trueOnSuccessful);
}

/**
 * 添加商户管理员
 * @param {string} merchantId 商户号
 * @param {object} params 包括loginId,level(array)
 */
export async function newManager(merchantId, params) {
  return postJson(`/merchant/${encodeURIComponent(merchantId)}/manage/${encodeURIComponent(params.loginId)}`, {
    level: [],
    ...deleteProperty(params, 'loginId'),
  }).then(trueOnSuccessful);
}

