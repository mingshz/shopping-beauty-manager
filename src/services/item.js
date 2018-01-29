import { stringify } from 'qs';
import request, { requestJson, putJson, trueOnSuccessful } from '../utils/request';

/**
 * @param {*} params 查询参数
 * @returns 待审核的项目
 */
export async function getAuditItem(params) {
  return requestJson(`/item?${stringify(params)}`);
}

/**
 * itemName 项目名称
 * itemType 项目类型
 * merchantName 商户名称
 * merchantId 商户
 * enabled 是否上架
 * recommended 是否推荐
 * @param {*} params 查询参数
 * @returns 项目列表,不包含deleted 的项目
 */
export async function getAllItem(params) {
  return requestJson(`/item?${stringify(params)}`);
}

function auditItem(id, target, comment) {
  return putJson(`/item/${id}/auditStatus`, target, {
    headers: {
      comment,
    },
  })
    .then(trueOnSuccessful);
}

/**
 * 新增一个项目
 * @param {obj} params merchantId,name,thumbnailUrl,itemType,price salesPrice costPrice
 *  description richDescription
 */
export async function newItem(params) {
  return request('/item', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    method: 'POST',
    body: stringify(params),
  }).then(trueOnSuccessful);
}

export async function passItem(id, comment) {
  return auditItem(id, 'AUDIT_PASS', comment);
}

export async function refuseItem(id, comment) {
  return auditItem(id, 'AUDIT_FAILED', comment);
}


/**
 * 改变推荐状态
 * @param {Array<String> | String} items 项目
 * @param {boolean} target 目标值
 */
export async function updateItemRecommended(items, target) {
  let totalItems;
  if (items.constructor.name !== 'Array') {
    totalItems = [items];
  } else { totalItems = items; }
  return putJson('/item/recommended', {
    items: totalItems,
    recommended: target,
  }).then(trueOnSuccessful);
}

/**
 * 改变上架状态
 * @param {Array<String> | String} items 项目
 * @param {boolean} target 目标值
 */
export async function updateItemEnabled(items, target) {
  let totalItems;
  if (items.constructor.name !== 'Array') {
    totalItems = [items];
  } else { totalItems = items; }
  return putJson('/item/enabled', {
    items: totalItems,
    enabled: target,
  }).then(trueOnSuccessful);
}