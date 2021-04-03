const init = ({ models }) => {
  let modelArr = [];
  Object.keys(models).forEach(name => modelArr.push({ name, ...models[name] }));
  console.log(models, modelArr);
  const createStore = modelsArr => {
    let store = { state: {}, dispatch: {} };
    //defaultstate
    modelsArr.forEach(({ reducers, effects, name, state }) => {
      let dispatch = {};
      store.state[name] = state;
      //reducers
      Object.keys(reducers).forEach(_name => {
        let reducer = reducers[_name];
        if (typeof reducer == "function") {
          dispatch[_name] = payload => {
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
          dispatch[_name] = async payload =>
            await effect(dispatch, payload, store.state);
        }
      });
    });
    return store;
  };
  return createStore(modelArr);
};
export default init;
