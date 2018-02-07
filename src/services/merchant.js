import { stringify } from 'qs';
import { requestJson, postJson, putJson, trueOnSuccessful, wellFormAddress } from '../utils/request';

export async function getMerchant(params) {
  return requestJson(`/merchant?${stringify(params)}`);
}

export async function newMerchant(params) {
  return postJson('/merchant', {
    ...params,
    address: wellFormAddress(params.address),
  }).then(trueOnSuccessful);
}

export async function updateEnabled(id, enabled) {
  return putJson(`/merchant/${id}/enabled`, enabled).then(trueOnSuccessful);
}
