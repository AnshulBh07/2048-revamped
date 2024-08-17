import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "../../sass/slideTileStyles.module.scss";
import { calculateValues, decideColorFn } from "../../services/helperFunctions";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { position } from "../../services/interfaces";

interface IProps {
  position: position;
}

type TilePosition = {
  top: number;
  left: number;
};

export const SlideTile: React.FC<IProps> = ({ position }) => {
  const { tileWidth, gap, font_size, screen } = useSelector(
    (state: RootState) => state.game
  );

  const fnValues = useMemo(
    () => calculateValues(tileWidth, gap, font_size, screen),
    [tileWidth, gap, font_size, screen]
  );

  const calculateTilePos: (coords: {
    row: number;
    column: number;
  }) => TilePosition = useCallback(
    (coords) => {
      return {
        top: fnValues[1] + coords.row * (fnValues[0] + fnValues[1]),
        left: fnValues[1] + coords.column * (fnValues[0] + fnValues[1]),
      };
    },
    [fnValues]
  );

  const [tilePos, setTilePos] = useState<TilePosition>(
    calculateTilePos(position.initialCoords)
  );

  useEffect(() => {
    const finalTilePos = calculateTilePos(position.finalCoords);

    setTilePos(finalTilePos);
  }, [calculateTilePos, position.finalCoords]);

  return (
    <div
      className={styles.tile}
      style={{
        backgroundColor: `${decideColorFn(position.value)[0]}`,
        color: `${decideColorFn(position.value)[1]}`,
        height: `${fnValues[0]}rem`,
        width: `${fnValues[0]}rem`,
        top: `${tilePos.top}rem`,
        left: `${tilePos.left}rem`,
        fontSize: `${fnValues[2]}rem`,
      }}
    >
      {position.value}
    </div>
  );
};

export default SlideTile;
