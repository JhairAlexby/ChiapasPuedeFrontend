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

const generateUniqueId = (exercise: Exercise, level: DifficultyLevel, index: number): string => {
  if (!exercise.id) {
    return `exercise-${level}-${index}-${Date.now()}`;
  }
  return exercise.id;
};

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
  const [currentExercise, setCurrentExerciseState] = useState<Exercise | null>(null);
  const [exercisesList, setExercisesList] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [lastEvaluationResult, setLastEvaluationResultState] = useState<EvaluationResult | null>(null);

  const loadExercisesByLevel = async (level: DifficultyLevel) => {
    console.log("Cargando ejercicios para nivel:", level);
    setLoadingExercises(true);
    try {
      const exercises = await ExerciseAPI.getExercisesByLevel(level);
      console.log("Ejercicios recibidos:", exercises);
      
      const exercisesWithUniqueIds = exercises.map((exercise, index) => ({
        ...exercise,
        id: generateUniqueId(exercise, level, index)
      }));
      
      setExercisesList(exercisesWithUniqueIds);
      
      if (exercises.length === 0) {
        console.log("No hay ejercicios, intentando generar nuevos...");
        await ExerciseAPI.generateExercises(level, 5);
        const newExercises = await ExerciseAPI.getExercisesByLevel(level);
        
        const newExercisesWithUniqueIds = newExercises.map((exercise, index) => ({
          ...exercise,
          id: generateUniqueId(exercise, level, index)
        }));
        
        setExercisesList(newExercisesWithUniqueIds);
        console.log("Nuevos ejercicios generados:", newExercisesWithUniqueIds);
      }
    } catch (error) {
      console.error('Error al cargar ejercicios:', error);
      const demoExercises = createDemoExercises(level);
      setExercisesList(demoExercises);
      console.log("Usando ejercicios demo:", demoExercises);
    } finally {
      setLoadingExercises(false);
    }
  };

  // Función para crear ejercicios de demostración si hay problemas con la API
  const createDemoExercises = (level: DifficultyLevel): Exercise[] => {
    const timestamp = Date.now();
    switch (level) {
      case DifficultyLevel.BEGINNER:
        return [
          {
            id: `demo-letter-${timestamp}-1`,
            type: ExerciseType.LETTER_RECOGNITION,  // Use enum instead of string
            difficultyLevel: level,
            content: '¿Qué letra es esta? A',
            options: ['A', 'E', 'I', 'O'],
            correctAnswer: 'A',
            timeLimit: 30
          },
          {
            id: `demo-syllable-${timestamp}-2`,
            type: ExerciseType.SYLLABLE_FORMATION,  // Use enum instead of string
            difficultyLevel: level,
            content: 'Forma una sílaba con la letra M y una vocal',
            options: ['MA', 'LA', 'TA', 'PA'],
            correctAnswer: 'MA',
            timeLimit: 30
          }
        ];
      case DifficultyLevel.INTERMEDIATE:
        return [
          {
            id: `demo-word-${timestamp}-1`,
            type: ExerciseType.WORD_COMPLETION,  // Use enum instead of string
            difficultyLevel: level,
            content: 'Completa la palabra: CA_A',
            options: ['S', 'M', 'R', 'L'],
            correctAnswer: 'S',
            timeLimit: 45
          }
        ];
      case DifficultyLevel.ADVANCED:
        return [
          {
            id: `demo-sentence-${timestamp}-1`,
            type: ExerciseType.SENTENCE_FORMATION,  // Use enum instead of string
            difficultyLevel: level,
            content: 'Ordena las palabras para formar una oración: gato el duerme sofá en el',
            correctAnswer: 'El gato duerme en el sofá',
            timeLimit: 60
          },
          {
            id: `demo-text-${timestamp}-2`,
            type: ExerciseType.TEXT_COMPREHENSION,  // Use enum instead of string
            difficultyLevel: level,
            content: 'Lee el siguiente texto y responde: "María juega en el parque con su pelota roja". ¿De qué color es la pelota de María?',
            options: ['Roja', 'Azul', 'Verde', 'Amarilla'],
            correctAnswer: 'Roja',
            timeLimit: 60
          }
        ];
      default:
        return [];
    }
  };

  // Función mejorada para establecer el ejercicio actual
  const setCurrentExercise = (exercise: Exercise | null) => {
    console.log("Cambiando ejercicio actual:", exercise);
    setCurrentExerciseState(exercise);
  };

  // Función mejorada para establecer el resultado de evaluación
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