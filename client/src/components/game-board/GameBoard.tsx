import React, { useCallback, useEffect } from "react";
import styles from "../../sass/gameBoardStyles.module.scss";
import Tile from "./Tile";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  calculateValues,
  generateNewTile,
  hasWon,
  isEndOfGame,
} from "../../services/helperFunctions";
import { useDispatch } from "react-redux";
import { position } from "../../services/interfaces";
import SlideTile from "./SlideTile";

function GameBoard() {
  const {
    matrix,
    rows,
    columns,
    maxScore,
    gap,
    tileWidth,
    slide,
    positionsArr,
    screen,
    font_size,
  } = useSelector((state: RootState) => state.game);

  const dispatch: AppDispatch = useDispatch();

  const handleKeyUP = useCallback(() => {
    // format the array and update the score accordingly
    let moveScore = 0;

    // calculate new matrix after the action is performed
    dispatch({ type: "game/set_prev", payload: matrix });
    const currMatrix = matrix.map((row) => [...row]);
    const prevMatrix = matrix.map((row) => [...row]);
    const positionArr: position[] = [];

    if (isEndOfGame(currMatrix)) {
      // set game over
      dispatch({ type: "game/set_status", payload: "game over" });
      return;
    }

    // ALGORITHM FOR EACH MOVE IS
    // 1. clear zeroes
    // 2. apply slide and add accordingly, replace the tile that adds and slides with zero
    // 3. clear zeroes again
    // 4. append zeroes at the end according to direction

    for (let j = 0; j < columns; j++) {
      let arr = [];
      let prefixSum = 0;

      for (let i = 0; i < rows; i++) {
        arr.push(currMatrix[i][j]);

        if (currMatrix[i][j] === 0) prefixSum++;

        if (currMatrix[i][j] !== 0) {
          positionArr.push({
            isMerged: false,
            value: currMatrix[i][j],
            initialCoords: { row: i, column: j },
            finalCoords: { row: i - prefixSum, column: j },
          });
        }
      }

      arr = arr.filter((ele) => ele !== 0);

      for (let k = 0; k < arr.length - 1; k++) {
        if (arr[k + 1] === arr[k]) {
          arr[k] = arr[k] * 2;
          arr[k + 1] = 0;
          moveScore += arr[k];

          const idx = positionArr.findIndex(
            (ele) =>
              ele.initialCoords.column === j && ele.finalCoords.row === k + 1
          );

          if (idx !== -1) {
            positionArr[idx].finalCoords.row = k;
            positionArr[idx].isMerged = true;
          }
        }
      }

      // before filtering zeroes again update final coords for each non zero tile
      let finalPrefixSum = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 0) finalPrefixSum++;
        else {
          // find the tile in positions array and update its final coords
          const idx = positionArr.findIndex(
            (ele) => ele.initialCoords.column === j && ele.finalCoords.row === i
          );

          if (idx !== -1) positionArr[idx].finalCoords.row = i - finalPrefixSum;
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

    // if curr matrix is same as prev matrix then do nothing and return
    if (
      prevMatrix.every((row, i) =>
        row.every((ele, j) => ele === currMatrix[i][j])
      )
    )
      return;

    const ansTuple = generateNewTile(rows, columns, currMatrix);

    dispatch({ type: "game/set_slide", payload: true });

    setTimeout(() => {
      dispatch({ type: "game/set_slide", payload: false });
    }, 200);

    dispatch({ type: "game/set_currScore", payload: moveScore });
    dispatch({ type: "game/set_maxScore", payload: maxScore + moveScore });
    dispatch({ type: "game/set_positions", payload: positionArr });

    // set the newly got matrix as answer matrix
    dispatch({ type: "game/set_matrix", payload: ansTuple[1] });
    dispatch({ type: "game/set_new_tile_coords", payload: ansTuple[2] });
  }, [matrix, rows, columns, dispatch, maxScore]);

  const handleKeyDOWN = useCallback(() => {
    let moveScore = 0;

    const currMatrix = matrix.map((row) => [...row]);
    dispatch({ type: "game/set_prev", payload: matrix });
    const prevMatrix = matrix.map((row) => [...row]);
    const positionArr: position[] = [];

    if (isEndOfGame(currMatrix)) {
      // set game over
      dispatch({ type: "game/set_status", payload: "game over" });
      return;
    }

    for (let j = 0; j < columns; j++) {
      let arr = [];
      let prefixSum = 0;

      for (let i = 0; i < rows; i++) {
        arr.push(currMatrix[i][j]);
      }

      for (let i = rows - 1; i >= 0; i--) {
        if (currMatrix[i][j] === 0) prefixSum++;

        if (currMatrix[i][j] !== 0) {
          positionArr.push({
            isMerged: false,
            value: currMatrix[i][j],
            initialCoords: { row: i, column: j },
            finalCoords: { row: i + prefixSum, column: j },
          });
        }
      }

      arr = arr.filter((ele) => ele !== 0);

      while (arr.length < rows) {
        arr.unshift(0);
      }

      for (let k = arr.length - 1; k > 0; k--) {
        if (arr[k - 1] === arr[k]) {
          arr[k - 1] = 0;
          arr[k] = arr[k] * 2;
          moveScore += arr[k];

          // update in positions as well
          const idx = positionArr.findIndex(
            (ele) =>
              ele.initialCoords.column === j && ele.finalCoords.row === k - 1
          );

          if (idx !== -1) {
            positionArr[idx].finalCoords.row = k;
            positionArr[idx].isMerged = true;
          }
        }
      }

      // before filtering zeroes again update final coords for each non zero tile
      let finalPrefixSum = 0;

      for (let i = rows - 1; i >= 0; i--) {
        if (arr[i] === 0) finalPrefixSum++;
        else {
          // find the tile in positions array and update its final coords
          const idx = positionArr.findIndex(
            (ele) => ele.initialCoords.column === j && ele.finalCoords.row === i
          );

          if (idx !== -1) positionArr[idx].finalCoords.row = i + finalPrefixSum;
        }
      }

      arr = arr.filter((ele) => ele !== 0);

      while (arr.length < rows) {
        arr.unshift(0);
      }

      for (let i = 0; i < rows; i++) {
        currMatrix[i][j] = arr[i];
      }
    }

    // if curr matrix is same as prev matrix then do nothing and return
    if (
      prevMatrix.every((row, i) =>
        row.every((ele, j) => ele === currMatrix[i][j])
      )
    )
      return;

    const ansTuple = generateNewTile(rows, columns, currMatrix);

    dispatch({ type: "game/set_slide", payload: true });

    setTimeout(() => {
      dispatch({ type: "game/set_slide", payload: false });
    }, 200);

    dispatch({ type: "game/set_currScore", payload: moveScore });
    dispatch({ type: "game/set_maxScore", payload: maxScore + moveScore });
    dispatch({ type: "game/set_positions", payload: positionArr });

    // set the newly got matrix as answer matrix
    dispatch({ type: "game/set_matrix", payload: ansTuple[1] });
    dispatch({ type: "game/set_new_tile_coords", payload: ansTuple[2] });
  }, [rows, columns, matrix, maxScore, dispatch]);

  const handleKeyRIGHT = useCallback(() => {
    let moveScore = 0;

    const currMatrix = matrix.map((row) => [...row]);
    const prevMatrix = matrix.map((row) => [...row]);
    dispatch({ type: "game/set_prev", payload: matrix });

    if (isEndOfGame(currMatrix)) {
      // set game over
      dispatch({ type: "game/set_status", payload: "game over" });
      return;
    }

    const positionArr: position[] = [];

    for (let i = 0; i < rows; i++) {
      let arr = [];
      let prefixSum = 0;

      for (let j = 0; j < columns; j++) {
        arr.push(currMatrix[i][j]);
      }

      // traverse from last column to calculate initial slide
      for (let j = columns - 1; j >= 0; j--) {
        if (currMatrix[i][j] === 0) prefixSum++;

        if (currMatrix[i][j] !== 0) {
          positionArr.push({
            isMerged: false,
            value: currMatrix[i][j],
            initialCoords: { row: i, column: j },
            finalCoords: { row: i, column: j + prefixSum },
          });
        }
      }

      arr = arr.filter((ele) => ele !== 0);

      while (arr.length < columns) {
        arr.unshift(0);
      }

      for (let k = arr.length - 1; k > 0; k--) {
        if (arr[k - 1] === arr[k]) {
          arr[k] = arr[k] * 2;
          arr[k - 1] = 0;
          moveScore += arr[k];

          // update in positions as well
          const idx = positionArr.findIndex(
            (ele) =>
              ele.initialCoords.row === i && ele.finalCoords.column === k - 1
          );

          if (idx !== -1) {
            positionArr[idx].finalCoords.column = k;
            positionArr[idx].isMerged = true;
          }
        }
      }

      let finalPrefixSum = 0;

      for (let j = columns - 1; j >= 0; j--) {
        if (arr[j] === 0) finalPrefixSum++;
        else {
          // find the tile in positions array and update its final coords
          const idx = positionArr.findIndex(
            (ele) => ele.initialCoords.row === i && ele.finalCoords.column === j
          );

          if (idx !== -1)
            positionArr[idx].finalCoords.column = j + finalPrefixSum;
        }
      }

      arr = arr.filter((ele) => ele !== 0);

      while (arr.length < columns) arr.unshift(0);

      for (let j = 0; j < columns; j++) currMatrix[i][j] = arr[j];
    }

    // if curr matrix is same as prev matrix then do nothing and return
    if (
      prevMatrix.every((row, i) =>
        row.every((ele, j) => ele === currMatrix[i][j])
      )
    )
      return;

    const ansTuple = generateNewTile(rows, columns, currMatrix);

    dispatch({ type: "game/set_slide", payload: true });

    setTimeout(() => {
      dispatch({ type: "game/set_slide", payload: false });
    }, 200);

    dispatch({ type: "game/set_currScore", payload: moveScore });
    dispatch({ type: "game/set_maxScore", payload: maxScore + moveScore });
    dispatch({ type: "game/set_positions", payload: positionArr });

    // set the newly got matrix as answer matrix
    dispatch({ type: "game/set_matrix", payload: ansTuple[1] });
    dispatch({ type: "game/set_new_tile_coords", payload: ansTuple[2] });
  }, [rows, columns, matrix, maxScore, dispatch]);

  const handleKeyLEFT = useCallback(() => {
    let moveScore = 0;

    const currMatrix = matrix.map((row) => [...row]);
    const prevMatrix = matrix.map((row) => [...row]);
    dispatch({ type: "game/set_prev", payload: matrix });

    if (isEndOfGame(currMatrix)) {
      // set game over
      dispatch({ type: "game/set_status", payload: "game over" });
      return;
    }

    const positionArr: position[] = [];

    for (let i = 0; i < rows; i++) {
      let prefixSum = 0;
      let arr: number[] = [];

      for (let j = 0; j < columns; j++) {
        arr.push(currMatrix[i][j]);

        if (currMatrix[i][j] === 0) {
          prefixSum++;
        }

        if (currMatrix[i][j] !== 0) {
          positionArr.push({
            isMerged: false,
            value: currMatrix[i][j],
            initialCoords: { row: i, column: j },
            finalCoords: { row: i, column: j - prefixSum },
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

          if (idx !== -1) {
            positionArr[idx].finalCoords.column = k;
            positionArr[idx].isMerged = true;
          }

          moveScore += arr[k];
        }
      }

      // before filtering zeroes again update final coords for each non zero tile
      let finalPrefixSum = 0;
      for (let j = 0; j < arr.length; j++) {
        if (arr[j] === 0) finalPrefixSum++;
        else {
          // find the tile in positions array and update its final coords
          const idx = positionArr.findIndex(
            (ele) => ele.initialCoords.row === i && ele.finalCoords.column === j
          );

          if (idx !== -1)
            positionArr[idx].finalCoords.column = j - finalPrefixSum;
        }
      }

      arr = arr.filter((ele) => ele !== 0);

      while (arr.length < columns) arr.push(0);

      for (let j = 0; j < columns; j++) currMatrix[i][j] = arr[j];
    }

    // if curr matrix is same as prev matrix then do nothing and return
    if (
      prevMatrix.every((row, i) =>
        row.every((ele, j) => ele === currMatrix[i][j])
      )
    )
      return;

    const ansTuple = generateNewTile(rows, columns, currMatrix);

    dispatch({ type: "game/set_slide", payload: true });

    setTimeout(() => {
      dispatch({ type: "game/set_slide", payload: false });
    }, 200);

    dispatch({ type: "game/set_currScore", payload: moveScore });
    dispatch({ type: "game/set_maxScore", payload: maxScore + moveScore });
    dispatch({ type: "game/set_positions", payload: positionArr });

    // set the newly got matrix as answer matrix
    dispatch({ type: "game/set_matrix", payload: ansTuple[1] });
    dispatch({ type: "game/set_new_tile_coords", payload: ansTuple[2] });
  }, [columns, rows, dispatch, matrix, maxScore]);

  useEffect(() => {
    if (hasWon(matrix))
      dispatch({ type: "game/set_status", payload: "game win" });
  }, [dispatch, matrix]);

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

  // useEffect that adds swipe functionality
  useEffect(() => {
    let touchStartX = 0,
      touchStartY = 0,
      touchEndX = 0,
      touchEndY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      const { touches } = e;

      touchStartX = touches[0].clientX;
      touchStartY = touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const { touches } = e;

      touchEndX = touches[0].clientX;
      touchEndY = touches[0].clientY;

      const deltaY = touchEndY - touchStartY;

      if (deltaY > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // it is horizontal movement
        if (deltaX > 0) {
          handleKeyRIGHT();
        } else {
          handleKeyLEFT();
        }
      } else {
        // it is vertical movement
        if (deltaY > 0) {
          handleKeyDOWN();
        } else {
          handleKeyUP();
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleKeyDOWN, handleKeyLEFT, handleKeyRIGHT, handleKeyUP]);

  const fnValues = calculateValues(tileWidth, gap, font_size, screen);

  const containerWidth = fnValues[0] * rows + fnValues[1] * (rows + 1);
  const containerHeight = fnValues[0] * columns + fnValues[1] * (columns + 1);

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
          gap: `${fnValues[1]}rem`,
          padding: `${fnValues[1]}rem`,
        }}
      >
        {new Array(rows * columns).fill(0).map((_, index) => {
          return <Tile key={index} value={null} x={-1} y={-1} />;
        })}
      </div>

      {/* make middle slider matrix, using positions array that keeps track of all non zero tiles */}
      {positionsArr.length > 0 && slide && (
        <div className={styles.slide_layer}>
          {positionsArr.map((position, idx) => (
            <SlideTile
              key={`${position.initialCoords.row}-${position.initialCoords.column}-${position.finalCoords.row}-${position.finalCoords.column}-${position.value}-${idx}`}
              position={position}
            />
          ))}
        </div>
      )}

      {/* make top final result matrix */}
      {!slide && (
        <div
          className={styles.top}
          style={{
            gridTemplateRows: `repeat(${rows},auto)`,
            gridTemplateColumns: `repeat(${columns},1fr)`,
            gap: `${fnValues[1]}rem`,
            padding: `${fnValues[1]}rem`,
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
        </div>
      )}
    </div>
  );
}

export default GameBoard;
