import React, { useEffect, useState } from 'react';
import { useTetris } from './useTetris';
import { checkCollision } from './tetrominoes';
import './index.css';

const App = () => {
  const [theme, setTheme] = useState('dark');
  const { board, player, score, level, lines, gameOver, isPaused, setIsPaused, startGame, updatePlayerPos, playerRotate, nextPiece, holdPiece, triggerHold, getGhostPos } = useTetris();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const move = (dir: number) => {
    if (!gameOver && !isPaused && !checkCollision(player, board, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  const hardDrop = () => {
    if (gameOver || isPaused) return;
    let dropY = getGhostPos() - player.pos.y;
    updatePlayerPos({ x: 0, y: dropY, collided: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (gameOver) return;
    if (e.key === 'ArrowLeft') move(-1);
    if (e.key === 'ArrowRight') move(1);
    if (e.key === 'ArrowDown') {
      if (!checkCollision(player, board, { x: 0, y: 1 })) updatePlayerPos({ x: 0, y: 1, collided: false });
    }
    if (e.key === 'ArrowUp') playerRotate();
    if (e.key === ' ') hardDrop();
    if (e.key === 'c' || e.key === 'C') triggerHold();
    if (e.key === 'p' || e.key === 'P') setIsPaused(p => !p);
  };

  const renderBoard = () => {
    const displayBoard = board.map(row => row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell)));
    const ghostY = getGhostPos();

    player.tetromino.forEach((row: any, y: number) => {
      row.forEach((value: any, x: number) => {
        if (value !== 0) {
          if (displayBoard[y + ghostY] && displayBoard[y + ghostY][x + player.pos.x] && displayBoard[y + ghostY][x + player.pos.x][1] === 'clear') {
            displayBoard[y + ghostY][x + player.pos.x] = [value, 'ghost'];
          }
          if (displayBoard[y + player.pos.y] && displayBoard[y + player.pos.y][x + player.pos.x]) {
            displayBoard[y + player.pos.y][x + player.pos.x] = [value, 'active'];
          }
        }
      });
    });

    return displayBoard;
  };

  const MiniGrid = ({ piece, title }: { piece: any, title: string }) => (
    <div className="glass-panel text-center w-full p-2">
      <span className="text-xs uppercase opacity-70 tracking-widest font-bold mb-2 block text-white">{title}</span>
      <div className="grid grid-cols-4 gap-[2px] mx-auto w-16 h-16 items-center justify-center">
        {/* THE FIX: Safe navigation operator added here to prevent crashes when piece is null */}
        {piece?.shape?.flatMap((row: any[], y: number) => 
          row.map((val: any, x: number) => (
            <div key={`${y}-${x}`} className="w-full pb-[100%] rounded-sm" style={{ background: val ? `var(--color-${val})` : 'transparent' }} />
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 outline-none" role="button" tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="glass-wrapper flex flex-col md:flex-row gap-6 p-6 md:p-8 w-full max-w-4xl relative">
        
        {/* Left Stats */}
        <aside className="flex flex-row md:flex-col gap-4 w-full md:w-48 order-2 md:order-1">
          <MiniGrid piece={holdPiece} title="Hold (C)" />
          <div className="glass-panel w-full p-4 flex flex-col gap-4 justify-between text-white">
            <div><span className="block text-xs uppercase opacity-70">Score</span><span className="text-2xl font-bold">{score}</span></div>
            <div><span className="block text-xs uppercase opacity-70">Level</span><span className="text-2xl font-bold">{level}</span></div>
            <div><span className="block text-xs uppercase opacity-70">Lines</span><span className="text-2xl font-bold">{lines}</span></div>
          </div>
        </aside>

        {/* Center Board */}
        <main className="flex-1 order-1 md:order-2 flex justify-center relative">
          <div className="tetris-board">
            {renderBoard().map((row, y) => row.map((cell: any, x: number) => (
              <div key={`${x}-${y}`} className="cell" 
                style={{ 
                  background: cell[0] === 0 ? 'transparent' : `var(--color-${cell[0]})`,
                  opacity: cell[1] === 'ghost' ? 0.25 : 1,
                  boxShadow: cell[0] !== 0 && cell[1] !== 'ghost' ? 'var(--glow-shadow)' : 'none'
                }} 
              />
            )))}
          </div>
          
          {/* Overlays */}
          {gameOver && <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm z-10">
              <h2 className="text-4xl font-bold text-red-500 mb-4">GAME OVER</h2>
              <button className="btn-primary px-6 py-2 rounded-lg font-bold" onClick={startGame}>Try Again</button>
          </div>}
          {isPaused && !gameOver && <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl backdrop-blur-sm z-10">
              <h2 className="text-3xl font-bold tracking-widest text-white">PAUSED</h2>
          </div>}
        </main>

        {/* Right Controls */}
        <aside className="flex flex-row md:flex-col gap-4 w-full md:w-48 order-3">
          <MiniGrid piece={nextPiece} title="Next" />
          <div className="flex flex-col gap-3 mt-auto w-full">
            <button className="btn-primary w-full py-3 rounded-lg font-bold shadow-lg" onClick={startGame}>
              {gameOver ? 'START GAME' : 'RESTART'}
            </button>
            <button className="btn-glass w-full py-3 rounded-lg font-bold text-white" onClick={() => setIsPaused(p => !p)}>
              {isPaused ? 'RESUME' : 'PAUSE'}
            </button>
            <button className="btn-glass w-full py-3 rounded-lg font-bold text-white" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
              TOGGLE SKIN
            </button>
          </div>
        </aside>
      </div>

      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-2 mt-6 md:hidden w-full max-w-[300px] text-white">
        <button className="btn-glass p-4 rounded-xl active:bg-white/20" onClick={() => move(-1)}>←</button>
        <button className="btn-glass p-4 rounded-xl active:bg-white/20" onClick={playerRotate}>↻</button>
        <button className="btn-glass p-4 rounded-xl active:bg-white/20" onClick={() => move(1)}>→</button>
        <button className="btn-glass p-4 rounded-xl active:bg-white/20" onClick={triggerHold}>Hold</button>
        <button className="btn-primary p-4 rounded-xl col-span-2 text-[#0f0c29]" onClick={hardDrop}>Hard Drop</button>
      </div>
    </div>
  );
};

export default App;