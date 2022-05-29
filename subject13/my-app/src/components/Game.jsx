import React from "react"
import { Board } from "./Board"
import { Status } from "./Status"
import { Moves } from "./Moves"
export class Game extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const current = this.props.history[this.props.stepNumber]

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.props.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>
            <Status
              winner={this.props.calculateWinner(current.squares)}
              stepNumber={this.props.stepNumber}
              xIsNext={this.props.xIsNext}
            />
          </div>
          <Moves
            history={this.props.history}
            onClick={(move) => this.props.jumpTo(move)}
          />
        </div>
      </div>
    );
  }
}
