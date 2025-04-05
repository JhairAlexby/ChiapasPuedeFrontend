// src/context/ExerciseContext.tsx
import { createContext, useState, useContext, ReactNode } from 'react';
import { Exercise, DifficultyLevel, ExerciseType } from '../types/exercise.types';
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

// Ya no necesitamos generar IDs únicos en el frontend si confiamos en los del backend
/*
const generateUniqueId = (exercise: Exercise, level: DifficultyLevel, index: number): string => {
  if (!exercise.id) {
    return `exercise-${level}-${index}-${Date.now()}`;
  }
  return exercise.id;
};
*/

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
  const [currentExercise, setCurrentExerciseState] = useState<Exercise | null>(null);
  const [exercisesList, setExercisesList] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [lastEvaluationResult, setLastEvaluationResultState] = useState<EvaluationResult | null>(null);

  const loadExercisesByLevel = async (level: DifficultyLevel) => {
    console.log("Cargando ejercicios para nivel:", level);
    setLoadingExercises(true);
    try {
      let exercises = await ExerciseAPI.getExercisesByLevel(level);
      console.log("Ejercicios recibidos:", exercises);

      // --- INICIO DE MODIFICACIÓN ---
      // Filtrar ejercicios que no tengan un ID válido del backend
      const validExercises = exercises.filter(ex => ex && typeof ex.id === 'string' && ex.id.length > 0);
      if (validExercises.length !== exercises.length) {
          console.warn("Se filtraron ejercicios recibidos del backend sin ID válido:", exercises);
      }
      // Usar directamente la lista filtrada con los IDs originales del backend
      setExercisesList(validExercises);
      // --- FIN DE MODIFICACIÓN ---

      // Si la lista inicial (antes de filtrar) estaba vacía, intenta generar y volver a cargar
      if (exercises.length === 0) {
        console.log("No hay ejercicios, intentando generar nuevos...");
        await ExerciseAPI.generateExercises(level, 5);
        const newExercises = await ExerciseAPI.getExercisesByLevel(level);

        // --- INICIO DE MODIFICACIÓN ---
        // Aplicar el mismo filtro a los nuevos ejercicios
        const validNewExercises = newExercises.filter(ex => ex && typeof ex.id === 'string' && ex.id.length > 0);
         if (validNewExercises.length !== newExercises.length) {
            console.warn("Se filtraron ejercicios NUEVOS recibidos del backend sin ID válido:", newExercises);
        }
        setExercisesList(validNewExercises);
         // --- FIN DE MODIFICACIÓN ---
        console.log("Nuevos ejercicios generados:", validNewExercises);
      }
    } catch (error) {
      console.error('Error al cargar ejercicios:', error);
      const demoExercises = createDemoExercises(level);
      // Asegurarse que los ejercicios demo también tengan IDs válidos
      setExercisesList(demoExercises.filter(ex => ex && typeof ex.id === 'string' && ex.id.length > 0));
      console.log("Usando ejercicios demo:", demoExercises);
    } finally {
      setLoadingExercises(false);
    }
  };

  // Función para crear ejercicios de demostración si hay problemas con la API
  const createDemoExercises = (level: DifficultyLevel): Exercise[] => {
    const timestamp = Date.now();
    // (Asegúrate que todos los IDs aquí sean strings no vacíos)
    switch (level) {
      case DifficultyLevel.BEGINNER:
        return [
          {
            id: `demo-letter-${timestamp}-1`,
            type: ExerciseType.LETTER_RECOGNITION,
            difficultyLevel: level,
            content: '¿Qué letra es esta? A',
            options: ['A', 'E', 'I', 'O'],
            correctAnswer: 'A',
            timeLimit: 30
          },
          // ... otros ejercicios demo ...
        ];
      // ... otros niveles demo ...
      default:
        return [];
    }
  };

  const setCurrentExercise = (exercise: Exercise | null) => {
    console.log("Cambiando ejercicio actual:", exercise); // Verifica que el ID aquí sea el UUID original
    setCurrentExerciseState(exercise);
  };

  const setLastEvaluationResult = (result: EvaluationResult | null) => {
    console.log("Estableciendo resultado de evaluación:", result);
    setLastEvaluationResultState(result);
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