import React from "react";
import styles from "../../sass/tileStyles.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { decideColorFn } from "../../services/helperFunctions";

interface IProps {
  value: number | null;
  x: number;
  y: number;
}

export const Tile: React.FC<IProps> = ({ value, x, y }) => {
  const { tileWidth, newTileCoords } = useSelector(
    (state: RootState) => state.game
  );

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
