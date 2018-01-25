import { getMerchant, newMerchant } from '../services/merchant';

export default {
  namespace: 'merchant',
  state: {
    changing: false,
    loading: true,
    data: {
      list: [],
      pagination: {},
    },
    /**
     * 新增表单的数据
     */
    creation: {},
  },
  effects: {
    *add({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeChanging',
        payload: true,
      });
      yield call(newMerchant, payload);
      yield put({
        type: 'changeChanging',
        payload: false,
      });
      if (callback) { callback(); }
    },
    *creationLoginSelected({ payload }, { put }) {
      yield put({
        type: 'changeCreation',
        payload: {
          login: payload,
          id: payload.id,
        },
      });
    },
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // 是否需要重新组织payload?
      const result = yield call(getMerchant, payload);
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
    changeCreation(state, action) {
      return {
        ...state,
        creation: {
          ...state.creation,
          ...action.payload,
        },
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    changeChanging(state, action) {
      return {
        ...state,
        changing: action.payload,
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

