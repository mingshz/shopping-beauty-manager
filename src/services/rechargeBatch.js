import { stringify } from 'qs';
import { requestJson, postJson, putJson } from '../utils/request';

export async function getRechargeBatches(params) {
  return requestJson(`/rechargeBatch?${stringify(params)}`);
}

/**
 * 新增批次
 * @param {object} params 包含number,emailAddress,guideId
 */
export async function newRechargeBatch(params) {
  return postJson('/rechargeBatch', params);
}

/**
 * 重新发送这批卡密信息
 * @param {number} id  batch's id
 */
export async function sendRechargeBatchInfo(id) {
  return putJson(`/rechargeBatch/${id}/emailSending`);
}
