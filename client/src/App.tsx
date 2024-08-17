import { useSelector } from "react-redux";
import styles from "./App.module.scss";
import BoardLayout from "./components/game-board/BoardLayout";
import LandingPage from "./components/landing/LandingPage";
import { RootState } from "./store";

function App() {
  const { status } = useSelector((state: RootState) => state.game);

  return (
    <div className={styles.container}>
      {status.includes("not started") ? <LandingPage /> : <BoardLayout />}
    </div>
  );
}

export default App;
