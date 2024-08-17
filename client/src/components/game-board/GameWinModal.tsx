import styles from "../../sass/gameWinModalStyles.module.scss";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useDispatch } from "react-redux";

function GameWinModal() {
  const { maxScore } = useSelector((state: RootState) => state.game);
  const dispatch: AppDispatch = useDispatch();

  const handleRestartClick = () => {
    dispatch({ type: "game/reset" });
    dispatch({ type: "game/set_status", payload: "not started" });
  };

  const handleContinueClick = () => {
    dispatch({ type: "game/set_status", payload: "playing" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>You Win!</h1>
        <h2 className={styles.score}>Your score is {maxScore}</h2>
        <div className={styles.btns_wrapper}>
          <button className={styles.restart_btn} onClick={handleRestartClick}>
            Restart
          </button>
          <button className={styles.continue_btn} onClick={handleContinueClick}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameWinModal;
