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
  return localStorage.setItem('antd-pro-authority', authority);
}

