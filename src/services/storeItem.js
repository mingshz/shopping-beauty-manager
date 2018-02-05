import { stringify } from 'qs';
import { requestJson, trueOnSuccessful, putJson, postJson } from '../utils/request';

/**
 * 获取门店项目
 * itemName 项目名称
 * storeName 门店名称
 * enabled boolean 是否上架
 * recommended boolean 是否推荐
 * @param {object} params 必须包含storeId
 */
export async function getStoreItem(params) {
  return requestJson(`/storeitem?${stringify(params)}`);
}

/**
 * 添加/编辑门店项目；还可以更新的呢
 * @param {String} store 门店id
 * @param {String} item 项目id
 * @param {Number} price 可选价格
 */
export async function newStoreItem(store, item, price) {
  return postJson('/storeitem', {
    itemId: item,
    storeId: store,
    salesPrice: price,
  })
    .then(trueOnSuccessful);
  // return request('/storeitem', {
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  //   },
  //   method: 'POST',
  //   body: stringify({
  //     itemId: item,
  //     storeId: store,
  //     salesPrice: price,
  //   }),
  // }).then(trueOnSuccessful);
}
/**
 * 改变推荐状态
 * @param {Array<String> | String} items 项目
 * @param {boolean} target 目标值
 */
export async function updateStoreItemRecommended(items, target) {
  let totalItems;
  if (items.constructor.name !== 'Array') {
    totalItems = [items];
  } else { totalItems = items; }
  return putJson('/storeItemUpdater/recommended', {
    items: totalItems,
    recommended: target,
  }).then(trueOnSuccessful);
}

/**
 * 改变上架状态
 * @param {Array<String> | String} items 项目
 * @param {boolean} target 目标值
 */
export async function updateStoreItemEnabled(items, target) {
  let totalItems;
  if (items.constructor.name !== 'Array') {
    totalItems = [items];
  } else { totalItems = items; }
  return putJson('/storeItemUpdater/enabled', {
    items: totalItems,
    enabled: target,
  }).then(trueOnSuccessful);
}

