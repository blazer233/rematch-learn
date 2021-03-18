import React from "react";
import ReactDOM from "react-dom";
// import { init } from "@rematch/core";
import { init } from "./core";
import { Provider } from "react-redux";
import { len, num } from "./models";
import Count from "./Count";
import Len from "./Len";
import logger from "redux-logger";
let ApplyMiddleware = [
  store => next => action => {
    console.log("打点 >>>");
    next(action);
    console.log("打点 <<<");
  },
  store => next => action => {
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
const store = init(
  {
    models: { len, num },
  },
  ApplyMiddleware
);
window.store = store;
ReactDOM.render(
  <Provider store={store}>
    <Len />
    <hr />
    <Count />
  </Provider>,
  document.querySelector("#root")
);
