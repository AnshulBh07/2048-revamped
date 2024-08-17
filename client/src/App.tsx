import { useSelector } from "react-redux";
import styles from "./App.module.scss";
import BoardLayout from "./components/game-board/BoardLayout";
import LandingPage from "./components/landing/LandingPage";
import { RootState } from "./store";
import ConfettiExplosion from "react-confetti-explosion";
import { useEffect, useState } from "react";

function App() {
  const { status } = useSelector((state: RootState) => state.game);

  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (status.includes("win")) setConfetti(true);
  }, [confetti, status]);

  return (
    <div className={styles.container}>
      {status.includes("not started") ? <LandingPage /> : <BoardLayout />}

      {confetti && (
        <div className={styles.confetti_container}>
          <ConfettiExplosion
            zIndex={10}
            height={3000}
            width={2000}
            duration={5000}
            particleCount={200}
            force={0.4}
            onComplete={() => setConfetti(false)}
            className={styles.confetti1}
          />
          <ConfettiExplosion
            zIndex={10}
            height={3000}
            particleCount={200}
            width={2000}
            duration={5000}
            force={0.4}
            onComplete={() => setConfetti(false)}
            className={styles.confetti2}
          />
        </div>
      )}
    </div>
  );
}

export default App;
