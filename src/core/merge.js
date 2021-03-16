/**
 * merge init configs together
 */
export const mergeConfig = function (initConfig) {
  var config = {
    ...initConfig,
    plugins: [],
    redux: Object.assign(
      { reducers: {}, rootReducers: {}, enhancers: [], middlewares: [] },
      initConfig.redux
    ),
  };
  for (var _i = 0, _a = config.plugins; _i < _a.length; _i++) {
    var plugin = _a[_i];
    if (plugin.config) {
      // models
      var models = Object.assign(config.models, plugin.config.models);
      config.models = models;
      // plugins
      config.plugins = config.plugins.concat(plugin.config.plugins || []);
      // redux
      if (plugin.config.redux) {
        config.redux.initialState = Object.assign(
          config.redux.initialState,
          plugin.config.redux.initialState
        );
        config.redux.reducers = Object.assign(
          config.redux.reducers,
          plugin.config.redux.reducers
        );
        config.redux.rootReducers = Object.assign(
          config.redux.rootReducers,
          plugin.config.redux.reducers
        );
        config.redux.enhancers = config.redux.enhancers.concat(
          plugin.config.redux.enhancers || []
        );
        config.redux.middlewares = config.redux.middlewares.concat(
          plugin.config.redux.middlewares || []
        );
        config.redux.combineReducers =
          config.redux.combineReducers || plugin.config.redux.combineReducers;
        config.redux.createStore =
          config.redux.createStore || plugin.config.redux.createStore;
      }
    }
  }
  return config;
};
