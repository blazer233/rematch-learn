import { pluginFactory } from "./pluginFactory.js";
import { dispatchPlugin } from "./dispatchPlugin.js";
import { effectsPlugin } from "./effectsPlugin.js";
import ActionTypes from "./common.js";
import { createStore, compose, applyMiddleware } from "./createStore.js";
import combineReducers from "./combineReducers.js";
import bindActionCreators from "./thunk.js";
import mergeConfig from "./merge";
let Redux = Object.freeze({
  __proto__: null,
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  compose,
  createStore,
});
let count = 0;
let corePlugins = [dispatchPlugin, effectsPlugin];
/**
 * Rematch class
 */
function Rematch(config) {
  this.effects = {};
  this.plugins = [];
  this.config = { ...config, plugins: config.plugins.concat(corePlugins) };
  this.pluginFactory = pluginFactory(config);
  console.log(this.config,this.pluginFactory);
  this.config.plugins.forEach(item => {
    let result = this.pluginFactory.create(item);
    this.plugins.push(result);
    console.log(item, result);
  });
  this.forEachPlugin("middleware", middleware => {
    this.config.redux.middlewares.push(middleware);
  });
}
Rematch.prototype.forEachPlugin = function (method, fn) {
  /**
   * this.plugins=[{onModel: ƒ, onStoreCreated: ƒ},{onModel: ƒ, middleware: ƒ}]
   */
  this.plugins.forEach(plugin => {
    if (plugin[method]) fn(plugin[method]);
  });
};
//合并插件
Rematch.prototype.getModels = function (models) {
  let arrModels = Object.keys(models); //['count']
  return arrModels.map(name => ({
    ...models[name],
    reducers: models[name].reducers || {},
    name,
  }));
};
// 将插件添加
Rematch.prototype.addModel = function (model) {
  this.forEachPlugin("onModel", onModel => onModel(model));
};
Rematch.prototype.createRedux = function ({
  redux: { initialState = {}, reducers, rootReducers, middlewares },
  models,
}) {
  this.reducers = reducers;
  // combine models to generate reducers
  this.mergeReducers = function (nextReducers = {}) {
    this.reducers = Object.assign(this.reducers, nextReducers, {});
    if (!Object.keys(this.reducers).length) return state => state;
    return combineReducers(this.reducers);
  };
  this.createModelReducer = function ({
    baseReducer,
    reducers,
    name,
    state: modelState,
  }) {
    let modelReducers = {};
    let combinedReducer = function (state = modelState, action) {
      //action:{type: "@@redux/INITb.3.f.g.m.d"}
      if (typeof modelReducers[action.type] === "function") {
        return modelReducers[action.type](state, action.payload, action.meta);
      }
      return state;
    };
    Object.keys(reducers || {}).forEach(modelAction => {
      let action = modelAction.includes("/")
        ? modelAction
        : name + "/" + modelAction;
      modelReducers[action] = reducers[modelAction];
    });
    this.reducers[name] = baseReducer
      ? (state, action) => combinedReducer(baseReducer(state, action), action)
      : combinedReducer;
  };
  // initialize model reducers
  models.forEach(model => this.createModelReducer(model));
  this.createRootReducer = function (rootReducers) {
    let mergedReducers = this.mergeReducers();
    return (state, action) => {
      let rootReducerAction = rootReducers[action.type];
      if (rootReducers[action.type]) {
        return mergedReducers(rootReducerAction(state, action), action);
      }
      return mergedReducers(state, action);
    };
  };
  let rootReducer = Object.keys(rootReducers).length
    ? this.createRootReducer(rootReducers)
    : this.mergeReducers();
  var middlewares = applyMiddleware.apply(Redux, middlewares);
  this.store = createStore(rootReducer, initialState, middlewares);
  return this;
};
Rematch.prototype.init = function () {
  this.models = this.getModels(this.config.models) || [];
  this.models.forEach(model => this.addModel(model));
  console.log(this.config.models, this.models);
  let redux = this.createRedux({
    redux: this.config.redux,
    models: this.models,
  });
  let rematchStore = Object.assign(
    redux.store,
    { name: this.config.name },
    {
      model: model => {
        this.addModel(model);
        redux.mergeReducers(redux.createModelReducer(model));
        redux.store.dispatch({ type: "@@redux/REPLACE " });
      },
    }
  );
  this.forEachPlugin("onStoreCreated", function (onStoreCreated) {
    let complexDispatch = onStoreCreated(rematchStore); //返回改造后的dispatch
    Object.keys(complexDispatch).forEach(dispatch => {
      rematchStore[dispatch] = complexDispatch[dispatch];
    }); //将改造后的dispatch注入rematch
  });
  return rematchStore;
};
export const init = initConfig => {
  if (!initConfig) initConfig = {};
  count += 1;
  let name = initConfig.name || count;
  let config = mergeConfig({ ...initConfig, name });
  return new Rematch(config).init();
};
