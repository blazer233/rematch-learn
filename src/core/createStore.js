import ActionTypes from "./common.js";

export const createStore = function (reducer, preloadedState, enhancer) {
  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = undefined;
  }
  if (enhancer) return enhancer(createStore)(reducer, preloadedState);
  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  const getState = () => currentState;
  const subscribe = listener => currentListeners.push(listener);
  const dispatch = action => {
    currentState = currentReducer(currentState, action); // 覆盖原对象
    currentListeners.forEach(listener => listener());
    return action;
  };
  dispatch({
    type: ActionTypes.INIT,
  });
  return {
    dispatch,
    subscribe,
    getState,
  };
};
export const applyMiddleware = (...middlewares) => createStore => reducer => {
  //args即reducer, defaultstate
  var store = createStore(reducer);
  var dispatch = store.dispatch;
  var chain = [];
  var middlewareAPI = {
    getState: store.getState,
    dispatch: reducer => dispatch(reducer),
  };
  chain = middlewares.map(middleware => middleware(middlewareAPI));
  dispatch = compose(...chain)(store.dispatch);
  return {
    ...store,
    dispatch,
  };
};
/**
 *实现redux
 */
export const compose = (...funcs) => dispatchs => {
  return funcs.reduceRight((dispatch, fn) => {
    // console.log(fn(dispatch), fn);
    return fn(dispatch);
  }, dispatchs);
};
