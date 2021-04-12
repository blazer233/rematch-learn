const delay = time => new Promise(resolve => setTimeout(() => resolve(), time));
export const addByAction = () => ({ type: "addBy" });
export const addByTwoAction = () => ({ type: "addByTwo" });
export const addByAsyncAction = () => async (dispatch, getState) => {
  await delay(1000);
  dispatch(addByAction());
};
export const addByTwoAsyncAction = () => async (dispatch, getState) => {
  await delay(1000);
  dispatch(addByTwoAction());
};

export const addBynumAction = () => ({ type: "addBynum" });
export const addByTwonumAction = () => ({ type: "addByTwonum" });
export const addByAsyncnumAction = () => async (dispatch, getState) => {
  await delay(1000);
  dispatch(addBynumAction());
};
export const addByTwoAsyncnumAction = () => async (dispatch, getState) => {
  await delay(1000);
  dispatch(addByTwonumAction());
};
