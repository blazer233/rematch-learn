import React from "react";
import { connect } from "react-redux";

const Count = props => (
  <div style={{ textAlign: "center", marginTop: "20rem" }}>
    <h1>The count is: {props.num}</h1>
    <button onClick={props.addByOne}>Add 1</button>
    <button onClick={props.addByTwo}>Add 2</button>
    <button onClick={props.addByOneAsync}>Add 1 Async</button>
    <button onClick={props.addByTwoAsync}>Add 2 Async</button>
  </div>
);

const mapState = state => ({
  num: state.num,
});

const mapDispatch = ({
  num: { addBynum, addByTwonum, addByAsyncnum, addByTwoAsyncnum },
}) => ({
  addByOne: () => addBynum(1),
  addByTwo: () => addByTwonum(2),
  addByOneAsync: () => addByAsyncnum(1),
  addByTwoAsync: () => addByTwoAsyncnum(1),
});

export default connect(mapState, mapDispatch)(Count);
