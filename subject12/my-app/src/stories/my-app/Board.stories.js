import { Board } from "../../components/Board"

export default {
  title: 'Board Component',
  component: Board
}

const onClick = (i) => i

export const AllTriangle = () => {
 return (
  <Board
    squares={[
      '△', '△', '△', 
      '△', '△', '△', 
      '△', '△', '△', 
    ]}
    onClick={onClick}
  />
 )
}
