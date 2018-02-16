import { hasLoadingList } from '../utils/commonModel';
import { getRechargeCards } from '../services/rechargeCard';

export default hasLoadingList({
  namespace: 'rechargeCard',
  state: {
  },
  effects: {
    // *fetch({ payload }, { call, put }) {
    // },
  },
  reducers: {
    // save(state, action) {
    //   return {
    //     ...state,
    //   };
    // },
  },
}, getRechargeCards);

