import { useEffect } from 'react';
import { useStudent } from '../../context/StudentContext';
import { useExercise } from '../../context/ExerciseContext';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import { DifficultyLevel } from '../../types/exercise.types';
import { ExerciseList } from '../exercises/ExerciseList';
import './Dashboard.css';

export const Dashboard = () => {
  const { currentStudent, refreshStudentProgress } = useStudent();
  const { loadExercisesByLevel, exercisesList } = useExercise();
  
  useEffect(() => {
    if (currentStudent) {
      loadExercisesByLevel(currentStudent.currentLevel);
      refreshStudentProgress(currentStudent.id);
    }
  }, [currentStudent?.id]);
  
  if (!currentStudent) {
    return null;
  }
  
  // Obtener etiqueta para nivel de dificultad
  const getLevelLabel = (level: DifficultyLevel) => {
    switch (level) {
      case DifficultyLevel.BEGINNER:
        return 'Principiante';
      case DifficultyLevel.INTERMEDIATE:
        return 'Intermedio';
      case DifficultyLevel.ADVANCED:
        return 'Avanzado';
      default:
        return level;
    }
  };
  
  // Calcular estadísticas
  const totalAnswers = currentStudent.progress.correctAnswers + currentStudent.progress.incorrectAnswers;
  const correctPercentage = totalAnswers > 0 
    ? Math.round((currentStudent.progress.correctAnswers / totalAnswers) * 100) 
    : 0;
  
  // Determinar color según el porcentaje de respuestas correctas
  const getPerformanceColor = () => {
    if (correctPercentage >= 80) return 'success';
    if (correctPercentage >= 60) return 'warning';
    return 'danger';
  };
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>¡Hola, {currentStudent.name}!</h1>
        <div className="level-badge">
          Nivel: {getLevelLabel(currentStudent.currentLevel)}
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="stats-section">
          <Card title="Tu progreso">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Ejercicios completados</div>
                <div className="stat-value">{currentStudent.progress.exercisesCompleted}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Respuestas correctas</div>
                <div className="stat-value">{currentStudent.progress.correctAnswers}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Respuestas incorrectas</div>
                <div className="stat-value">{currentStudent.progress.incorrectAnswers}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Tiempo promedio de respuesta</div>
                <div className="stat-value">
                  {currentStudent.progress.averageResponseTime > 0 
                    ? `${currentStudent.progress.averageResponseTime / 1000}s` 
                    : 'N/A'}
                </div>
              </div>
            </div>
            
            <div className="performance-section">
              <div className="performance-label">Rendimiento general</div>
              <ProgressBar 
                value={currentStudent.progress.correctAnswers} 
                max={totalAnswers > 0 ? totalAnswers : 1} 
                label="Respuestas correctas" 
              />
            </div>
          </Card>
        </div>
        
        <div className="exercises-section">
          <Card title="Ejercicios disponibles">
            <div className="level-selector">
              <Button 
                variant={currentStudent.currentLevel === DifficultyLevel.BEGINNER ? 'primary' : 'secondary'}
                onClick={() => loadExercisesByLevel(DifficultyLevel.BEGINNER)}
                size="small"
              >
                Principiante
              </Button>
              <Button 
                variant={currentStudent.currentLevel === DifficultyLevel.INTERMEDIATE ? 'primary' : 'secondary'}
                onClick={() => loadExercisesByLevel(DifficultyLevel.INTERMEDIATE)}
                size="small"
              >
                Intermedio
              </Button>
              <Button 
                variant={currentStudent.currentLevel === DifficultyLevel.ADVANCED ? 'primary' : 'secondary'}
                onClick={() => loadExercisesByLevel(DifficultyLevel.ADVANCED)}
                size="small"
              >
                Avanzado
              </Button>
            </div>
            
            <ExerciseList />
          </Card>
        </div>
      </div>
    </div>
  );
};