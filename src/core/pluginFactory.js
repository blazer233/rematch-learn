/**
 *插件扩展继承
 */
export const pluginFactory = function (config) {
  return {
    config: config,
    create: function (plugin) {
      var result = {};
      if (plugin.exposed) {
        Object.keys(plugin.exposed).forEach(key => {
          this[key] =
            typeof plugin.exposed[key] === "function"
              ? plugin.exposed[key].bind(this) // bind functions to plugin class
              : Object.create(plugin.exposed[key]); // add exposed to plugin class
        });
      }
      for (
        var _b = 0, _c = ["onModel", "middleware", "onStoreCreated"];
        _b < _c.length;
        _b++
      ) {
        var method = _c[_b];
        if (plugin[method]) {
          result[method] = plugin[method].bind(this);
        }
      }
      return result;
    },
  };
};
