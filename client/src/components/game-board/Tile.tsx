import React from "react";
import styles from "../../sass/tileStyles.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface IProps {
  value: number | null;
  x: number;
  y: number;
}

export const Tile: React.FC<IProps> = ({ value, x, y }) => {
  const { tileWidth, newTileCoords } = useSelector(
    (state: RootState) => state.game
  );

  // function that decides value of bg color and number color based on value
  const decideColorFn: (x: number | null) => [string, string] = () => {
    switch (value) {
      case null:
        return ["#cdc1b4", ""];
      case 2:
        return ["#eee4da", "#776e65"];
      case 4:
        return ["#ede0c8", "#776e65"];
      case 8:
        return ["#f2b179", "#f9f6f2"];
      case 16:
        return ["#f59563", "#f9f6f2"];
      case 32:
        return ["#f67c5f", "#f9f6f2"];
      case 64:
        return ["#f65e3b", "#f9f6f2"];
      case 128:
        return ["#edcf72", "#f9f6f2"];
      case 256:
        return ["#edcc61", "#f9f6f2"];
      case 512:
        return ["#edc850", "#f9f6f2"];
      case 1024:
        return ["#edc53f", "#f9f6f2"];
      case 2048:
        return ["#edc22e", "#f9f6f2"];
      case 4096:
        return ["#edc22e", "#f9f6f2"];
      case 8192:
        return ["#edc22e", "#f9f6f2"];
      default:
        return ["#cdc1b4", ""];
    }
  };

  const isNewTile = () => {
    return newTileCoords.some((coord) => coord[0] === x && coord[1] === y);
  };

  return (
    <div
      className={`${styles.tile} ${isNewTile() ? styles.animate : ""}`}
      style={{
        backgroundColor: `${decideColorFn(value)[0]}`,
        color: `${decideColorFn(value)[1]}`,
        height: `${tileWidth}rem`,
        width: `${tileWidth}rem`,
      }}
    >
      {value}
    </div>
  );
};

export default Tile;
