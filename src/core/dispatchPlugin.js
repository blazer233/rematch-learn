/**
 * 生成 dispatch
 * [modelName][actionName]
 *
 */
export const dispatchPlugin = {
  exposed: {
    /**
     * dispatch
     * exposed：暴露给全局的属性和方法，可以理解为占位符，用于数据的共享
     * dispatch此时为更高级别的dispatch
     */
    dispatch: function (action) {
      return this.storeDispatch(action);
    },
    createDispatcher: function (modelName, reducerName) {
      //剥掉一层,触发时的type拼装而成
      return (payload, meta) => {
        this.dispatch({
          type: modelName + "/" + reducerName,
          payload,
          meta,
        });
      };
    },
  },
  // 对model上的每个reducer创建action createor，并挂载到dispatch对象上
  onModel: function ({ name, reducers }) {
    this.dispatch[name] = {};
    if (!reducers) return;
    /**
     * 这个插件用来处理model的reducers属性，如果model没有reducers，
     * 就直接退出；否则，遍历reducers，通过createDispatcher函数，对每个reducer进行处理(拼接)，
     * 包装成一个异步的action creator，action的type由model.name和reducerName组成。
     * onStoreCreated属性，会返回增强后的dispatch方法去重置redux默认的dispatch方法。
     */
    Object.keys(reducers).forEach(rName => {
      //name 命名空间 rName reducer名称
      this.dispatch[name][rName] = this.createDispatcher(name, rName);
    });
  },
  // 在store创建完成的时候调用，将增强后的dispatch方法抛出
  onStoreCreated: function ({ dispatch }) {
    this.storeDispatch = dispatch;
    return { dispatch: this.dispatch };
  },
};
