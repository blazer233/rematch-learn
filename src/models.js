// function to create a one second delay

const delay = time => new Promise(resolve => setTimeout(() => resolve(), time));

// count model
export const len = {
  state: 0,
  reducers: {
    addBy(state, payload) {
      return state + payload;
    },
    addByTwo(state, payload) {
      return state + payload;
    },
  },
  effects: dispatch => ({
    async addByAsync(payload, state) {
      console.log(this, dispatch, payload, state);
      await delay(1000);
      this.addBy(1);
    },
    async addByTwoAsync(payload, state) {
      await delay(2000);
      this.addBy(2);
    },
  }),
}; // count model
export const num = {
  state: 100,
  reducers: {
    addBynum(state, payload) {
      return state + payload;
    },
    addByTwonum(state, payload) {
      return state + payload;
    },
  },
  effects: dispatch => ({
    async addByAsyncnum(payload, state) {
      //当前dispatch是经过加工的dispatch
      await delay(1000);
      this.addBynum(1);
    },
    async addByTwoAsyncnum(payload, state) {
      await delay(2000);
      this.addBynum(2);
    },
  }),
};
