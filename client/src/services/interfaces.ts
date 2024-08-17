export type coordinates = [number, number];

export type position = {
  isMerged: boolean;
  value: number;
  initialCoords: { row: number; column: number };
  finalCoords: { row: number; column: number };
};

export interface IGameState {
  prevMatrix: number[][];
  matrix: number[][];
  maxScore: number;
  currScore: number;
  status: string;
  best: number;
  rows: number;
  columns: number;
  undo: boolean;
  scoreAnimate: boolean;
  slide: boolean;
  tileWidth: number;
  gap: number;
  font_size: number;
  newTileCoords: coordinates[];
  mergeTileCoords: coordinates[];
  positionsArr: position[]; //matrix that stores the initial and final position of each ele along with value
}
