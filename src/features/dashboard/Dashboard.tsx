// src/features/dashboard/Dashboard.tsx
import { useEffect } from 'react';
import { useStudent } from '../../context/StudentContext';
import { useExercise } from '../../context/ExerciseContext'; // Asegúrate que importe el tipo actualizado
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import { DifficultyLevel } from '../../types/exercise.types';
import { ExerciseList } from '../exercises/ExerciseList';
import './Dashboard.css';

export const Dashboard = () => {
  const { currentStudent, refreshStudentProgress } = useStudent();
  // Obtén el nuevo estado viewedLevel del contexto
  const { loadExercisesByLevel, exercisesList, viewedLevel } = useExercise();

  useEffect(() => {
    // Carga inicial: si hay estudiante pero aún no se ha visto/seleccionado un nivel
    if (currentStudent && viewedLevel === null) { // <-- Verifica si viewedLevel es null
      loadExercisesByLevel(currentStudent.currentLevel);
      // Considera si necesitas refrescar el progreso aquí o solo después de evaluar
      // refreshStudentProgress(currentStudent.id);
    }
    // Dependencias: currentStudent (para obtener nivel inicial), viewedLevel (para saber si ya se cargó algo)
    // loadExercisesByLevel (la función para cargar)
  }, [currentStudent, viewedLevel, loadExercisesByLevel]); // Quita refreshStudentProgress si no se llama aquí

   // Función para obtener la etiqueta del nivel (sin cambios)
   const getLevelLabel = (level: DifficultyLevel) => {
     switch (level) {
       case DifficultyLevel.BEGINNER: return 'Principiante';
       case DifficultyLevel.INTERMEDIATE: return 'Intermedio';
       case DifficultyLevel.ADVANCED: return 'Avanzado';
       default: return level;
     }
   };

  if (!currentStudent) {
    return null;
  }

   // Cálculo de progreso (sin cambios)
   const progress = currentStudent.progress || {
     exercisesCompleted: 0, correctAnswers: 0, incorrectAnswers: 0, averageResponseTime: 0
   };
   const totalAnswers = progress.correctAnswers + progress.incorrectAnswers;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>¡Hola, {currentStudent.name}!</h1>
        {/* La insignia sigue mostrando el nivel REAL del estudiante */}
        <div className="level-badge">
          Nivel: {getLevelLabel(currentStudent.currentLevel)}
        </div>
      </div>

      <div className="dashboard-content">
        {/* Sección de estadísticas (sin cambios) */}
         <div className="stats-section">
           <Card title="Tu progreso">
             <div className="stats-grid">
               <div className="stat-item">
                 <div className="stat-label">Ejercicios completados</div>
                 <div className="stat-value">{progress.exercisesCompleted}</div>
               </div>
               <div className="stat-item">
                 <div className="stat-label">Respuestas correctas</div>
                 <div className="stat-value">{progress.correctAnswers}</div>
               </div>
               <div className="stat-item">
                 <div className="stat-label">Respuestas incorrectas</div>
                 <div className="stat-value">{progress.incorrectAnswers}</div>
               </div>
               <div className="stat-item">
                  <div className="stat-label">Tiempo promedio</div>
                 <div className="stat-value">
                   {progress.averageResponseTime > 0
                    ? `${(progress.averageResponseTime / 1000).toFixed(1)}s`
                    : 'N/A'}
                 </div>
               </div>
             </div>

             <div className="performance-section">
               <div className="performance-label">Rendimiento general</div>
               <ProgressBar
                 value={progress.correctAnswers}
                 max={totalAnswers > 0 ? totalAnswers : 1} // Evitar división por cero
                 label={`${progress.correctAnswers} / ${totalAnswers} correctas`}
               />
             </div>
           </Card>
         </div>


        <div className="exercises-section">
          <Card title="Ejercicios disponibles">
            <div className="level-selector">
              {/* --- INICIO: Modificación del resaltado de botones --- */}
              <Button
                variant={viewedLevel === DifficultyLevel.BEGINNER ? 'primary' : 'secondary'} // <-- Usa viewedLevel
                onClick={() => loadExercisesByLevel(DifficultyLevel.BEGINNER)}
                size="small"
              >
                Principiante
              </Button>
              <Button
                variant={viewedLevel === DifficultyLevel.INTERMEDIATE ? 'primary' : 'secondary'} // <-- Usa viewedLevel
                onClick={() => loadExercisesByLevel(DifficultyLevel.INTERMEDIATE)}
                size="small"
              >
                Intermedio
              </Button>
              <Button
                variant={viewedLevel === DifficultyLevel.ADVANCED ? 'primary' : 'secondary'} // <-- Usa viewedLevel
                onClick={() => loadExercisesByLevel(DifficultyLevel.ADVANCED)}
                size="small"
              >
                Avanzado
              </Button>
              {/* --- FIN: Modificación del resaltado de botones --- */}
            </div>

            <ExerciseList />
          </Card>
        </div>
      </div>
    </div>
  );
};