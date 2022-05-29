import React from "react";

export class Status extends React.Component {
  constructor(props) {
    super(props)
  }

  renderStatus() {
    if (this.props.winner) {
      return 'Winner: ' + this.props.winner;
    }

    if (this.props.stepNumber === 9) {
      return 'Draw!'
    } else {
      return '次のプレイヤー: ' + (this.props.xIsNext ? 'X' : 'O');
    }
  }

  render() {
    return <span>{this.renderStatus()}</span>
  }
}
