import { getManager, updateManageable } from '../services/manager';

export default {
  namespace: 'manager',
  state: {
    loading: true,
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    /**
     * 更新权限
     * id目标用
     * target角色组
     */
    *updateManageable({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // 是否需要重新组织payload?
      yield call(updateManageable, payload.id, payload.target);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      if (callback) { callback(); }
    },
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // 是否需要重新组织payload?
      const result = yield call(getManager, payload);
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

