import { __awaiter, __generator } from "./util";
import { pluginFactory } from "./pluginFactory.js";
import { dispatchPlugin } from "./dispatchPlugin.js";
import { effectsPlugin } from "./effectsPlugin.js";
import ActionTypes from "./common.js";
import { createStore, compose, applyMiddleware } from "./createStore.js";
import combineReducers from "./combineReducers.js";
import bindActionCreators from "./thunk.js";
import { mergeConfig } from "./merge";
var Redux = Object.freeze({
  __proto__: null,
  __DO_NOT_USE__ActionTypes: ActionTypes,
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  compose,
  createStore,
});
var count = 0;
var corePlugins = [dispatchPlugin, effectsPlugin];
/**
 * Rematch class
 */
function Rematch(config) {
  this.effects = {};
  this.plugins = [];
  this.config = { ...config, plugins: config.plugins.concat(corePlugins) };
  this.pluginFactory = pluginFactory(config);
  console.log(this.pluginFactory);
  this.config.plugins.forEach(item => {
    let result = this.pluginFactory.create(item);
    this.plugins.push(result);
    console.log(item, result);
  });
  this.forEachPlugin(
    "middleware",
    (middleware, arg) => {
      if (Array.isArray(arg) && arg.every(i => typeof i == "function")) {
        this.config.redux.middlewares.push(middleware, ...arg);
      }
      this.config.redux.middlewares.push(middleware);
    },
    this.config.npmhanlder
  );
}
Rematch.prototype.forEachPlugin = function (method, fn, arg) {
  /**
   * this.plugins=[{onModel: ƒ, onStoreCreated: ƒ},{onModel: ƒ, middleware: ƒ}]
   */
  this.plugins.forEach(plugin => {
    if (plugin[method]) fn(plugin[method], arg);
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
Rematch.prototype.createRedux = function ({ redux, models }) {
  console.log(redux, models);
  var combineReducers$1 = redux.combineReducers || combineReducers;
  var createStore$1 = redux.createStore || createStore;
  var initialState = redux.initialState ? redux.initialState : {};
  this.reducers = redux.reducers;
  // combine models to generate reducers
  this.mergeReducers = function (nextReducers) {
    if (!nextReducers) nextReducers = {};
    // Object.assign new reducers with existing reducers
    this.reducers = Object.assign(this.reducers, nextReducers, {});
    if (!Object.keys(this.reducers).length) {
      // no reducers, just return state
      return state => state;
    }
    return combineReducers$1(this.reducers);
  };
  this.createModelReducer = function ({
    baseReducer,
    reducers,
    name,
    state: modelState,
  }) {
    var modelReducers = {};
    Object.keys(reducers || {}).forEach(modelAction => {
      var action = modelAction.includes("/")
        ? modelAction
        : name + "/" + modelAction;
      modelReducers[action] = reducers[modelAction];
    });
    var combinedReducer = function (state, action) {
      //action:{type: "@@redux/INITb.3.f.g.m.d"}
      if (!state) state = modelState;
      // 异步
      if (typeof modelReducers[action.type] === "function") {
        return modelReducers[action.type](state, action.payload, action.meta);
      }
      return state;
    };
    this.reducers[name] = !baseReducer
      ? combinedReducer
      : (state, action) => combinedReducer(baseReducer(state, action), action);
  };
  // initialize model reducers
  models.forEach(model => this.createModelReducer(model));
  this.createRootReducer = function (rootReducers) {
    if (!rootReducers) rootReducers = {};
    var mergedReducers = this.mergeReducers();
    if (Object.keys(rootReducers).length) {
      return function (state, action) {
        var rootReducerAction = rootReducers[action.type];
        if (rootReducers[action.type]) {
          return mergedReducers(rootReducerAction(state, action), action);
        }
        return mergedReducers(state, action);
      };
    }
    return mergedReducers;
  };
  var rootReducer = this.createRootReducer(redux.rootReducers);
  var middlewares = applyMiddleware.apply(Redux, redux.middlewares);
  this.store = createStore$1(rootReducer, initialState, middlewares);
  return this;
};
Rematch.prototype.init = function () {
  this.models = this.getModels(this.config.models) || [];
  this.models.forEach(model => this.addModel(model));
  console.log(this.config.models, this.models);
  var redux = this.createRedux({
    redux: this.config.redux,
    models: this.models,
  });
  var rematchStore = Object.assign(
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
    var returned = onStoreCreated(rematchStore);
    if (returned) {
      Object.keys(returned || {}).forEach(function (key) {
        rematchStore[key] = returned[key];
      });
    }
  });
  return rematchStore;
};
export const init = (initConfig, npmhanlder) => {
  if (!initConfig) initConfig = {};
  count += 1;
  var name = initConfig.name || count;
  var config = mergeConfig({ ...initConfig, name, npmhanlder });
  console.log(initConfig, config);
  return new Rematch(config).init();
};
