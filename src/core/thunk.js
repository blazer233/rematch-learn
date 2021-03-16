const bindActionCreator = (actionCreator, dispatch) => next =>
  dispatch(actionCreator(...next));
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === "function") {
    return bindActionCreator(actionCreators, dispatch);
  }
  var boundActionCreators = {};
  for (var key in actionCreators) {
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === "function") {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }

  return boundActionCreators;
}

export default bindActionCreators;
