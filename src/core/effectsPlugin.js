/**
 * Effects Plugin
 *插件及处理异步action
 */
export const effectsPlugin = {
  exposed: {
    // exposed：暴露给全局的属性和方法，可以理解为占位符，用于数据的共享
    // 使得effects 可以通过this.effects获得
    effects: {},
  },
  // 将每个model上的effects添加到dispatch上，这样可以通过dispatch[modelName][effectName]来调用effect方法
  onModel: function ({ name, effects }) {
    if (!effects) return;
    console.log(this, this.dispatch[name]);
    // model的effects可以是一个对象，或者是一个返回对象的函数，这个函数的参数是全局的dispatch方法
    var effects =
      typeof effects === "function" ? effects(this.dispatch) : effects;
    Object.keys(effects).forEach(effectName => {
      this.effects[name + "/" + effectName] = effects[effectName].bind(
        this.dispatch[name]
      );
      this.dispatch[name][effectName] = this.createDispatcher(name, effectName);
      // isEffect用来区分是普通的action，还是异步的，后面的loading插件就是通过这个字段来判断是不是异步操作
      this.dispatch[name][effectName].isEffect = true;
    });
  },
  // process async/await actions
  middleware: function (store) {
    return next => action => {
      if (action.type in this.effects) {
        // 会把全局的state作为effect方法的第二个参数传入
        return this.effects[action.type](
          action.payload,
          store.getState(),
          action.meta
        );
      }
      return next(action);
    };
  },
};
