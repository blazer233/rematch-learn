import React from "react";
import ReactDOM from "react-dom";
// import { init } from "@rematch/core";
// import init from "./kf_redux/core";
import init from "./core";
import { Provider } from "react-redux";
import { len, num } from "./models";
import Count from "./components/Count";
import Len from "./components/Len";
import logger from "redux-logger";
let middlewares = [
  store => next => action => {
    console.log("打点 >>>");
    next(action);
    console.log("打点 <<<");
  },
  ({ getState, dispatch }) => next => action => {
    console.log("日志 >>>");
    next(action);
    console.log("日志 <<<");
  },
  logger,
  ({ getState, dispatch }) => next => action => {
    console.group(action.type);
    console.info("dispatching", action);
    console.info("next state", getState());
    console.groupEnd();
    return next(action);
  },
];
const store = init({
  models: { len, num },
  // redux: { middlewares },
});
console.log(store);
window.store = store;
ReactDOM.render(
  <Provider store={store}>
    <Len />
    <hr />
    <Count />
  </Provider>,
  document.querySelector("#root")
);
