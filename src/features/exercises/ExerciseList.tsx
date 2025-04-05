import { useExercise } from '../../context/ExerciseContext';
import { ExerciseItem } from '../../components/ExerciseItem/ExerciseItem';
import { Button } from '../../components/Button/Button';
import './ExerciseList.css';

export const ExerciseList = () => {
  const { exercisesList, loadingExercises, setCurrentExercise } = useExercise();
  
  if (loadingExercises) {
    return <div className="exercise-list-loading">Cargando ejercicios...</div>;
  }
  
  if (exercisesList.length === 0) {
    return (
      <div className="exercise-list-empty">
        <p>No hay ejercicios disponibles para este nivel.</p>
      </div>
    );
  }
  
  return (
    <div className="exercise-list">
      {exercisesList.map((exercise) => (
        <ExerciseItem 
          key={exercise.id} 
          exercise={exercise} 
          onClick={() => setCurrentExercise(exercise)}
        />
      ))}
    </div>
  );
};