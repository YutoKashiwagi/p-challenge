import React from "react"

export function Square(props) {
  return (
    <button className="square" onClick={props.onClick} data-qa={`square${props.number}`}>
      {props.value}
    </button>
  );
}
