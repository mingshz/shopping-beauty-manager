import { stringify } from 'qs';
import { requestJson, putJson, trueOnSuccessful, postJson } from '../utils/request';

/**
 *
 * @param {object} data 项目数据
 * @returns {boolean} 是否可以被提交审核
 */
export function shouldCommit(data) {
  return data.auditStatus === '待提交' || data.auditStatus === '审核不通过';
}

/**
 * @param {*} params 查询参数
 * @returns 待审核的项目
 */
export async function getAuditItem(params) {
  return requestJson(`/item?${stringify({
    ...params,
    auditStatus: 'TO_AUDIT',
  })}`);
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
  return putJson(`/item/${id}/auditStatus`, {
    status: target,
    comment,
  })
    .then(trueOnSuccessful);
}

/**
 * 新增一个项目
 * @param {obj} params merchantId,name,thumbnailUrl,itemType,price salesPrice costPrice
 *  description richDescription
 */
export async function newItem(params) {
  // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  return postJson('/item', params).then(trueOnSuccessful);
}

export async function passItem(id, comment) {
  return auditItem(id, 'AUDIT_PASS', comment);
}

export async function refuseItem(id, comment) {
  return auditItem(id, 'AUDIT_FAILED', comment);
}

export async function commitItem(id, comment) {
  return putJson(`/item/${id}/commit`, {
    status: 'TO_AUDIT',
    comment,
  })
    .then(trueOnSuccessful);
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
  return putJson('/itemUpdater/recommended', {
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
  return putJson('/itemUpdater/enabled', {
    items: totalItems,
    enabled: target,
  }).then(trueOnSuccessful);
}
