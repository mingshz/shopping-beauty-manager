import { getManager, newManager, updateEnabled } from '../services/merchantManager';

export default {
  namespace: 'merchantManager',
  state: {
    loading: true,
    data: {
      list: [],
      pagination: {},
    },
    /**
     * 正在改变 enable 状态id
     */
    changingEnableId: null,
  },
  effects: {
    /**
     * payload 包含id,target
     */
    *changeEnableTo({ merchantId, payload }, { call, put }) {
      yield put({
        type: 'changingEnable',
        payload: payload.id,
      });
      yield call(updateEnabled, merchantId, payload.id, payload.target);
      yield put({
        type: 'changedEnable',
        payload,
      });
    },
    /**
     * 更新权限
     * payload 包括 loginId,level
     */
    *updateManageable({ merchantId, payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // 是否需要重新组织payload?
      yield call(newManager, merchantId, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      if (callback) { callback(); }
    },
    /**
     * merchantId,
     */
    *fetch({ merchantId, payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // 是否需要重新组织payload?
      const result = yield call(getManager, merchantId, payload);
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
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};

