import { getRechargeBatches, newRechargeBatch } from '../services/rechargeBatch';
import { hasLoadingList, hasChangingForAdd } from '../utils/commonModel';

// import { xxx } from '../services/xxx';
export default hasChangingForAdd(hasLoadingList({
  namespace: 'rechargeBatch',
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
}, getRechargeBatches), newRechargeBatch);

