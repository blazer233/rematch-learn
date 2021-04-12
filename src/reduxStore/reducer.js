const len = (stateDefault = { state: 0 }, { type }) => {
  if (type == "addBy") {
    return { ...stateDefault, state: stateDefault.state + 1 };
  }
  if (type == "addByTwo") {
    return { ...stateDefault, state: stateDefault.state + 2 };
  }
  return stateDefault;
};

const num = (stateDefault = { state: 0 }, { type }) => {
  if (type == "addBynum") {
    return { ...stateDefault, state: stateDefault.state + 1 };
  }
  if (type == "addByTwonum") {
    return { ...stateDefault, state: stateDefault.state + 2 };
  }
  return stateDefault;
};
export default { len, num };
