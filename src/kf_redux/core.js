const init = ({ models }) => {
  let modelArr = [];
  Object.keys(models).forEach(name => modelArr.push({ name, ...models[name] }));
  let store = { state: {}, dispatch: {} };
  //defaultstate
  modelArr.forEach(({ reducers, effects, name, state }) => {
    let _dispatch = {};
    store.state[name] = state;
    //reducers
    Object.keys(reducers).forEach(_name => {
      let reducer = reducers[_name];
      if (typeof reducer == "function") {
        _dispatch[_name] = payload => {
          store.state[name] = reducer(store.state[name], payload);
        };
      }
    });
    //effects
    let effectsObj =
      typeof effects == "function" ? effects(store.dispatch) : effects;
    Object.keys(effectsObj).forEach(_name => {
      let effect = effectsObj[_name];
      if (typeof effect == "function") {
        _dispatch[_name] = async payload =>
          await effect(_dispatch, payload, store.state);
      }
    });
    store.dispatch[name] = _dispatch;
  });
  return store;
};

export default init;
