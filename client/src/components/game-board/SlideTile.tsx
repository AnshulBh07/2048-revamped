import React, { useCallback, useEffect, useState } from "react";
import styles from "../../sass/slideTileStyles.module.scss";
import { decideColorFn } from "../../services/helperFunctions";
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
  const { tileWidth, gap } = useSelector((state: RootState) => state.game);

  const calculateTilePos: (coords: {
    row: number;
    column: number;
  }) => TilePosition = useCallback(
    (coords) => {
      return {
        top: gap + coords.row * (tileWidth + gap),
        left: gap + coords.column * (tileWidth + gap),
      };
    },
    [gap, tileWidth]
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
        height: `${tileWidth}rem`,
        width: `${tileWidth}rem`,
        top: `${tilePos.top}rem`,
        left: `${tilePos.left}rem`,
      }}
    >
      {position.value}
    </div>
  );
};

export default SlideTile;
