import { len, num } from "./models";
import init from "./core";
import logger from "redux-logger";
// import { init } from "@rematch/core";
// import init from "./kf_redux/core";
const middlewares = [
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
export default init({
  models: { len, num },
  // redux: { middlewares },
});
