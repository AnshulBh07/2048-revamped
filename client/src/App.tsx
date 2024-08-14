import styles from "./App.module.scss";
import BoardLayout from "./components/game-board/BoardLayout";

function App() {
  return (
    <div className={styles.container}>
      <BoardLayout />
    </div>
  );
}

export default App;
