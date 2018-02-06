import { getLogin, updateEnabled } from '../services/login';
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
    /**
     * payload 包含id,target
     */
    *changeEnableTo({ payload }, { call, put }) {
      yield put({
        type: 'changingEnable',
        payload: payload.id,
      });
      yield call(updateEnabled, payload.id, payload.target);
      yield put({
        type: 'changedEnable',
        payload,
      });
    },
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
    changedEnable(state, action) {
      // loginId
      return {
        ...state,
        // 调整 data.list 中符合条件的值
        data: {
          ...state.data,
          list: state.data.list.map(l => (l.id === action.payload.id ? {
            ...l,
            enabled: action.payload.target,
          } : l)),
        },
        changingEnableId: null,
      };
    },
    changingEnable(state, action) {
      return {
        ...state,
        changingEnableId: action.payload,
      };
    },
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

