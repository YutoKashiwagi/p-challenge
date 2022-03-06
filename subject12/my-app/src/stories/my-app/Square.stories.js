import { Square } from "../../components/Square";

export default {
  title: 'Square Component',
  component: Square
}

export const OSquare = () => <Square value="O" />;
export const XSquare = () => <Square value="X" />;
export const TriangleSquare = () => <Square value="△" />;
