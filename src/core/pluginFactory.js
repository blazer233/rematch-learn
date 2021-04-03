/**
 *插件扩展继承
 */
export const pluginFactory = function (config) {
  return {
    config: config,
    create: function (plugin) {
      let result = {};
      let exposed = plugin.exposed;
      if (exposed) {
        //在this上挂在函数
        Object.keys(exposed).forEach(key => {
          this[key] =
            typeof exposed[key] === "function"
              ? exposed[key].bind(this) // bind functions to plugin class
              : Object.create(exposed[key]); // add exposed to plugin class
        });
      }
      ["onModel", "middleware", "onStoreCreated"].forEach(i => {
        if (plugin[i]) {
          result[i] = plugin[i].bind(this);
        }
      });
      return result;
    },
  };
};
