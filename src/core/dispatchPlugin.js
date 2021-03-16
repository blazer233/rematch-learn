import { __awaiter, __generator, __spreadArrays } from "./util";
/**
 * 生成 dispatch
 * [modelName][actionName]
 */
export const dispatchPlugin = {
  exposed: {
    /**
     * dispatch
     * exposed：暴露给全局的属性和方法，可以理解为占位符，用于数据的共享
     * both a function (dispatch) and an object (dispatch[modelName][actionName])
     * @param action R.Action
     */
    dispatch: function (action) {
      return this.storeDispatch(action);
    },
    /**
     * createDispatcher
     *
     * genereates an action creator for a given model & reducer
     * @param modelName string
     * @param reducerName string
     */
    createDispatcher: function (modelName, reducerName) {
      var _this = this;
      return function (payload, meta) {
        return __awaiter(_this, void 0, Promise, function () {
          var action;
          return __generator(this, function (_a) {
            action = { type: modelName + "/" + reducerName };
            if (typeof payload !== "undefined") {
              action.payload = payload;
            }
            if (typeof meta !== "undefined") {
              action.meta = meta;
            }
            return [2 /*return*/, this.dispatch(action)];
          });
        });
      };
    },
  },
  // 对model上的每个reducer创建action createor，并挂载到dispatch对象上
  onModel: function ({ name, reducers }) {
    this.dispatch[name] = {};
    /**
     * 这个插件用来处理model的reducers属性，如果model没有reducers，
     * 就直接退出；否则，遍历reducers，通过createDispatcher函数，对每个reducer进行处理，
     * 包装成一个异步的action creator，action的type由model.name和reducerName组成。
     * onStoreCreated属性，会返回增强后的dispatch方法去重置redux默认的dispatch方法。
     */
    if (!reducers) return;
    let len = Object.keys(reducers);
    console.log(this)
    for (var i = 0; i < len.length; i++) {
      var reducerName = len[i];
      this.dispatch[name][reducerName] = this.createDispatcher.apply(this, [
        name,
        reducerName,
      ]);
    }
  },
  // 在store创建完成的时候调用，将增强后的dispatch方法抛出
  onStoreCreated: function (store) {
    this.storeDispatch = store.dispatch;
    this.storeGetState = store.getState;
    return { dispatch: this.dispatch };
  },
};
