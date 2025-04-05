// src/features/exercises/ExerciseList.tsx
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
  
  // Eliminar ejercicios duplicados basados en el ID
  const uniqueExercises = Array.from(
    new Map(exercisesList.map(exercise => [exercise.id, exercise])).values()
  );
  
  return (
    <div className="exercise-list">
      {uniqueExercises.map((exercise, index) => (
        <ExerciseItem 
          key={`${exercise.id}-${index}`} // Combinamos ID e índice para garantizar unicidad
          exercise={exercise} 
          onClick={() => {
            console.log('Ejercicio seleccionado:', exercise);
            setCurrentExercise(exercise);
          }}
        />
      ))}
    </div>
  );
};