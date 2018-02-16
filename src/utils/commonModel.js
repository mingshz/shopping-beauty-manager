// export function annTest(v0, v1) {
//   console.log(v0);
//   console.log(v1);
// }

/**
 * 具备 changing 属性，并且可以执行add
 * @param {object} origin 原来的model
 * @param {function} adder 新增的function
 */
export function hasChangingForAdd(origin, adder) {
  return {
    ...origin,
    state: {
      ...origin.state,
      changing: false,
    },
    effects: {
      ...origin.effects,
      *add({ payload, callback }, { call, put }) {
        yield put({
          type: 'changeChanging',
          payload: true,
        });
        yield call(adder, payload);
        yield put({
          type: 'changeChanging',
          payload: false,
        });
        if (callback) { callback(); }
      },
    },
    reducers: {
      ...origin.reducers,
      changeChanging(state, action) {
        return {
          ...state,
          changing: action.payload,
        };
      },
    },
  };
}

/**
 * @param {object} origin 原来的model
 * @param {function} fetcher 获取 list的 function
 * @returns {object} 新的model
 */
export function hasLoadingList(origin, fetcher) {
  return {
    ...origin,
    state: {
      ...origin.state,
      loading: true,
      data: {
        list: [],
        pagination: {},
      },
    },
    effects: {
      ...origin.effects,
      *fetch({ payload }, { call, put }) {
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const result = yield call(fetcher, payload);
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
      ...origin.reducers,
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
}
