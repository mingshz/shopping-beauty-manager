import { getStoreItem, newStoreItem, updateStoreItemEnabled, updateStoreItemRecommended } from '../services/storeItem';

// import { xxx } from '../services/xxx';
export default {
  namespace: 'storeItem',
  state: {
    changing: false,
    loading: true,
    data: {
      list: [],
      pagination: {},
    },
    /**
     * 正在改变enable状态id
     */
    changingEnableId: null,
    /**
     * 正在改变enable状态id
     */
    changingRecommendedId: null,
  },
  effects: {
    /**
     * payload包含id,target
     */
    *changeRecommendedTo({ payload }, { call, put }) {
      yield put({
        type: 'changingRecommended',
        payload: payload.id,
      });
      yield call(updateStoreItemRecommended, payload.id, payload.target);
      yield put({
        type: 'changedRecommended',
        payload,
      });
    },
    /**
     * payload包含id,target
     */
    *changeEnableTo({ payload }, { call, put }) {
      yield put({
        type: 'changingEnable',
        payload: payload.id,
      });
      yield call(updateStoreItemEnabled, payload.id, payload.target);
      yield put({
        type: 'changedEnable',
        payload,
      });
    },
    /**
     * payload.store, payload.item, payload.price
     */
    *add({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeChanging',
        payload: true,
      });
      yield call(newStoreItem, payload.store, payload.item, payload.price);
      yield put({
        type: 'changeChanging',
        payload: false,
      });
      if (callback) { callback(); }
    },
    *fetch({ payload }, { call, put }) {
      // storeId
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // 是否需要重新组织payload?
      const result = yield call(getStoreItem, payload);
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
    changedRecommended(state, action) {
      return {
        ...state,
        // 调整 data.list 中符合条件的值
        data: {
          ...state.data,
          list: state.data.list.map(l => (l.id === action.payload.id ? {
            ...l,
            recommended: action.payload.target,
          } : l)),
        },
        changingRecommendedId: null,
      };
    },
    changingRecommended(state, action) {
      return {
        ...state,
        changingRecommendedId: action.payload,
      };
    },
    changingEnable(state, action) {
      return {
        ...state,
        changingEnableId: action.payload,
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

