import { stringify } from 'qs';
import { requestJson } from '../utils/request';

export async function getRechargeCards(params) {
  return requestJson(`/rechargeCard?${stringify(params)}`);
}
