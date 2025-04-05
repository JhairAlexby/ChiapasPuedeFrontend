// src/features/results/ResultView.tsx
import { useExercise } from '../../context/ExerciseContext';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import './ResultView.css';

export const ResultView = () => {
  const { lastEvaluationResult, setLastEvaluationResult } = useExercise();
  
  if (!lastEvaluationResult) {
    return null;
  }
  
  console.log("Mostrando resultado:", lastEvaluationResult);
  
  const handleClose = () => {
    console.log("Cerrando resultado");
    setLastEvaluationResult(null);
  };
  
  // Generar feedback si no existe
  const feedback = lastEvaluationResult.feedback || 
    (lastEvaluationResult.isCorrect 
      ? '¡Muy bien! Has respondido correctamente.' 
      : 'No te preocupes, sigue practicando para mejorar.');
  
  return (
    <div className="result-view-overlay">
      <div className="result-view-container">
        <Card>
          <div className="result-content">
            <div className={`result-icon ${lastEvaluationResult.isCorrect ? 'correct' : 'incorrect'}`}>
              {lastEvaluationResult.isCorrect ? '✓' : '✗'}
            </div>
            
            <h2 className="result-title">
              {lastEvaluationResult.isCorrect 
                ? '¡Respuesta correcta!' 
                : 'Respuesta incorrecta'}
            </h2>
            
            <p className="result-feedback">{feedback}</p>
            
            <Button onClick={handleClose} fullWidth>
              Continuar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};