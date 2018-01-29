import { stringify } from 'qs';
import { requestJson, postJson, trueOnSuccessful, putJson } from '../utils/request';

/**
 * username 门店角色登录名（手机号）
 * merchantId 商户编号
 * @param {object} params 参数
 */
export async function getStore(params) {
  return requestJson(`/store?${stringify(params)}`);
}

/**
 * 新增一个门店
 * merchantId,loginId,name,contact,telephone,address
 * @param {object} params 参数
 */
export async function newStore(params) {
  return postJson('/store', params)
    .then(trueOnSuccessful);
}

/**
 * 更改激活状态
 * @param {String} store 门店id
 * @param {boolean} target 是否要激活
 */
export async function updateStoreEnabled(store, target) {
  return putJson(`/store/${store}/enabled`, target).then(trueOnSuccessful);
}

// export async function getStore(params) {
//   return requestJson(`/store/{storeId}/represent`);
// }
// 还有添加门店代表和 启用/禁用 代表
