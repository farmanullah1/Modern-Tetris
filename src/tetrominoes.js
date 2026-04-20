export const TETROMINOES = {
  0: { shape: [[0]], color: 'transparent' },
  I: {
    shape: [
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0]
    ],
    color: 'var(--color-I)',
  },
  J: {
    shape: [
      [0, 'J', 0],
      [0, 'J', 0],
      ['J', 'J', 0]
    ],
    color: 'var(--color-J)',
  },
  L: {
    shape: [
      [0, 'L', 0],
      [0, 'L', 0],
      [0, 'L', 'L']
    ],
    color: 'var(--color-L)',
  },
  O: {
    shape: [
      ['O', 'O'],
      ['O', 'O']
    ],
    color: 'var(--color-O)',
  },
  S: {
    shape: [
      [0, 'S', 'S'],
      ['S', 'S', 0],
      [0, 0, 0]
    ],
    color: 'var(--color-S)',
  },
  T: {
    shape: [
      [0, 0, 0],
      ['T', 'T', 'T'],
      [0, 'T', 0]
    ],
    color: 'var(--color-T)',
  },
  Z: {
    shape: [
      ['Z', 'Z', 0],
      [0, 'Z', 'Z'],
      [0, 0, 0]
    ],
    color: 'var(--color-Z)',
  },
};

export const randomTetromino = () => {
  const tetrominos = 'IJLOSTZ';
  const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOES[randTetromino];
};