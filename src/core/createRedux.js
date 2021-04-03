import combineReducers from "./combineReducers.js";
import { createStore, applyMiddleware } from "./createStore.js";
export default ({
  redux: { initialState = {}, reducers, rootReducers, middlewares },
  models,
}) => {
  // 合并reducers
  let mergeReducers = (nextReducers = {}) => {
    reducers = Object.assign(reducers, nextReducers, {});
    if (!Object.keys(reducers).length) return state => state;
    return combineReducers(reducers);
  };
  let createModelReducer = ({
    baseReducer,
    name,
    reducers: _reducers,
    state: _state,
  }) => {
    let modelReducers = {};
    let combinedReducer = (state = _state, action) => {
      if (typeof modelReducers[action.type] === "function") {
        return modelReducers[action.type](state, action.payload, action.meta);
      }
      return state;
    };
    Object.keys(_reducers || {}).forEach(modelAction => {
      let action = modelAction.includes("/")
        ? modelAction
        : name + "/" + modelAction;
      modelReducers[action] = _reducers[modelAction];
    });
    reducers[name] = baseReducer
      ? (state, action) => combinedReducer(baseReducer(state, action), action)
      : combinedReducer;
  };
  // initialize model reducers
  models.forEach(model => createModelReducer(model));
  let createRootReducer = rootReducers => {
    let mergedReducers = mergeReducers();
    return (state, action) => {
      let rootReducerAction = rootReducers[action.type];
      if (rootReducers[action.type]) {
        return mergedReducers(rootReducerAction(state, action), action);
      }
      return mergedReducers(state, action);
    };
  };
  let rootReducer = Object.keys(rootReducers).length
    ? createRootReducer(rootReducers)
    : mergeReducers();
  var middlewares = applyMiddleware(...middlewares);
  return {
    store: createStore(rootReducer, initialState, middlewares),
    mergeReducers,
    createModelReducer,
  };
};
