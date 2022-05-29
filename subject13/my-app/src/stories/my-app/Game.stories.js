import { Game } from '../../components/Game'

export default {
  title: 'Game Component',
  component: Game
}

export const DrawGame = () => {
  return (
    <Game
      history={drawHistory}
      stepNumber={9}
      xIsNext={true}
      handleClick={() => {}}
      jumpTo={() => {}}
      calculateWinner={() => null}
    />
  )
}

// 引き分け状態を再現したHistory
const drawHistory = [{"squares":[null,null,null,null,null,null,null,null,null]},{"squares":["X",null,null,null,null,null,null,null,null]},{"squares":["X","O",null,null,null,null,null,null,null]},{"squares":["X","O","X",null,null,null,null,null,null]},{"squares":["X","O","X",null,null,"O",null,null,null]},{"squares":["X","O","X","X",null,"O",null,null,null]},{"squares":["X","O","X","X",null,"O","O",null,null]},{"squares":["X","O","X","X","X","O","O",null,null]},{"squares":["X","O","X","X","X","O","O",null,"O"]},{"squares":["X","O","X","X","X","O","O","X","O"]}]
