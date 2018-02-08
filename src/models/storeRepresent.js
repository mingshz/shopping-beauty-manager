import { getStoreRepresent, newStoreRepresent, updateStoreRepresent, deleteStoreRepresent } from '../services/store';
import { deleteProperty } from '../utils/utils';

export default {
  namespace: 'storeRepresent',
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
     * 正在改变 enable 状态id
     */
    changingEnableId: null,
  },
  effects: {
    /**
     * payload包含 id,store
     */
    *deleteOne({ payload }, { call, put }) {
      yield put({
        type: 'changeChanging',
        payload: payload.id,
      });
      yield call(deleteStoreRepresent, payload.store, payload.id);
      yield put({
        type: 'deleted',
        payload: payload.id,
      });
    },
    /**
     * payload包含 id,target,store
     */
    *changeEnableTo({ payload }, { call, put }) {
      yield put({
        type: 'changingEnable',
        payload: payload.id,
      });
      yield call(updateStoreRepresent, payload.store, payload.id, payload.target);
      yield put({
        type: 'changedEnable',
        payload,
      });
    },
    /**
     * 需包含store,login 都为id
     */
    *add({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeChanging',
        payload: true,
      });
      yield call(newStoreRepresent, payload.store, payload.login);
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
    /**
     * payload:必须包含store
     */
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // 是否需要重新组织payload?
      const result = yield call(getStoreRepresent, payload.store, deleteProperty(payload, 'store'));
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
    deleted(state, action) {
      return {
        ...state,
        // 调整 data.list 中符合条件的值
        data: {
          ...state.data,
          list: state.data.list.filter(l => l.id !== action.payload),
        },
        changing: false,
      };
    },
    changedEnable(state, action) {
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

