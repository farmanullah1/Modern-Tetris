import { useState, useEffect } from 'react';
import { createStage } from '../gameHelpers';

export const useBoard = (player: any) => {
  const [board, setBoard] = useState(createStage());

  useEffect(() => {
    const updateBoard = (prevBoard: any) => {
      // 1. Flush the board (clear previous player position)
      const newBoard = prevBoard.map((row: any) =>
        row.map((cell: any) => (cell[1] === 'clear' ? [0, 'clear'] : cell))
      );

      // 2. Draw the player's tetromino
      player.tetromino.forEach((row: any, y: number) => {
        row.forEach((value: any, x: number) => {
          if (value !== 0) {
            newBoard[y + player.pos.y][x + player.pos.x] = [
              value,
              `${player.collided ? 'merged' : 'clear'}`,
            ];
          }
        });
      });

      return newBoard;
    };

    setBoard((prev) => updateBoard(prev));
  }, [player]);

  return [board, setBoard] as const;
};