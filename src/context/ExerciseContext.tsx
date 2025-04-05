import { createContext, useState, useContext, ReactNode } from 'react';
import { Exercise, DifficultyLevel } from '../types/exercise.types';
import { ExerciseAPI } from '../api/exerciseApi';
import { EvaluationResult } from '../types/evaluation.types';

interface ExerciseContextProps {
  currentExercise: Exercise | null;
  exercisesList: Exercise[];
  loadExercisesByLevel: (level: DifficultyLevel) => Promise<void>;
  setCurrentExercise: (exercise: Exercise | null) => void;
  loadingExercises: boolean;
  lastEvaluationResult: EvaluationResult | null;
  setLastEvaluationResult: (result: EvaluationResult | null) => void;
}

const ExerciseContext = createContext<ExerciseContextProps | undefined>(undefined);

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [exercisesList, setExercisesList] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [lastEvaluationResult, setLastEvaluationResult] = useState<EvaluationResult | null>(null);

  const loadExercisesByLevel = async (level: DifficultyLevel) => {
    setLoadingExercises(true);
    try {
      const exercises = await ExerciseAPI.getExercisesByLevel(level);
      setExercisesList(exercises);
      
      // Si no hay ejercicios, intentamos generar algunos
      if (exercises.length === 0) {
        await ExerciseAPI.generateExercises(level, 5);
        const newExercises = await ExerciseAPI.getExercisesByLevel(level);
        setExercisesList(newExercises);
      }
    } catch (error) {
      console.error('Error al cargar ejercicios:', error);
    } finally {
      setLoadingExercises(false);
    }
  };

  return (
    <ExerciseContext.Provider
      value={{
        currentExercise,
        exercisesList,
        loadExercisesByLevel,
        setCurrentExercise,
        loadingExercises,
        lastEvaluationResult,
        setLastEvaluationResult
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};

export const useExercise = (): ExerciseContextProps => {
  const context = useContext(ExerciseContext);
  if (context === undefined) {
    throw new Error('useExercise debe ser usado dentro de un ExerciseProvider');
  }
  return context;
};