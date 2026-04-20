export const STAGE_WIDTH = 10;
export const STAGE_HEIGHT = 20;

export const TETROMINOES = {
  0: { shape: [[0]], color: 'transparent' },
  I: { shape: [[0, 'I', 0, 0], [0, 'I', 0, 0], [0, 'I', 0, 0], [0, 'I', 0, 0]], color: 'var(--color-I)' },
  J: { shape: [[0, 'J', 0], [0, 'J', 0], ['J', 'J', 0]], color: 'var(--color-J)' },
  L: { shape: [[0, 'L', 0], [0, 'L', 0], [0, 'L', 'L']], color: 'var(--color-L)' },
  O: { shape: [['O', 'O'], ['O', 'O']], color: 'var(--color-O)' },
  S: { shape: [[0, 'S', 'S'], ['S', 'S', 0], [0, 0, 0]], color: 'var(--color-S)' },
  T: { shape: [[0, 0, 0], ['T', 'T', 'T'], [0, 'T', 0]], color: 'var(--color-T)' },
  Z: { shape: [['Z', 'Z', 0], [0, 'Z', 'Z'], [0, 0, 0]], color: 'var(--color-Z)' },
} as const;

export type TetrominoType = keyof typeof TETROMINOES;

export const randomTetromino = () => {
  const tetrominos = 'IJLOSTZ';
  const rand = tetrominos[Math.floor(Math.random() * tetrominos.length)] as TetrominoType;
  return TETROMINOES[rand];
};

export const createStage = () =>
  Array.from(Array(STAGE_HEIGHT), () => new Array(STAGE_WIDTH).fill([0, 'clear']));

export const checkCollision = (player: any, stage: any[], { x: moveX, y: moveY }: { x: number; y: number }) => {
  for (let y = 0; y < player.tetromino.length; y += 1) {
    for (let x = 0; x < player.tetromino[y].length; x += 1) {
      if (player.tetromino[y][x] !== 0) {
        if (
          !stage[y + player.pos.y + moveY] || 
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] || 
          stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
        ) {
          return true;
        }
      }
    }
  }
  return false;
};