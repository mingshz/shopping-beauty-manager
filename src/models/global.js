import equals from 'equals';
import { getCurrent, loginRequest, loginResult, logout, getInit } from '../services/manager';
import { setLocalAuthority, getLocalAuthority, setLocalMerchantId } from '../utils/authorityStorage';

/**
 * @param {String | Array<String>} a 权限1
 * @param {String | Array<String>} b 权限2
 * @returns {Boolean} a与b是否为一致权限
 */
function equalsAuthorities(a, b) {
  if (equals(a, b)) {
    return true;
  }
  // 可能会出现1个是数组而另一个缺非数组的情况
  if (a.constructor.name === 'Array' && a.length === 1) {
    return equalsAuthorities(a[0], b);
  }
  if (b.constructor.name === 'Array' && b.length === 1) {
    return equalsAuthorities(a, b[0]);
  }
  return false;
}

function loginAs(put, current) {
  // console.log('loginAs: ', current);
  return put({
    type: 'changeCurrentUser',
    payload: {
      ...current,
      name: current.username,
      avatar: current.avatar || 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      notifyCount: current.notifyCount || 0,
      authorities: current.authorities || 'guest',
    },
  });
}

export default {
  namespace: 'global',
  state: {
    /**
     * 页面是否处于收缩状态
     */
    collapsed: false,
    /**
     * 当前用户
     * 包括name,avatar,notifyCount
     */
    currentUser: {},
    /**
     * 当前的登录请求
     * 包含id,url
     */
    loginRequest: {},
    init: {},
  },
  effects: {
    /**
     * 检查登录状态
     */
    *loginResult({ payload }, { call, put }) {
      const result = yield call(loginResult, payload);
      if (result) {
        yield loginAs(put, result);
      }
    },
    /**
     * 请求登录
     */
    *loginRequest(_, { call, put }) {
      const result = yield call(loginRequest);
      if (result.data) {
        yield loginAs(put, result.data);
        return;
      }
      yield put({
        type: 'changeLoginRequest',
        payload: result,
      });
    },
    *logout(_, { put, call }) {
      yield call(logout);
      yield put({
        type: 'changeCurrentUser',
      });
    },
    *fetchCurrent(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      try {
        const current = yield call(getCurrent);
        if (!current) {
          yield put({
            type: 'changeCurrentUser',
          });
        } else {
          yield loginAs(put, current);
        }
      } catch (e) {
        yield put({
          type: 'changeCurrentUser',
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchInit(_, { call, put }) {
      const x = yield call(getInit);
      yield put({
        type: 'changedInit',
        payload: x,
      });
    },
    // *fetch({ payload }, { call, put }) {
    // },
  },
  reducers: {
    changedInit(state, action) {
      return {
        ...state,
        init: action.payload,
      };
    },
    changeLoginRequest(state, action) {
      return {
        ...state,
        loginRequest: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    changeCurrentUser(state, action) {
      if (!action.payload) {
        setLocalAuthority(null);
        setLocalMerchantId(null);
        window.location.reload();
        return {
          ...state,
          currentUser: null,
        };
      } else {
        // 如果当前权限与新的权限不一致，则更新并且重载
        // console.log(getLocalAuthority(), action.payload.authorities);
        if (!equalsAuthorities(getLocalAuthority(), action.payload.authorities)) {
          setLocalAuthority(action.payload.authorities);
          window.location.reload();
        }
        setLocalMerchantId(action.payload.merchantId);
        return {
          ...state,
          currentUser: action.payload,
        };
      }
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
  },
};

