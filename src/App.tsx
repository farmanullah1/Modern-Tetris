import React, { useEffect, useState } from 'react';
import { useTetris } from './useTetris';
import { checkCollision } from './tetrominoes';
import './index.css';

const THEMES = ['dark', 'cinematic', 'light', 'matrix'];

const App = () => {
  const [themeIndex, setThemeIndex] = useState(0);
  const [shake, setShake] = useState(false);
  const { board, player, score, highScore, level, lines, gameOver, isPaused, setIsPaused, startGame, updatePlayerPos, playerRotate, nextPiece, holdPiece, triggerHold, getGhostPos, lastClear } = useTetris();

  useEffect(() => {
    document.body.className = THEMES[themeIndex];
  }, [themeIndex]);

  // Movement Logic
  const move = (dir: number) => {
    if (!gameOver && !isPaused && !checkCollision(player, board, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  const softDrop = () => {
    if (!gameOver && !isPaused && !checkCollision(player, board, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    }
  };

  const hardDrop = () => {
    if (gameOver || isPaused) return;
    let dropY = getGhostPos() - player.pos.y;
    updatePlayerPos({ x: 0, y: dropY, collided: true });
    
    setShake(true);
    setTimeout(() => setShake(false), 150);
  };

  // Keyboard Controls
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (gameOver) return;
    if (e.key === 'ArrowLeft') move(-1);
    if (e.key === 'ArrowRight') move(1);
    if (e.key === 'ArrowDown') softDrop();
    if (e.key === 'ArrowUp') playerRotate();
    if (e.key === ' ') hardDrop();
    if (e.key === 'c' || e.key === 'C') triggerHold();
    if (e.key === 'p' || e.key === 'P') setIsPaused(p => !p);
  };

  const cycleTheme = () => {
    setThemeIndex((prev) => (prev + 1) % THEMES.length);
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
    <div className="glass-panel text-center w-full p-3">
      <span className="text-xs uppercase opacity-70 tracking-widest font-bold mb-3 block">{title}</span>
      <div className="grid grid-cols-4 gap-[2px] mx-auto w-16 h-16 items-center justify-center">
        {piece?.shape?.flatMap((row: any[], y: number) => 
          row.map((val: any, x: number) => (
            <div key={`${y}-${x}`} className="w-full pb-[100%] rounded-sm" style={{ background: val ? `var(--color-${val})` : 'transparent', boxShadow: val ? 'var(--glow-shadow)' : 'none' }} />
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 outline-none" role="button" tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="glass-wrapper flex flex-col md:flex-row gap-6 p-6 md:p-8 w-full max-w-5xl relative select-none">
        
        {/* Left Stats */}
        <aside className="flex flex-row md:flex-col gap-4 w-full md:w-56 order-2 md:order-1 hidden md:flex">
          <MiniGrid piece={holdPiece} title="Hold (C)" />
          <div className="glass-panel w-full p-5 flex flex-col gap-5 justify-between">
            <div><span className="block text-[10px] uppercase opacity-70 tracking-wider">High Score</span><span className="text-xl font-black text-[#00f2fe]">{highScore}</span></div>
            <div className="h-px w-full bg-white/10" />
            <div><span className="block text-xs uppercase opacity-70 tracking-wider">Score</span><span className="text-3xl font-bold">{score}</span></div>
            <div><span className="block text-xs uppercase opacity-70 tracking-wider">Level</span><span className="text-3xl font-bold">{level}</span></div>
            <div><span className="block text-xs uppercase opacity-70 tracking-wider">Lines</span><span className="text-3xl font-bold">{lines}</span></div>
          </div>
        </aside>

        {/* Center Board */}
        <main className="flex-1 order-1 md:order-2 flex justify-center relative touch-none">
          <div key={lastClear} className={`tetris-board ${shake ? 'shake-animation' : ''} ${lastClear ? 'flash-animation' : ''}`}>
            {renderBoard().map((row, y) => row.map((cell: any, x: number) => (
              <div key={`${x}-${y}`} className="cell" 
                style={{ 
                  background: cell[0] === 0 ? 'transparent' : `var(--color-${cell[0]})`,
                  opacity: cell[1] === 'ghost' ? 0.25 : 1,
                  boxShadow: cell[0] !== 0 && cell[1] !== 'ghost' ? 'var(--glow-shadow)' : 'none',
                  border: cell[0] !== 0 ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--grid-lines)'
                }} 
              />
            )))}
          </div>
          
          {/* Overlays */}
          {gameOver && <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-xl backdrop-blur-md z-10 border border-white/10 shadow-2xl">
              <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 mb-6 drop-shadow-lg text-center">GAME OVER</h2>
              <button className="btn-primary px-8 py-3 rounded-lg font-bold text-lg tracking-widest" onClick={startGame}>TRY AGAIN</button>
          </div>}
          {isPaused && !gameOver && <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl backdrop-blur-md z-10 border border-white/10">
              <h2 className="text-4xl font-bold tracking-[0.5em] text-white drop-shadow-lg">PAUSED</h2>
          </div>}
        </main>

        {/* Right Controls */}
        <aside className="flex flex-row md:flex-col gap-4 w-full md:w-56 order-3 hidden md:flex">
          <MiniGrid piece={nextPiece} title="Next" />
          <div className="flex flex-col gap-4 mt-auto w-full">
            <button className="btn-primary w-full py-4 rounded-xl font-bold shadow-lg tracking-widest text-sm" onClick={startGame}>
              {gameOver ? 'START GAME' : 'RESTART'}
            </button>
            <button className="btn-glass w-full py-4 rounded-xl font-bold tracking-widest text-sm" onClick={() => setIsPaused(p => !p)}>
              {isPaused ? 'RESUME' : 'PAUSE'}
            </button>
            <button className="btn-glass w-full py-4 rounded-xl font-bold tracking-widest text-sm flex items-center justify-center gap-2" onClick={cycleTheme}>
              <span>SKIN:</span> <span className="text-[#00f2fe]">{THEMES[themeIndex].toUpperCase()}</span>
            </button>
          </div>
        </aside>
      </div>

      {/* MOBILE-ONLY UI (Visible only on small screens) */}
      <div className="flex flex-col md:hidden w-full max-w-[380px] mt-4 gap-4 select-none touch-manipulation">
        
        {/* Mobile Stats Bar */}
        <div className="flex justify-between items-center glass-panel px-4 py-2 rounded-xl">
           <div className="text-center"><span className="block text-[10px] opacity-70">SCORE</span><span className="font-bold text-lg">{score}</span></div>
           <div className="text-center"><span className="block text-[10px] opacity-70">LEVEL</span><span className="font-bold text-lg">{level}</span></div>
           <div className="text-center"><span className="block text-[10px] opacity-70">LINES</span><span className="font-bold text-lg">{lines}</span></div>
           <button className="btn-glass p-2 rounded-lg text-xs font-bold" onClick={() => setIsPaused(p => !p)}>⏸</button>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-3 gap-2">
          <button className="btn-glass py-4 rounded-xl active:bg-white/20 font-bold flex flex-col items-center justify-center gap-1" onClick={triggerHold}>
            <span className="text-xl">⇄</span><span className="text-[10px] tracking-widest">HOLD</span>
          </button>
          <button className="btn-glass py-4 rounded-xl active:bg-white/20 font-bold flex flex-col items-center justify-center gap-1" onClick={playerRotate}>
            <span className="text-xl">↻</span><span className="text-[10px] tracking-widest">ROTATE</span>
          </button>
          <button className="btn-primary py-4 rounded-xl text-[#0f0c29] font-black flex flex-col items-center justify-center gap-1" onClick={hardDrop}>
            <span className="text-xl">⤓</span><span className="text-[10px] tracking-widest">HARD DROP</span>
          </button>
        </div>

        {/* Movement Row */}
        <div className="grid grid-cols-3 gap-2">
          <button className="btn-glass py-6 rounded-xl active:bg-white/20 text-2xl font-bold" onClick={() => move(-1)}>←</button>
          <button className="btn-glass py-6 rounded-xl active:bg-white/20 text-2xl font-bold" onClick={softDrop}>↓</button>
          <button className="btn-glass py-6 rounded-xl active:bg-white/20 text-2xl font-bold" onClick={() => move(1)}>→</button>
        </div>

      </div>
    </div>
  );
};

export default App;