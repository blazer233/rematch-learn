// function to create a one second delay

const delay = time => new Promise(resolve => setTimeout(() => resolve(), time));

// count model
export const count = {
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
      await delay(1000);
      this.addBy(1);
    },
    async addByTwoAsync(payload, state) {
      await delay(2000);
      this.addBy(2);
    },
  }),
};
