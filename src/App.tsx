import React, { useState, useEffect } from 'react';
import './index.css';
import { useBoard } from './hooks/useBoard';
import { useGameStatus } from './hooks/useGameStatus';
import { usePlayer } from './hooks/usePlayer';
import { createStage, checkCollision } from './gameHelpers';

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const [player, updatePlayerPos, resetPlayer] = usePlayer();
  const [board, setBoard] = useBoard(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    const themes = ['light', 'dark']; // Add skins here later
    const currentIndex = themes.indexOf(theme);
    setTheme(themes[(currentIndex + 1) % themes.length]);
  };

  const movePlayer = (dir: number) => {
    if (!checkCollision(player, board, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  const startGame = () => {
    setBoard(createStage());
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
    setScore(0);
    setRows(0);
    setLevel(1);
  };

  const drop = () => {
    if (!checkCollision(player, board, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      if (player.pos.y < 1) {
        console.log("GAME OVER!");
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const move = ({ keyCode }: { keyCode: number }) => {
    if (!gameOver) {
      if (keyCode === 37) { // Left arrow
        movePlayer(-1);
      } else if (keyCode === 39) { // Right arrow
        movePlayer(1);
      } else if (keyCode === 40) { // Down arrow
        drop();
      }
    }
  };

  return (
    <div className="app-container" role="button" tabIndex={0} onKeyDown={e => move(e)}>
      <div className="game-wrapper glass-panel">
        
        {/* Left Panel: Stats */}
        <aside className="side-panel">
          <div className="glass-panel text-center">
            <span className="info-label">Hold</span>
            <div className="w-24 h-24 mx-auto border rounded mt-2"></div>
          </div>
          
          <div className="glass-panel">
            <div className="info-box">
              <span className="info-label">Score</span>
              <span className="info-value">{score}</span>
            </div>
            <div className="info-box">
              <span className="info-label">Level</span>
              <span className="info-value">{level}</span>
            </div>
            <div className="info-box">
              <span className="info-label">Lines</span>
              <span className="info-value">{rows}</span>
            </div>
          </div>
          
          <button onClick={toggleTheme} className="btn btn-glass mt-auto">
            Switch Skin
          </button>
        </aside>

        {/* Center Panel: Board */}
        <main className="glass-panel board-container">
          <div className="tetris-grid">
            {board.map(row => row.map((cell, x) => (
              <div 
                key={x} 
                className="cell"
                style={{ background: cell[0] === 0 ? 'transparent' : cell[1] }} 
              />
            )))}
          </div>
        </main>

        {/* Right Panel: Controls */}
        <aside className="side-panel">
          <div className="glass-panel text-center">
            <span className="info-label">Next</span>
            <div className="w-24 h-24 mx-auto border rounded mt-2"></div>
          </div>

          <div className="flex flex-col gap-3 mt-auto">
            {gameOver && <div className="info-value text-red-500 mb-4 text-center">Game Over</div>}
            <button onClick={startGame} className="btn btn-primary mb-3">
              Start Game
            </button>
            <button className="btn btn-glass">
              Pause
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default App;