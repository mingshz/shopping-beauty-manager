import { getLogin } from '../services/login';
/**
 * 登录身份管理
 */
export default {
  namespace: 'login',
  state: {
    loading: true,
    data: {
      list: [],
      pagination: {},
    },
    select: [],
  },
  effects: {
    *selectLogin({ payload }, { call, put }) {
      const result = yield call(getLogin, {
        mobile: payload,
      });
      const list = result.list || result.data;
      yield put({
        type: 'saveSelect',
        payload: list || [],
      });
    },
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // 是否需要重新组织payload?
      const result = yield call(getLogin, payload);
      result.list = result.list || result.data;
      yield put({
        type: 'save',
        payload: result,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },
  reducers: {
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveSelect(state, action) {
      return {
        ...state,
        select: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

