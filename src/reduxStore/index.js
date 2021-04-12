import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import reducer from "./reducer";
export default createStore(
  combineReducers(reducer),
  compose(applyMiddleware(thunk, logger))
);
