import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Count from "./components/Count";
import Len from "./components/Len";
import reduxStore from "./reduxStore";
import rematchStore from "./rematchStore";

console.log(!process.env.REACT_APP_ENV ? "当前是redux" : "当前是rematch");
console.log(!process.env.REACT_APP_ENV ? reduxStore : rematchStore);
ReactDOM.render(
  <Provider store={!process.env.REACT_APP_ENV ? reduxStore : rematchStore}>
    <Len />
    <hr />
    <Count />
  </Provider>,
  document.querySelector("#root")
);
