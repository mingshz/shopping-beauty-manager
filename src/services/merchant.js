import { stringify } from 'qs';
import { requestJson, postJson } from '../utils/request';

export async function getMerchant(params) {
  return requestJson(`/merchant?${stringify(params)}`);
}

export async function newMerchant(params) {
  return postJson('/merchant', params);
}

