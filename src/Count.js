import React from "react";
import { connect } from "react-redux";

const Count = props => (
  <div style={{ textAlign: "center", marginTop: "20rem" }}>
    <h1>The count is: {props.count}</h1>
    <button onClick={props.addByOne}>Add 1</button>
    <button onClick={props.addByTwo}>Add 2</button>
    <button onClick={props.addByOneAsync}>Add 1 Async</button>
    <button onClick={props.addByTwoAsync}>Add 2 Async</button>
  </div>
);

const mapState = state => ({
  count: state.count,
});

const mapDispatch = ({
  count: { addBy, addByTwo, addByAsync, addByTwoAsync },
}) => ({
  addByOne: () => addBy(1),
  addByTwo: () => addByTwo(2),
  addByOneAsync: () => addByAsync(1),
  addByTwoAsync: () => addByTwoAsync(1),
});

export default connect(mapState, mapDispatch)(Count);
