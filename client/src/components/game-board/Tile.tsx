import React from "react";
import styles from "../../sass/tileStyles.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { calculateValues, decideColorFn } from "../../services/helperFunctions";

interface IProps {
  value: number | null;
  x: number;
  y: number;
}

export const Tile: React.FC<IProps> = ({ value, x, y }) => {
  const { tileWidth, newTileCoords, positionsArr, font_size, gap, screen } =
    useSelector((state: RootState) => state.game);

  const isNewTile = () => {
    return newTileCoords.some((coord) => coord[0] === x && coord[1] === y);
  };

  const isMergedTile = () => {
    return positionsArr.some(
      (pos) =>
        pos.finalCoords.row === x &&
        pos.finalCoords.column === y &&
        pos.isMerged
    );
  };

  const fnValues = calculateValues(tileWidth, gap, font_size, screen);

  return (
    <div
      className={`${styles.tile} ${isNewTile() ? styles.animate : ""} ${
        isMergedTile() ? styles.merge_animate : ""
      }`}
      style={{
        backgroundColor: `${decideColorFn(value)[0]}`,
        color: `${decideColorFn(value)[1]}`,
        height: `${fnValues[0]}rem`,
        width: `${fnValues[0]}rem`,
        fontSize: `${fnValues[2]}rem`,
      }}
    >
      {value}
    </div>
  );
};

export default Tile;
