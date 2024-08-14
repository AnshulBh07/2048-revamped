import React, { useCallback, useEffect, useState } from "react";
import styles from "../../sass/gameBoardStyles.module.scss";
import Tile from "./Tile";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { generateNewTile } from "../../services/helperFunctions";
import { useDispatch } from "react-redux";
import { position } from "../../services/interfaces";

type coordinates = [number, number];

function GameBoard() {
  const [changed, setChanged] = useState<coordinates[]>([]);

  const { matrix, rows, columns, maxScore, gap, tileWidth } = useSelector(
    (state: RootState) => state.game
  );

  const dispatch: AppDispatch = useDispatch();

  const handleKeyUP = useCallback(() => {
    // format the array and update the score accordingly
    let moveScore = 0;

    // calculate new matrix after the action is performed
    const currMatrix = matrix.map((row) => [...row]);

    // ALGORITHM FOR EACH MOVE IS
    // 1. clear zeroes
    // 2. apply slide and add accordingly, replace the tile that adds and slides with zero
    // 3. clear zeroes again
    // 4. append zeroes at the end according to direction

    for (let j = 0; j < columns; j++) {
      let arr = [];

      for (let i = 0; i < rows; i++) {
        arr.push(currMatrix[i][j]);
      }

      arr = arr.filter((ele) => ele !== 0);

      for (let k = 0; k < arr.length - 1; k++) {
        if (arr[k + 1] === arr[k]) {
          arr[k] = arr[k] * 2;
          arr[k + 1] = 0;
          moveScore += arr[k];
        }
      }

      arr = arr.filter((ele) => ele !== 0);

      while (arr.length < rows) {
        arr.push(0);
      }

      for (let i = 0; i < rows; i++) {
        currMatrix[i][j] = arr[i];
      }
    }

    const ansTuple = generateNewTile(rows, columns, currMatrix);

    if (!ansTuple[0]) {
      // set game over
      console.log("game is over");
      return;
    }

    dispatch({ type: "game/set_currScore", payload: moveScore });
    dispatch({ type: "game/set_maxScore", payload: maxScore + moveScore });

    // set the newly got matrix as answer matrix
    dispatch({ type: "game/set_matrix", payload: ansTuple[1] });
    dispatch({ type: "game/set_new_tile_coords", payload: ansTuple[2] });
  }, [matrix, rows, columns, dispatch, maxScore]);

  const handleKeyDOWN = useCallback(() => {
    let moveScore = 0;

    const currMatrix = matrix.map((row) => [...row]);

    for (let j = 0; j < columns; j++) {
      let arr = [];

      for (let i = 0; i < rows; i++) {
        arr.push(currMatrix[i][j]);
      }

      arr.reverse();

      arr = arr.filter((ele) => ele !== 0);

      for (let k = 0; k < arr.length - 1; k++) {
        if (arr[k + 1] === arr[k]) {
          arr[k + 1] = 0;
          arr[k] = arr[k] * 2;
          moveScore += arr[k];
        }
      }

      arr = arr.filter((ele) => ele !== 0);

      while (arr.length < rows) {
        arr.push(0);
      }

      arr.reverse();

      for (let i = 0; i < rows; i++) {
        currMatrix[i][j] = arr[i];
      }
    }

    const ansTuple = generateNewTile(rows, columns, currMatrix);

    if (!ansTuple[0]) {
      // set game over
      console.log("game is over");
      return;
    }

    dispatch({ type: "game/set_currScore", payload: moveScore });
    dispatch({ type: "game/set_maxScore", payload: maxScore + moveScore });

    // set the newly got matrix as answer matrix
    dispatch({ type: "game/set_matrix", payload: ansTuple[1] });
    dispatch({ type: "game/set_new_tile_coords", payload: ansTuple[2] });
  }, [rows, columns, matrix, maxScore, dispatch]);

  const handleKeyRIGHT = useCallback(() => {
    let moveScore = 0;

    const currMatrix = matrix.map((row) => [...row]);

    for (let i = 0; i < rows; i++) {
      let arr = [];

      for (let j = 0; j < columns; j++) {
        arr.push(currMatrix[i][j]);
      }

      arr.reverse();

      arr = arr.filter((ele) => ele !== 0);

      for (let k = 0; k < arr.length - 1; k++) {
        if (arr[k + 1] === arr[k]) {
          arr[k] = arr[k] * 2;
          arr[k + 1] = 0;
          moveScore += arr[k];
        }
      }

      arr = arr.filter((ele) => ele !== 0);

      while (arr.length < columns) arr.push(0);

      arr.reverse();

      for (let j = 0; j < columns; j++) currMatrix[i][j] = arr[j];
    }

    const ansTuple = generateNewTile(rows, columns, currMatrix);

    if (!ansTuple[0]) {
      // set game over
      console.log("game is over");
      return;
    }

    dispatch({ type: "game/set_currScore", payload: moveScore });
    dispatch({ type: "game/set_maxScore", payload: maxScore + moveScore });

    // set the newly got matrix as answer matrix
    dispatch({ type: "game/set_matrix", payload: ansTuple[1] });
    dispatch({ type: "game/set_new_tile_coords", payload: ansTuple[2] });
  }, [rows, columns, matrix, maxScore, dispatch]);

  const handleKeyLEFT = useCallback(() => {
    let moveScore = 0;

    const currMatrix = matrix.map((row) => [...row]);

    const positionArr: position[] = [];

    for (let i = 0; i < rows; i++) {
      let prefixSum = 0;
      const prefixZeroes: number[] = [];

      let arr: number[] = [];

      for (let j = 0; j < columns; j++) {
        arr.push(currMatrix[i][j]);

        if (currMatrix[i][j] === 0) {
          prefixSum++;
        }

        prefixZeroes.push(prefixSum);

        if (currMatrix[i][j] !== 0) {
          positionArr.push({
            value: currMatrix[i][j],
            initialCoords: { row: i, column: j },
            finalCoords: { row: i, column: j - prefixZeroes[j] },
          });
        }
      }

      arr = arr.filter((ele) => ele !== 0);

      for (let k = 0; k < arr.length - 1; k++) {
        if (arr[k + 1] === arr[k] && arr[k] !== 0) {
          arr[k] = arr[k] * 2;
          arr[k + 1] = 0;

          // update coords in positions matrix as well
          const idx = positionArr.findIndex(
            (ele) =>
              ele.initialCoords.row === i && ele.finalCoords.column === k + 1
          );

          if (idx !== -1) positionArr[idx].finalCoords.column = k;

          moveScore += arr[k];
        }
      }

      arr = arr.filter((ele) => ele !== 0);

      while (arr.length < columns) arr.push(0);

      for (let j = 0; j < columns; j++) currMatrix[i][j] = arr[j];
    }

    const ansTuple = generateNewTile(rows, columns, currMatrix);

    if (!ansTuple[0]) {
      // set game over
      dispatch({ type: "game/set_status", payload: "game over" });
      return;
    }

    dispatch({ type: "game/set_currScore", payload: moveScore });
    dispatch({ type: "game/set_maxScore", payload: maxScore + moveScore });
    dispatch({ type: "game/set_positions", payload: positionArr });

    // set the newly got matrix as answer matrix
    dispatch({ type: "game/set_matrix", payload: ansTuple[1] });
    dispatch({ type: "game/set_new_tile_coords", payload: ansTuple[2] });
  }, [columns, rows, dispatch, matrix, maxScore]);

  // useEffect hook that handles the keyboard events like arrow keys
  useEffect(() => {
    // functions to handle keydown for 4 directions
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const { key } = e;

      switch (key) {
        case "ArrowUp":
          handleKeyUP();
          break;
        case "ArrowDown":
          handleKeyDOWN();
          break;
        case "ArrowLeft":
          handleKeyLEFT();
          break;
        case "ArrowRight":
          handleKeyRIGHT();
          break;
        default:
          break;
      }
    };

    // add event listener to dom
    document.addEventListener(
      "keydown",
      handleKeyDown as unknown as EventListener
    );

    // cleanup
    return () =>
      document.removeEventListener(
        "keydown",
        handleKeyDown as unknown as EventListener
      );
  }, [handleKeyUP, handleKeyDOWN, handleKeyLEFT, handleKeyRIGHT]);

  const containerWidth = tileWidth * rows + gap * (rows + 1);
  const containerHeight = tileWidth * columns + gap * (columns + 1);

  return (
    <div
      className={styles.container}
      style={{ height: `${containerHeight}rem`, width: `${containerWidth}rem` }}
    >
      {/* make base grid */}
      <div
        className={styles.base}
        style={{
          gridTemplateRows: `repeat(${rows},auto)`,
          gridTemplateColumns: `repeat(${columns},1fr)`,
          gap: `${gap}rem`,
          padding: `${gap}rem`,
        }}
      >
        {new Array(rows * columns).fill(0).map((_, index) => {
          return <Tile key={index} value={null} x={-1} y={-1} />;
        })}
      </div>

      {/* make middle slider matrix */}

      {/* make top final result matrix */}
      <div
        className={styles.top}
        style={{
          gridTemplateRows: `repeat(${rows},auto)`,
          gridTemplateColumns: `repeat(${columns},1fr)`,
          gap: `${gap}rem`,
          padding: `${gap}rem`,
        }}
      >
        {matrix.map((row, i) => {
          return row.map((value, j) => {
            return (
              <Tile
                key={`${i}-${j}`}
                value={value === 0 ? null : value}
                x={i}
                y={j}
              />
            );
          });
        })}

        {/* {matrix.flat().map((value, index) => {
          return <Tile key={index} value={value === 0 ? null : value} />;
        })} */}
      </div>
    </div>
  );
}

export default GameBoard;
