import React from "react";
import ReactDOM from "react-dom";
// import { init } from "@rematch/core";
import { init } from "./core";
import { Provider } from "react-redux";
import * as models from "./models";
import Count from "./Count";
import logger from "redux-logger";
let ApplyMiddleware = [
  // store => next => action => {
  //   console.log("打点 >>>");
  //   next(action);
  //   console.log("打点 <<<");
  // },
  // store => next => action => {
  //   console.log("日志 >>>");
  //   next(action);
  //   console.log("日志 <<<");
  // },
  // logger,
  // ({ getState, dispatch }) => next => action => {
  //   console.group(action.type);
  //   console.info("dispatching", action);
  //   console.info("next state", getState());
  //   console.groupEnd();
  //   return next(action);
  // },
];
const store = init(
  {
    models,
  },
  ApplyMiddleware
);
console.log(store, models);
ReactDOM.render(
  <Provider store={store}>
    <Count />
  </Provider>,
  document.querySelector("#root")
);
