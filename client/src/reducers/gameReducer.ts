import { coordinates, IGameState, position } from "../services/interfaces";

const initialState: IGameState = {
  prevMatrix: new Array(4).fill(null).map(() => new Array(4).fill(0)),
  matrix: new Array(4).fill(null).map(() => new Array(4).fill(0)),
  positionsArr: [],
  maxScore: 0,
  currScore: 0,
  status: "not started",
  best: 0,
  rows: 4,
  columns: 4,
  undo: true,
  scoreAnimate: false,
  tileWidth: 0,
  newTileCoords: [],
  gap: 0,
};

type matrixType = number[][];

type coordsMatrix = coordinates[];

type actionType = {
  type: string;
  payload?: number | matrixType | string | boolean | coordsMatrix | position[];
};

export const gameReducer = (state = initialState, action: actionType) => {
  switch (action.type) {
    case "game/set_matrix":
      return { ...state, matrix: action.payload as matrixType };
    case "game/set_undo":
      return { ...state, undo: action.payload as boolean };
    case "game/set_prev":
      return { ...state, prevMatrix: action.payload as matrixType };
    case "game/set_score_animate":
      return { ...state, scoreAnimate: action.payload as boolean };
    case "game/set_currScore":
      return { ...state, currScore: action.payload as number };
    case "game/set_maxScore":
      return { ...state, maxScore: action.payload as number };
    case "game/set_tileWidth":
      return { ...state, tileWidth: action.payload as number };
    case "game/set_new_tile_coords":
      return { ...state, newTileCoords: action.payload as coordsMatrix };
    case "game/set_gap":
      return { ...state, gap: action.payload as number };
    case "game/set_positions":
      return { ...state, positionsArr: action.payload as position[] };
    case "game/reset":
      return initialState;
    default:
      return state;
  }
};
