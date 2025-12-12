import { useState, useEffect, useCallback, useRef } from 'react';
import { Stats } from './ClickRateTypes';
import './ClickRateGame.css';
import ClickRateStats from './ClickRateStats';

const DURATIONS = [5, 10, 30, 60];



export default function ClickRateGame() {
  const [gameState, setGameState] = useState<'IDLE' | 'RUNNING' | 'FINISHED'>('IDLE');
  const [duration, setDuration] = useState<number>(5);
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [clicks, setClicks] = useState<number[]>([]);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGame = useCallback(() => {
    setGameState('RUNNING');
    setClicks([]);
    setTimeLeft(duration);
    
    const startTime = Date.now();
    
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, duration - elapsed);
      
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setGameState('FINISHED');
        setTimeLeft(0);
      }
    }, 100);
  }, [duration]);

  const handleInteraction = () => {
    if (gameState === 'IDLE') {
      startGame();
      setClicks([Date.now()]);
    } else if (gameState === 'RUNNING') {
      setClicks(prev => [...prev, Date.now()]);
    }
  };

  const resetGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('IDLE');
    setClicks([]);
    setTimeLeft(duration);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameState === 'IDLE') {
        setTimeLeft(duration);
    }
  }, [duration, gameState]);

  const calculateStats = (): Stats | null => {
    if (clicks.length < 2) return null;
    
    const totalClicks = clicks.length;
    const cps = (totalClicks / duration).toFixed(2);
    
    let intervals: number[] = [];
    for (let i = 1; i < clicks.length; i++) {
        intervals.push(clicks[i] - clicks[i-1]);
    }
    
    const minInterval = Math.min(...intervals);
    const maxInterval = Math.max(...intervals);
    const avgInterval = (intervals.reduce((a, b) => a + b, 0) / intervals.length).toFixed(0);

    return { cps, minInterval, maxInterval, avgInterval, totalClicks };
  };

  const stats = gameState === 'FINISHED' ? calculateStats() : null;

  return (
    <div className="game-container">
      <div className="header">
        <h1>Click Rate Test</h1>
        <p className="subtitle">How fast can you click? Select a duration and click the area to begin!</p>
      </div>

      {gameState === 'IDLE' && (
        <div className="duration-selector">
          {DURATIONS.map(d => (
            <button 
              key={d} 
              className={`duration-btn ${duration === d ? 'active' : ''}`}
              onClick={() => setDuration(d)}
            >
              {d}s
            </button>
          ))}
        </div>
      )}

      <div 
        className="click-area" 
        onMouseDown={handleInteraction}
        onTouchStart={(e) => {
             e.preventDefault();
             handleInteraction();
        }}
      >
        {gameState === 'IDLE' && <h2>Click to Start</h2>}
        {gameState === 'RUNNING' && (
            <>
                <h2>{Math.ceil(timeLeft)}s</h2>
                <h3>Clicks: {clicks.length}</h3>
            </>
        )}
        {gameState === 'FINISHED' && <h2>Test Complete!</h2>}
      </div>

      {gameState === 'FINISHED' && stats && (
        <ClickRateStats stats={stats} resetGame={resetGame} />
      )}
    </div>
  );
}
