import React from "react";
import { connect } from "react-redux";
import {
  addByAction,
  addByTwoAction,
  addByAsyncAction,
  addByTwoAsyncAction,
} from "../reduxStore/action";
let mapState;
let mapDispatch;

const Count = props => (
  <div style={{ textAlign: "center", marginTop: "20rem" }}>
    <h1>The len is: {props.len}</h1>
    <button onClick={props.addByOne}>Add 1</button>
    <button onClick={props.addByTwo}>Add 2</button>
    <button onClick={props.addByOneAsync}>Add 1 Async</button>
    <button onClick={props.addByTwoAsync}>Add 2 Async</button>
  </div>
);

if (process.env.REACT_APP_ENV == "rematch") {
  mapState = state => ({
    len: state.len,
  });
  mapDispatch = ({ len: { addBy, addByTwo, addByAsync, addByTwoAsync } }) => ({
    addByOne: () => addBy(1),
    addByTwo: () => addByTwo(2),
    addByOneAsync: () => addByAsync(1),
    addByTwoAsync: () => addByTwoAsync(1),
  });
} else {
  mapState = state => ({
    len: state.len.state,
  });
  mapDispatch = dispatch => ({
    addByOne: () => dispatch(addByAction()),
    addByTwo: () => dispatch(addByTwoAction()),
    addByOneAsync: () => dispatch(addByAsyncAction()),
    addByTwoAsync: () => dispatch(addByTwoAsyncAction()),
  });
}
export default connect(mapState, mapDispatch)(Count);
