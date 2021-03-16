import React from "react";
import ReactDOM from "react-dom";
// import { init } from "@rematch/core";
import { init } from "./core";
import { Provider } from "react-redux";
import * as models from "./models";
import Count from "./Count";

const store = init({
  models,
});

ReactDOM.render(
  <Provider store={store}>
    <Count />
  </Provider>,
  document.querySelector("#root")
);
