import equals from 'equals';
import { getCurrent } from '../services/manager';
import { setLocalAuthority, getLocalAuthority } from '../utils/authorityStorage';

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
  },
  effects: {
    *logout(_, { put }) {
      yield put({
        type: 'changeCurrentUser',
      });
    },
    *fetchCurrent(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const current = yield call(getCurrent);

      if (!current) {
        yield put({
          type: 'changeCurrentUser',
        });
      } else {
        yield put({
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
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // *fetch({ payload }, { call, put }) {
    // },
  },
  reducers: {
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    changeCurrentUser(state, action) {
      if (!action.payload) {
        setLocalAuthority(null);
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

