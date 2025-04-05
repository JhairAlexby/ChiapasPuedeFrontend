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
    // Resetear el temporizador si cambian los segundos
    setTimeLeft(seconds);
  }, [seconds]);
  
  useEffect(() => {
    if (!isActive) return;
    
    // Si no queda tiempo, ejecutar callback
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }
    
    // Configurar intervalo para decrementar el tiempo
    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    
    // Limpiar intervalo al desmontar o cuando isActive cambie
    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeout, isActive]);
  
  // Calcular porcentaje para la barra de progreso
  const progressPercentage = (timeLeft / seconds) * 100;
  
  // Determinar color según tiempo restante
  const getProgressColor = () => {
    if (progressPercentage > 60) return '#10b981'; // Verde
    if (progressPercentage > 30) return '#f59e0b'; // Amarillo
    return '#ef4444'; // Rojo
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