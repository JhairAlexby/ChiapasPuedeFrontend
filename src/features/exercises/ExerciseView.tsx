// src/features/exercises/ExerciseView.tsx
import { useState, useEffect } from 'react';
import { useExercise } from '../../context/ExerciseContext';
import { useStudent } from '../../context/StudentContext';
import { ExerciseType } from '../../types/exercise.types';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Timer } from '../../components/Timer/Timer';
import { EvaluationAPI } from '../../api/evaluationApi';
import { StudentResponse } from '../../types/evaluation.types';
import './ExerciseView.css';
import { ErrorBoundary } from 'react-error-boundary';

const ExerciseErrorFallback = ({ error }: { error: Error }) => (
  <div className="exercise-error">
    <h3>Something went wrong:</h3>
    <pre>{error.message}</pre>
  </div>
);

export const ExerciseView = () => {
  const { currentExercise, setCurrentExercise, setLastEvaluationResult } = useExercise();
  const { currentStudent, refreshStudentProgress } = useStudent();
  
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  
  // Reiniciar estado cuando cambia el ejercicio
  useEffect(() => {
    if (currentExercise) {
      console.log('ExerciseView montado con ejercicio:', currentExercise);
      setUserAnswer('');
      setSelectedOption(null);
      setStartTime(Date.now());
    }
  }, [currentExercise?.id]);
  
  if (!currentExercise || !currentStudent) {
    console.log('No hay ejercicio actual o estudiante', {currentExercise, currentStudent});
    return null;
  }
  
  const hasOptions = !!currentExercise.options && currentExercise.options.length > 0;
  
  const handleSubmit = async () => {
    if (!currentExercise || !currentStudent) return;
    
    const responseTime = Date.now() - startTime;
    setIsSubmitting(true);
    
    try {
      console.log('Enviando respuesta:', {
        studentId: currentStudent.id,
        exerciseId: currentExercise.id,
        answer: hasOptions ? selectedOption || '' : userAnswer
      });
      
      // Preparar respuesta
      const studentResponse: StudentResponse = {
        studentId: currentStudent.id,
        exerciseId: currentExercise.id,
        answer: hasOptions ? selectedOption || '' : userAnswer,
        responseTimeMs: responseTime,
        timestamp: new Date()
      };
      
      // Enviar para evaluación
      let result;
      
      try {
        result = await EvaluationAPI.evaluateResponse(studentResponse);
      } catch (error) {
        console.error('Error en la API de evaluación, usando respuesta simulada', error);
        // Simular respuesta si hay error con la API
        result = {
          studentId: currentStudent.id,
          exerciseId: currentExercise.id,
          isCorrect: Math.random() > 0.5, // Simular correcto/incorrecto aleatoriamente
          feedback: hasOptions && selectedOption === currentExercise.correctAnswer ? 
            '¡Respuesta correcta!' : 
            `La respuesta correcta era: ${currentExercise.correctAnswer || 'N/A'}`
        };
      }
      
      if (result) {
        console.log('Resultado de evaluación:', result);
        setLastEvaluationResult(result);
        await refreshStudentProgress(currentStudent.id);
      }
      
      // Cerrar ejercicio
      setTimeout(() => {
        setCurrentExercise(null);
      }, 500);
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleOptionSelect = (option: string) => {
    console.log('Opción seleccionada:', option);
    setSelectedOption(option);
  };
  
  const renderExerciseContent = () => {
    switch (currentExercise.type) {
      case ExerciseType.LETTER_RECOGNITION:
      case ExerciseType.SYLLABLE_FORMATION:
      case ExerciseType.WORD_COMPLETION:
        if (hasOptions) {
          return (
            <div className="exercise-options">
              {currentExercise.options?.map((option, idx) => (
                <button
                  key={`option-${idx}`}
                  className={`option-button ${selectedOption === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          );
        }
        return (
          <input
            type="text"
            className="exercise-input"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Escribe tu respuesta..."
          />
        );
        
      case ExerciseType.SENTENCE_FORMATION:
        return (
          <textarea
            className="exercise-textarea"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Escribe la oración..."
            rows={3}
          />
        );
        
      case ExerciseType.TEXT_COMPREHENSION:
        if (hasOptions) {
          return (
            <div className="exercise-options">
              {currentExercise.options?.map((option, idx) => (
                <button
                  key={`option-${idx}`}
                  className={`option-button ${selectedOption === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          );
        }
        return (
          <textarea
            className="exercise-textarea"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Escribe tu respuesta..."
            rows={4}
          />
        );
        
      default:
        return (
          <input
            type="text"
            className="exercise-input"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Escribe tu respuesta..."
          />
        );
    }
  };
  
  const handleTimeOut = () => {
    // Si el tiempo se acaba, enviamos la respuesta actual
    handleSubmit();
  };
  
  const isAnswerValid = hasOptions ? !!selectedOption : userAnswer.trim().length > 0;
  
  return (
    <ErrorBoundary FallbackComponent={ExerciseErrorFallback}>
      <div className="exercise-view-overlay">
        <div className="exercise-view-container">
          <Card title="Ejercicio">
            {currentExercise.timeLimit && (
              <Timer 
                seconds={currentExercise.timeLimit} 
                onTimeout={handleTimeOut} 
                isActive={true}
              />
            )}
            
            <div className="exercise-content">
              <h3>{currentExercise.content}</h3>
              
              <div className="exercise-response">
                {renderExerciseContent()}
              </div>
              
              <div className="exercise-actions">
                <Button 
                  variant="secondary" 
                  onClick={() => setCurrentExercise(null)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!isAnswerValid || isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar respuesta'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
};