import { useState, useEffect, useCallback } from 'react';
import { createStage, checkCollision, randomTetromino, STAGE_WIDTH, TETROMINOES } from './tetrominoes';

export const useTetris = () => {
  const [board, setBoard] = useState(createStage());
  const [player, setPlayer] = useState({ pos: { x: 0, y: 0 }, tetromino: TETROMINOES[0 as keyof typeof TETROMINOES].shape, collided: false });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('modernTetrisHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [nextPiece, setNextPiece] = useState(randomTetromino());
  const [holdPiece, setHoldPiece] = useState<any>(null);
  const [canHold, setCanHold] = useState(true);
  const [lastClear, setLastClear] = useState(0); // For animation triggers

  // Sync high score to local storage
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('modernTetrisHighScore', score.toString());
    }
  }, [score, highScore]);

  const getGhostPos = () => {
    let dropY = 0;
    while (!checkCollision({ ...player, pos: { x: player.pos.x, y: player.pos.y + dropY } }, board, { x: 0, y: 1 })) {
      dropY++;
      if (dropY > 25) break; 
    }
    return player.pos.y + dropY;
  };

  const updatePlayerPos = ({ x, y, collided }: any) => {
    setPlayer(prev => ({ ...prev, pos: { x: prev.pos.x + x, y: prev.pos.y + y }, collided }));
  };

  const spawnPiece = useCallback((piece = nextPiece) => {
    setPlayer({ pos: { x: STAGE_WIDTH / 2 - 2, y: 0 }, tetromino: piece.shape, collided: false });
    setNextPiece(randomTetromino());
    setCanHold(true);
  }, [nextPiece]);

  const rotate = useCallback((matrix: any[][]) => {
    const rotated = matrix[0].map((_, index) => matrix.map(col => col[index]));
    return rotated.map(row => row.reverse());
  }, []);

  const playerRotate = useCallback(() => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino);
    let offset = 1;
    while (checkCollision(clonedPlayer, board, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (Math.abs(offset) > clonedPlayer.tetromino[0].length) return; 
    }
    setPlayer(clonedPlayer);
  }, [player, board, rotate]);

  const triggerHold = useCallback(() => {
    if (!canHold || gameOver) return;
    const currentShape = player.tetromino;
    if (!holdPiece) {
      setHoldPiece({ shape: currentShape });
      spawnPiece();
    } else {
      setPlayer({ pos: { x: STAGE_WIDTH / 2 - 2, y: 0 }, tetromino: holdPiece.shape, collided: false });
      setHoldPiece({ shape: currentShape });
    }
    setCanHold(false);
  }, [canHold, player, holdPiece, spawnPiece, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;
    let dropSpeed = 1000 / level + 200;
    const drop = () => {
      if (!checkCollision(player, board, { x: 0, y: 1 })) {
        updatePlayerPos({ x: 0, y: 1, collided: false });
      } else {
        if (player.pos.y < 1) {
          setGameOver(true);
          return;
        }
        updatePlayerPos({ x: 0, y: 0, collided: true });
      }
    };
    const interval = setInterval(drop, dropSpeed);
    return () => clearInterval(interval);
  }, [player, board, gameOver, isPaused, level]);

  useEffect(() => {
    if (!player.collided) return;

    setBoard(prev => {
      const newBoard = prev.map(row => [...row]);
      player.tetromino.forEach((row: any, y: number) => {
        row.forEach((value: any, x: number) => {
          if (value !== 0) {
            newBoard[y + player.pos.y][x + player.pos.x] = [value, 'merged'];
          }
        });
      });

      let linesCleared = 0;
      const sweptBoard = newBoard.reduce((ack, row) => {
        if (row.findIndex((cell: any) => cell[0] === 0) === -1) {
          linesCleared++;
          ack.unshift(new Array(STAGE_WIDTH).fill([0, 'clear']));
          return ack;
        }
        ack.push(row);
        return ack;
      }, []);

      if (linesCleared > 0) {
        setLines(prev => prev + linesCleared);
        setScore(prev => prev + [40, 100, 300, 1200][linesCleared - 1] * level);
        setLastClear(Date.now()); // Trigger animation
        if (lines + linesCleared >= level * 10) setLevel(prev => prev + 1);
      }

      spawnPiece();
      return sweptBoard;
    });
  }, [player.collided]);

  const startGame = () => {
    setBoard(createStage());
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setIsPaused(false);
    setHoldPiece(null);
    spawnPiece();
  };

  return { board, player, score, highScore, level, lines, gameOver, isPaused, setIsPaused, startGame, updatePlayerPos, playerRotate, nextPiece, holdPiece, triggerHold, getGhostPos, lastClear };
};