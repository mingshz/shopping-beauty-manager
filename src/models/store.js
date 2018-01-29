import { getStore, newStore, updateStoreEnabled, getStoreRepresent, newStoreRepresent, updateStoreRepresent, deleteStoreRepresent } from '../services/store';

export default {
  namespace: 'store',
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
    /**
     * 代表
     */
    represent: {
      list: [],
      pagination: {},
    },
    /**
     * 新增代表的数据
     */
    representCreation: {},
    /**
     * 正在改变代表的id
     */
    changingRepresentId: null,
  },
  effects: {
    /**
     * payload包含id,store
     */
    *deleteRepresent({ payload }, { call, put }) {
      yield put({
        type: 'changingRepresent',
        payload: payload.id,
      });
      yield call(deleteStoreRepresent, payload.store, payload.id);
      yield put({
        type: 'changedRepresent',
      });
    },
    /**
     * payload包含id,target,store
     */
    *changeRepresentEnableTo({ payload }, { call, put }) {
      yield put({
        type: 'changingRepresent',
        payload: payload.id,
      });
      yield call(updateStoreRepresent, payload.store, payload.id, payload.target);
      yield put({
        type: 'changedRepresent',
        payload,
      });
    },
    /**
     * 需包含store,login都为id
     */
    *addRepresent({ payload, callback }, { call, put }) {
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
    *representCreationLoginSelected({ payload }, { put }) {
      yield put({
        type: 'changeRepresentCreation',
        payload: {
          login: payload,
          id: payload.id,
        },
      });
    },
    /**
     * 获取代表
     * payload:必须包含store
     */
    *fetchRepresent({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // 是否需要重新组织payload?
      const result = yield call(getStoreRepresent, payload.store, payload);
      result.list = result.list || result.data;
      yield put({
        type: 'saveRepresent',
        payload: result,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      if (callback) callback();
    },
    /**
     * payload包含id,target
     */
    *changeEnableTo({ payload }, { call, put }) {
      yield put({
        type: 'changingEnable',
        payload: payload.id,
      });
      yield call(updateStoreEnabled, payload.id, payload.target);
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
      yield call(newStore, payload);
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
      const result = yield call(getStore, payload);
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
    changedRepresent(state, action) {
      // 如果有payload 则更变其enable状态，否则删除
      let targetList;
      if (action.payload) {
        targetList = state.represent.list.map(l => (l.id === action.payload.id ? {
          ...l,
          enabled: action.payload.target,
        } : l));
      } else {
        targetList = state.represent.list.filter(l => l.id !== state.changingRepresentId);
      }
      return {
        ...state,
        // 调整 data.list 中符合条件的值
        represent: {
          ...state.represent,
          list: targetList,
        },
        changingRepresentId: null,
      };
    },
    changingRepresent(state, action) {
      return {
        ...state,
        changingRepresentId: action.payload,
      };
    },
    changeRepresentCreation(state, action) {
      return {
        ...state,
        representCreation: {
          ...state.representCreation,
          ...action.payload,
        },
      };
    },
    saveRepresent(state, action) {
      return {
        ...state,
        represent: action.payload,
      };
    },
    changedEnable(state, action) {
      return {
        ...state,
        // 调整 data.list 中符合条件的值
        data: {
          ...state.data,
          list: state.data.list.map(l => (l.storeId === action.payload.id ? {
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

