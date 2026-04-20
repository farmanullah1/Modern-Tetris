export const STAGE_WIDTH = 10;
export const STAGE_HEIGHT = 20;

// Creates a 2D array representing the 10x20 Tetris board.
// Each cell contains an array: [tetrominoType, cellState]
export const createStage = () =>
  Array.from(Array(STAGE_HEIGHT), () =>
    new Array(STAGE_WIDTH).fill([0, 'clear'])
  );
  export const checkCollision = (
  player: any,
  stage: any[],
  { x: moveX, y: moveY }: { x: number; y: number }
) => {
  for (let y = 0; y < player.tetromino.length; y += 1) {
    for (let x = 0; x < player.tetromino[y].length; x += 1) {
      // 1. Check that we are looking at an actual Tetromino cell (not an empty part of its grid)
      if (player.tetromino[y][x] !== 0) {
        if (
          // 2. Check that our move is inside the game board's height (y)
          // We shouldn't go through the bottom of the play area
          !stage[y + player.pos.y + moveY] ||
          // 3. Check that our move is inside the game board's width (x)
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          // 4. Check that the cell we're moving to isn't set to 'clear' (meaning another piece is there)
          stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
        ) {
          return true;
        }
      }
    }
  }
  return false;
};