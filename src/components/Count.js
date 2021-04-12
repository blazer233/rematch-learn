import React from "react";
import { connect } from "react-redux";
import {
  addBynumAction,
  addByTwonumAction,
  addByAsyncnumAction,
  addByTwoAsyncnumAction,
} from "../reduxStore/action";
const Count = props => (
  <div style={{ textAlign: "center", marginTop: "20rem" }}>
    <h1>The count is: {props.num}</h1>
    <button onClick={props.addByOne}>Add 1</button>
    <button onClick={props.addByTwo}>Add 2</button>
    <button onClick={props.addByOneAsync}>Add 1 Async</button>
    <button onClick={props.addByTwoAsync}>Add 2 Async</button>
  </div>
);

let mapState;
let mapDispatch;

if (process.env.REACT_APP_ENV == "rematch") {
  mapState = state => ({
    num: state.num,
  });
  mapDispatch = dispatch => ({
    addByOne: () => dispatch.num.addBynum(1),
    addByTwo: () => dispatch.num.addByTwonum(2),
    addByOneAsync: () => dispatch.num.addByAsyncnum(1),
    addByTwoAsync: () => dispatch.num.addByTwoAsyncnum(1),
  });
} else {
  mapState = state => ({
    num: state.num.state,
  });
  mapDispatch = dispatch => ({
    addByOne: () => dispatch(addBynumAction()),
    addByTwo: () => dispatch(addByTwonumAction()),
    addByOneAsync: () => dispatch(addByAsyncnumAction()),
    addByTwoAsync: () => dispatch(addByTwoAsyncnumAction()),
  });
}
export default connect(mapState, mapDispatch)(Count);
