import { dispatchPlugin } from "./dispatchPlugin.js";
import { effectsPlugin } from "./effectsPlugin.js";
import { pluginFactory } from "./pluginFactory.js";
import createRedux from "./createRedux";
let plugins = [dispatchPlugin, effectsPlugin];

/**
 * Rematch class
 */
export default function Rematch(config) {
  this.effects = {};
  this.plugins = [];
  this.config = { ...config, plugins };
  this.pluginFactory = pluginFactory(config); //返回对象,包含plugins上导出的函数代理到自身
  this.config.plugins.forEach(item => {
    let result = this.pluginFactory.create(item);
    this.plugins.push(result);
  });
  /**
   * this.plugins即plugins中函数部分
   */
  console.log(this.plugins);
  //合并中间件
  this.forEachPlugin("middleware", middleware => {
    this.config.redux.middlewares.push(middleware);
  });
}
/**
 * this.plugins=[{onModel: ƒ, onStoreCreated: ƒ},{onModel: ƒ, middleware: ƒ}]
 */
Rematch.prototype.forEachPlugin = function (method, fn) {
  this.plugins.forEach(plugin => plugin[method] && fn(plugin[method]));
};
// 将插件添加
Rematch.prototype.addModel = function (model) {
  this.forEachPlugin("onModel", onModel => onModel(model));
};
//合并插件
Rematch.prototype.getModels = function (models) {
  return Object.keys(models).map(name => ({
    ...models[name],
    reducers: models[name].reducers || {},
    name,
  }));
};
Rematch.prototype.createRedux = createRedux;
Rematch.prototype.init = function () {
  this.models = this.getModels(this.config.models) || [];
  /**
   * 第一步 先将拿到的models对象,转成数组形态
   */
  console.log(this.models);
  /**
   * 先在dispatchPlugin 的 onModel 中取 name 和 reducers 进行拼接,更新this.dispatch
   * 后在effectsPlugin 的 onModel 中取 name 和 effects 进行触发
   * 核心
   */
  this.models.forEach(model => this.addModel(model));
  console.log(this.models);
  let { store, mergeReducers, createModelReducer } = this.createRedux({
    redux: this.config.redux,
    models: this.models,
  });
  let rematchStore = Object.assign(
    store,
    { name: this.config.name },
    {
      model: model => {
        this.addModel(model);
        mergeReducers(createModelReducer(model));
        store.dispatch({ type: "@@redux/REPLACE " });
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
