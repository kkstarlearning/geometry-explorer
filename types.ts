export enum ShapeType {
  PARALLELOGRAM = '平行四邊形',
  TRIANGLE = '三角形',
  TRAPEZOID = '梯形',
  QUIZ = '隨堂測驗'
}

export interface GridProps {
  size: number;
}

export interface InteractiveShapeProps {
  onAreaChange: (area: number) => void;
}
