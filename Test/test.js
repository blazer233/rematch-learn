import init from "../src/kf_redux/core.js";
import { len, num } from "../src/models.js";

const mainObj = {};
const store = init({
  models: { len, num },
});
const connectRedux = () => ({
  stateMap: state => ({ allstate: state }),
  dispatchMap: dispatch => ({ getdispatchs: dispatch }),
});
let { stateMap, dispatchMap } = connectRedux();
if (dispatchMap && typeof dispatchMap == "function") {
  let funcs = dispatchMap(store.dispatch);
  Object.keys(funcs).forEach(name => (mainObj[name] = funcs[name]));
}
if (stateMap && typeof stateMap == "function") {
  let newData = stateMap(store.state) || {};
  Object.keys(newData).forEach(name => (mainObj[name] = newData[name]));
}
console.log(mainObj);
