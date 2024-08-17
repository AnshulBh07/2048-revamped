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
  slide: false,
  scoreAnimate: false,
  tileWidth: 0,
  newTileCoords: [],
  mergeTileCoords: [],
  gap: 0,
  font_size: 2.5,
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
    case "game/set_new_tile_coords":
      return { ...state, newTileCoords: action.payload as coordsMatrix };
    case "game/set_positions":
      return { ...state, positionsArr: action.payload as position[] };
    case "game/set_status":
      return { ...state, status: action.payload as string };
    case "game/set_merge_tile_coords":
      return { ...state, mergeTileCoords: action.payload as coordsMatrix };
    case "game/set_slide":
      return { ...state, slide: action.payload as boolean };
    case "game/set_game":
      switch (action.payload) {
        case "4x4":
          return {
            ...state,
            rows: 4,
            columns: 4,
            gap: 0.5,
            tileWidth: 6.5,
            font_size: 2.5,
            prevMatrix: new Array(4).fill(null).map(() => new Array(4).fill(0)),
            matrix: new Array(4).fill(null).map(() => new Array(4).fill(0)),
          };
        case "5x5":
          return {
            ...state,
            rows: 5,
            columns: 5,
            gap: 0.4,
            tileWidth: 5.2,
            font_size: 2,
            prevMatrix: new Array(5).fill(null).map(() => new Array(5).fill(0)),
            matrix: new Array(5).fill(null).map(() => new Array(5).fill(0)),
          };
        case "6x6":
          return {
            ...state,
            rows: 6,
            columns: 6,
            gap: 0.4,
            tileWidth: 4.3,
            font_size: 1.75,
            prevMatrix: new Array(6).fill(null).map(() => new Array(6).fill(0)),
            matrix: new Array(6).fill(null).map(() => new Array(6).fill(0)),
          };
        case "8x8":
          return {
            ...state,
            rows: 8,
            columns: 8,
            gap: 0.25,
            tileWidth: 3.25,
            font_size: 1.25,
            prevMatrix: new Array(8).fill(null).map(() => new Array(8).fill(0)),
            matrix: new Array(8).fill(null).map(() => new Array(8).fill(0)),
          };
        default:
          return state;
      }
    case "game/reset":
      return initialState;
    default:
      return state;
  }
};
