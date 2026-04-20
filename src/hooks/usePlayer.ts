import { useState, useCallback } from 'react';
import { randomTetromino, TETROMINOES } from '../tetrominoes';
import { STAGE_WIDTH } from '../gameHelpers';

export const usePlayer = () => {
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOES[0].shape,
    collided: false,
  });

  const updatePlayerPos = ({ x, y, collided }: { x: number; y: number; collided: boolean }) => {
    setPlayer(prev => ({
      ...prev,
      pos: { x: (prev.pos.x + x), y: (prev.pos.y + y) },
      collided,
    }));
  };

  const resetPlayer = useCallback(() => {
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 }, // Spawns in the top middle
      tetromino: randomTetromino().shape,
      collided: false,
    });
  }, []);

  return [player, updatePlayerPos, resetPlayer] as const;
};