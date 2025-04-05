import { useState, useEffect } from 'react';
import './Timer.css';

interface TimerProps {
  seconds: number;
  onTimeout: () => void;
  isActive?: boolean;
}

export const Timer = ({ seconds, onTimeout, isActive = true }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  
  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);
  
  useEffect(() => {
    if (!isActive) return;
    
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }
    
    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeout, isActive]);
  
  const progressPercentage = (timeLeft / seconds) * 100;
  
  const getProgressColor = () => {
    if (progressPercentage > 60) return '#10b981'; 
    if (progressPercentage > 30) return '#f59e0b'; 
    return '#ef4444'; 
  };
  
  return (
    <div className="timer">
      <div className="timer-text">{timeLeft}s</div>
      <div className="timer-progress-container">
        <div 
          className="timer-progress-bar"
          style={{ 
            width: `${progressPercentage}%`,
            backgroundColor: getProgressColor()
          }}
        />
      </div>
    </div>
  );
};