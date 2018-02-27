import { routerRedux } from 'dva/router';

const error = (e, dispatch) => {
  // 还在登录页面就不搞事了
  if (location.href.indexOf('/login/login') > 0) { return; }
  if (e.response && e.response.status === 431) {
    window.location.reload();
  }
  // if (e.response && e.response.url.indexOf('manageLoginResult') >= 0) { return; }
  // if (e.response && e.response.url.indexOf('managerLoginRequest') >= 0) { return; }
  dispatch(routerRedux.push('/exception/500'));
};

export default error;
