import { stringify } from 'qs';
import { requestJson, postJson, putJson } from '../utils/request';

export async function getMerchant(params) {
  return requestJson(`/merchant?${stringify(params)}`);
}

export async function newMerchant(params) {
  return postJson('/merchant', params);
}

export async function updateEnabled(id, enabled) {
  return putJson(`/merchant/${id}`, {
    enable: enabled,
  });
}
