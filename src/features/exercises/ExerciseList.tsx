import { useExercise } from '../../context/ExerciseContext';
import { ExerciseItem } from '../../components/ExerciseItem/ExerciseItem';
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
      {exercisesList.map((exercise, index) => (
        <ExerciseItem
          key={`${exercise.id}-${index}`} 
          exercise={exercise}
          onClick={(exercise) => setCurrentExercise(exercise)}
        />
      ))}
    </div>
  );
};