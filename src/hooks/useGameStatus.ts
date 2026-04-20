import { useState } from 'react';

export const useGameStatus = () => {
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(1); // Start at level 1

  // We are returning these as an array so we can destructure them easily in App.tsx
  return [score, setScore, rows, setRows, level, setLevel] as const;
};