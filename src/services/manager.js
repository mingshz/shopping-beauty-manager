import { stringify } from 'qs';
import request, { requestJson, putJson, trueOnSuccessful } from '../utils/request';

/**
 * 登出
 */
export async function logout() {
  request('/logout');
}

/**
 * 获取当前登录的管理员，否者就返回空结果
 */
export async function getCurrent() {
  return requestJson('/currentManager', null);
}

/**
 * @returns {object} 如果包含 data 则已登录，否则需要执行登录
 */
export async function loginRequest() {
  return requestJson('/managerLoginRequest').then((json) => {
    if (json.id && json.url) {
      return json;
    }
    return { data: json };
  });
}

/**
 * 检查是否完成登录
 * @param {String} id 请求id
 * @return {object} 若不为空则登录成功
 */
export async function loginResult(id) {
  // console.log('id:', id, ',after:', encodeURIComponent(id));
  return request(`/manageLoginResult/${encodeURIComponent(id)}`, {
    Accept: 'application/json',
  }).then((response) => {
    if (response.status === 204) {
      return null;
    }
    if (response.status !== 200) {
      return null;
      // throw errorWithResponse(response, `不期望的响应:${response.status}`);
    }
    return response.json();
  });
}

const authorityTable = {};

// ROLE_MANAGE_ITEM
export const AuthorityManageSystemString = 'ROLE__M_CJ_SYSTEM_STRING';
authorityTable[AuthorityManageSystemString] = '系统参数管理';
/**
 * 全权限用户
 */
export const AuthorityRoot = 'ROLE_ROOT';
authorityTable[AuthorityRoot] = '全权限';
export const AuthorityUser = 'ROLE_USER';
authorityTable[AuthorityUser] = '用户';
export const AuthorityPlatformRead = 'ROLE_PLATFORM_READ';
authorityTable[AuthorityPlatformRead] = '平台可读';
export const AuthorityPlatformSettlement = 'ROLE_PLATFORM_SETTLEMENT';
authorityTable[AuthorityPlatformSettlement] = '平台结算';
export const AuthorityPlatformItemAudit = 'ROLE_AUDIT_ITEM';
authorityTable[AuthorityPlatformItemAudit] = '项目审核';
export const AuthorityPlatformMerchantManage = 'ROLE_PLATFORM_MERCHANT';
authorityTable[AuthorityPlatformMerchantManage] = '商户管理';
export const AuthorityMerchantOwner = 'ROLE_MERCHANT_ROOT';
authorityTable[AuthorityMerchantOwner] = '商户所有者';
// 比如门店专员, 项目专员，结算专员（可能是同一个人）
export const AuthorityMerchantItem = 'ROLE_MERCHANT_ITEM';
authorityTable[AuthorityMerchantItem] = '商户项目专员';
export const AuthorityMerchantStore = 'ROLE_MERCHANT_STORE';
authorityTable[AuthorityMerchantStore] = '商户门店专员';

// const authorityTable = {
//   AuthorityRoot: '全权限',
//   AuthorityPlatformItemAudit: '项目审核',
//   ROLE_MANAGE_ITEM: '平台未知',
//   ROLE_MERCHANT_ROOT: '商户所有者',
//   ROLE_MERCHANT_OPERATOR: '商户操作者',
//   ROLE_STORE_ROOT: '门店所有者',
//   ROLE_STORE_OPERATOR: '门店操作者',
//   ROLE_REPRESENT: '门店代表',
// };
/**
 * 将权限变成人类可读
 * @param {String} 原始权限
 * @returns {String} 可读权限
 */
export function authorityName(str) {
  return authorityTable[str] || str;
}

/**
 * 获取管理员
 * @param {*} params 支持username查询
 */
export async function getManager(params) {
  return requestJson(`/manage?${stringify(params)}`);
}

/**
 * 改变某登录的可管理状态
 * @param {String} id id
 * @param {Array<String>} target 是否可管理
 */
export async function updateManageable(id, target) {
  return putJson(`/manage/${encodeURIComponent(id)}/levelSet`, target)
    .then(trueOnSuccessful);
}
