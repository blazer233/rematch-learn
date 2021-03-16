import { __awaiter, __generator, __spreadArrays } from "./util";
/**
 * Effects Plugin
 *插件及处理异步action
 */
export const effectsPlugin = {
  exposed: {
    // exposed：暴露给全局的属性和方法，可以理解为占位符，用于数据的共享
    // expose effects for access from dispatch plugin
    effects: {},
  },
  // add effects to dispatch so that dispatch[modelName][effectName] calls an effect
  onModel: function (model) {
    if (!model.effects) {
      return;
    }
    var effects =
      typeof model.effects === "function"
        ? model.effects(this.dispatch)
        : model.effects;
    for (var _i = 0, _a = Object.keys(effects); _i < _a.length; _i++) {
      var effectName = _a[_i];
      this.effects[model.name + "/" + effectName] = effects[effectName].bind(
        this.dispatch[model.name]
      );
      // add effect to dispatch
      // is assuming dispatch is available already... that the dispatch plugin is in there
      this.dispatch[model.name][effectName] = this.createDispatcher.apply(
        this,
        [model.name, effectName]
      );
      // tag effects so they can be differentiated from normal actions
      this.dispatch[model.name][effectName].isEffect = true;
    }
  },
  // process async/await actions
  middleware: function (store) {
    var _this = this;
    return function (next) {
      return function (action) {
        return __awaiter(_this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                if (!(action.type in this.effects)) return [3 /*break*/, 2];
                return [4 /*yield*/, next(action)];
              case 1:
                _a.sent();
                return [
                  2 /*return*/,
                  this.effects[action.type](
                    action.payload,
                    store.getState(),
                    action.meta
                  ),
                ];
              case 2:
                return [2 /*return*/, next(action)];
            }
          });
        });
      };
    };
  },
};
