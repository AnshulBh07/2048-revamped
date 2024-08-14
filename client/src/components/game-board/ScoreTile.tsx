import React from "react";
import styles from "../../sass/scoreTileStyles.module.scss";

interface IProps {
  title: string;
  score: number;
}

export const ScoreTile: React.FC<IProps> = ({ title, score }) => {
  return (
    <div className={styles.container}>
      <p className={styles.title}>{title}</p>
      <p className={styles.score}>{score}</p>
    </div>
  );
};

export default ScoreTile;
