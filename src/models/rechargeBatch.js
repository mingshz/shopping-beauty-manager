import { getRechargeBatches, newRechargeBatch, sendRechargeBatchInfo } from '../services/rechargeBatch';
import { hasLoadingList, hasChangingForAdd } from '../utils/commonModel';

export default hasChangingForAdd(hasLoadingList({
  namespace: 'rechargeBatch',
  state: {
  },
  effects: {
    *send({ payload, callback }, { call }) {
      yield call(sendRechargeBatchInfo, payload);
      if (callback) callback();
    },
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

