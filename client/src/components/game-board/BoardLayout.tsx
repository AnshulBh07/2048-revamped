import React, { useEffect } from "react";
import ScoreTile from "./ScoreTile";
import styles from "../../sass/boardStylels.module.scss";
import GameBoard from "./GameBoard";
import { HiMiniHome } from "react-icons/hi2";
import { MdOutlineRestartAlt } from "react-icons/md";
import { FaUndoAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useDispatch } from "react-redux";
import { generateStartMatrix } from "../../services/helperFunctions";
import GameOverModal from "./GameOverModal";

function BoardLayout() {
  const {
    rows,
    columns,
    scoreAnimate,
    status,
    currScore,
    maxScore,
    tileWidth,
    prevMatrix,
    gap,
  } = useSelector((state: RootState) => state.game);
  const dispatch: AppDispatch = useDispatch();

  // we will use a useEffect hook to set the initial state of the matrix for game, this happens
  // only on component reload once or the rows or column changes
  useEffect(() => {
    if (rows && columns) {
      const fnValue = generateStartMatrix(rows, columns);

      dispatch({ type: "game/set_new_tile_coords", payload: fnValue[1] });
      dispatch({ type: "game/set_matrix", payload: fnValue[0] });
    }
  }, [columns, dispatch, rows]);

  useEffect(() => {
    if (maxScore > 0)
      dispatch({ type: "game/set_score_animate", payload: true });

    const timer = setTimeout(() => {
      dispatch({ type: "game/set_score_animate", payload: false });
    }, 600);

    return () => clearTimeout(timer);
  }, [maxScore, dispatch]);

  const handleRestartClick = () => {
    dispatch({ type: "game/reset" });
    const fnValue = generateStartMatrix(rows, columns);
    dispatch({ type: "game/set_matrix", payload: fnValue[0] });
    dispatch({ type: "game/set_new_tile_coords", payload: fnValue[1] });
    dispatch({ type: "game/set_tileWidth", payload: tileWidth });
    dispatch({ type: "game/set_gap", payload: gap });
  };

  const handleUndoClick = () => {
    dispatch({ type: "game/set_matrix", payload: prevMatrix });
  };

  useEffect(() => {
    dispatch({ type: "game/set_tileWidth", payload: 6.5 });
    dispatch({ type: "game/set_gap", payload: 0.5 });
  }, [dispatch]);

  return (
    <React.Fragment>
      <div className={styles.container}>
        <div className={styles.game_title}>
          <h1 className={styles.title1}>2048</h1>
          <div className={styles.score_cards_wrapper}>
            {/* score animation card */}
            <div className={styles.score_dummy}>
              {scoreAnimate && (
                <div className={styles.score_animation}>+{currScore}</div>
              )}
            </div>
            <ScoreTile title="Score" score={maxScore} />
            <ScoreTile title="Best" score={0} />
          </div>
        </div>

        <div className={styles.description}>
          <p style={{ fontWeight: "600" }}>Play 2048 game online</p>
          <p>
            Join the numbers and get to the{" "}
            <span style={{ fontWeight: "600" }}>2048 tile!</span>
          </p>
        </div>

        <div className={styles.buttons_wrapper}>
          <button className={styles.option_btn} style={{ marginRight: "auto" }}>
            <HiMiniHome className={styles.icon} />
          </button>
          <button className={styles.option_btn} onClick={handleUndoClick}>
            <FaUndoAlt className={styles.icon} />
          </button>
          <button className={styles.option_btn} onClick={handleRestartClick}>
            <MdOutlineRestartAlt
              className={styles.icon}
              style={{ height: "3.3rem", width: "3.3rem" }}
            />
          </button>
        </div>

        {/* Game Board */}
        <GameBoard />
      </div>

      {status.includes("game over") && <GameOverModal />}
    </React.Fragment>
  );
}

export default BoardLayout;
