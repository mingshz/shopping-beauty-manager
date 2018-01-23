// import { xxx } from '../services/xxx';
export default {
  namespace: 'global',
  state: {
    collapsed: false,
  },
  effects: {
    // *fetch({ payload }, { call, put }) {
    // },
  },
  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
  },
};

