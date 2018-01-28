// 负责本地存储权限
// 权限应该保存在本地，确保刷新之后还可以使用；但是系统内部应该存在刷新机制；在发现权限丢失之后会删除权限信息，并且重新打开应用程序

/**
 * @returns 本地保存的权限；可能是一个数组
 */
export function getLocalAuthority() {
  return localStorage.getItem('antd-pro-authority') || 'guest';
}

/**
 * @param {String || Array<String>} authority  需要被保存的权限
 */
export function setLocalAuthority(authority) {
  if (!authority) {
    localStorage.removeItem('antd-pro-authority');
    return;
  }
  return localStorage.setItem('antd-pro-authority', authority);
}

/**
 * @returns {String} 最后登录的商户号或者null
 */
export function getLocalMerchantId() {
  return localStorage.getItem('lastMerchantId');
}

/**
 * 保存最后登录的商户号
 * @param {String} id 商户号
 */
export function setLocalMerchantId(id) {
  if (!id) {
    localStorage.removeItem('lastMerchantId');
  }
  localStorage.setItem('lastMerchantId', id);
}
