import { getAuditItem, passItem, refuseItem } from '../services/item';

function *auditItem(payload, callback, call, put, service) {
  yield put({
    type: 'changingAudit',
    payload: payload.id,
  });
  yield call(service, payload.id, payload.comment);
  yield put({
    type: 'changedAudit',
    payload,
  });
  if (callback) callback();
}

export default {
  namespace: 'itemAudit',
  state: {
    loading: true,
    data: {
      list: [],
      pagination: {},
    },
    /**
     * 正在执行审核的对象
     */
    auditingId: null,
  },
  effects: {
    /**
     * 批准payload包括id和comment
     */
    *passItem({ payload, callback }, { call, put }) {
      yield call(auditItem, payload, callback, call, put, passItem);
    },
    *refuseItem({ payload, callback }, { call, put }) {
      yield call(auditItem, payload, callback, call, put, refuseItem);
    },
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // 是否需要重新组织payload?
      const result = yield call(getAuditItem, payload);
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
    changedAudit(state) {
      return {
        ...state,
        // 调整 data.list 中符合条件的值
        // data: {
        //   ...state.data,
        //   list: state.data.list.map(l => (l.id === action.payload.id ? {
        //     ...l,
        //     enabled: action.payload.target,
        //   } : l)),
        // },
        auditingId: null,
      };
    },
    changingAudit(state, action) {
      return {
        ...state,
        auditingId: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
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

