import React from "react";

export class Moves extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <ol>
      {
        this.props.history.map((step, move) => {
          const description = move ?
            'Go to move #' + move :
            'Go to game start'

            return (
              <li key={move}>
                <button
                  onClick={() => this.props.onClick(move)}
                >
                  {description}
                </button>
              </li>
            )
        })
      }
    </ol>
  }
}
