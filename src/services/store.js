import { stringify } from 'qs';
import { requestJson, postJson, trueOnSuccessful, putJson, deleteRequest } from '../utils/request';

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

/**
 * 获取特定门店的门店代表
 * @param {String} store 门店id
 */
export async function getStoreRepresent(store, params) {
  return requestJson(`/store/${store}/represent?${stringify(params)}`);
}

/**
 * 新增一个门店代表
 * @param {String} store 门店id
 * @param {String} login 身份id
 */
export async function newStoreRepresent(store, login) {
  return postJson(`/store/${store}/represent/${login}`)
    .then(trueOnSuccessful);
}

/**
 * 切换激活状态
 * @param {String} store 门店id
 * @param {String} id 代表id
 * @param {boolean} target 状态
 */
export async function updateStoreRepresent(store, id, target) {
  return putJson(`/store/${store}/represent/${id}/enabled`, target)
    .then(trueOnSuccessful);
}
/**
 * 删除一个门店代表
 * @param {String} store 门店id
 * @param {String} id 代表id
 */
export async function deleteStoreRepresent(store, id) {
  return deleteRequest(`/store/${store}/represent/${id}`);
}
