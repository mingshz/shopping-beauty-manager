import { getMerchant, newMerchant, updateEnabled } from '../services/merchant';

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
    /**
     * 正在改变enable状态id
     */
    changingEnableId: null,
  },
  effects: {
    /**
     * payload包含id,target
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
    changedEnable(state, action) {
      // loginId
      return {
        ...state,
        // 调整 data.list 中符合条件的值
        data: {
          ...state.data,
          list: state.data.list.map(l => (l.loginId === action.payload.id ? {
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

