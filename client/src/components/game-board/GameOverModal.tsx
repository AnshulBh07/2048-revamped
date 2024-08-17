import styles from "../../sass/gameOverModalStyles.module.scss";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useDispatch } from "react-redux";
import { generateStartMatrix } from "../../services/helperFunctions";

export const GameOverModal = () => {
  const { maxScore, rows, columns, tileWidth, gap } = useSelector(
    (state: RootState) => state.game
  );

  const dispatch: AppDispatch = useDispatch();

  const handleTryAgainClick = () => {
    // reset
    dispatch({ type: "game/reset" });
    const fnValue = generateStartMatrix(rows, columns);
    dispatch({ type: "game/set_matrix", payload: fnValue[0] });
    dispatch({ type: "game/set_new_tile_coords", payload: fnValue[1] });
    dispatch({ type: "game/set_tileWidth", payload: tileWidth });
    dispatch({ type: "game/set_gap", payload: gap });
    dispatch({ type: "game/set_status", payload: "playing" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Game Over</h1>
        <h2 className={styles.score}>Your score is {maxScore}</h2>
        <button className={styles.retry_btn} onClick={handleTryAgainClick}>
          Try again
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
