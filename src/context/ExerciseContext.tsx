// src/context/ExerciseContext.tsx
import { createContext, useState, useContext, ReactNode, useCallback } from 'react'; // Importa useCallback
import { Exercise, DifficultyLevel, ExerciseType } from '../types/exercise.types';
import { ExerciseAPI } from '../api/exerciseApi';
import { EvaluationResult } from '../types/evaluation.types';

interface ExerciseContextProps {
  currentExercise: Exercise | null;
  exercisesList: Exercise[];
  viewedLevel: DifficultyLevel | null; // <-- NUEVO: Nivel que se está viendo
  loadExercisesByLevel: (level: DifficultyLevel) => Promise<void>;
  setCurrentExercise: (exercise: Exercise | null) => void;
  loadingExercises: boolean;
  lastEvaluationResult: EvaluationResult | null;
  setLastEvaluationResult: (result: EvaluationResult | null) => void;
}

const ExerciseContext = createContext<ExerciseContextProps | undefined>(undefined);

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
  const [currentExercise, setCurrentExerciseState] = useState<Exercise | null>(null);
  const [exercisesList, setExercisesList] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [lastEvaluationResult, setLastEvaluationResultState] = useState<EvaluationResult | null>(null);
  // NUEVO: Estado para guardar el nivel seleccionado por el usuario
  const [viewedLevel, setViewedLevel] = useState<DifficultyLevel | null>(null);

  // Usamos useCallback para estabilizar la referencia de la función
  const loadExercisesByLevel = useCallback(async (level: DifficultyLevel) => {
    console.log("Cargando ejercicios para nivel:", level);
    setViewedLevel(level); // <-- ACTUALIZA el nivel que se está viendo
    setLoadingExercises(true);
    try {
      let exercises = await ExerciseAPI.getExercisesByLevel(level);
      console.log("Ejercicios recibidos:", exercises);

      const validExercises = exercises.filter(ex => ex && typeof ex.id === 'string' && ex.id.length > 0);
      if (validExercises.length !== exercises.length) {
          console.warn("Se filtraron ejercicios recibidos del backend sin ID válido:", exercises);
      }
      setExercisesList(validExercises);

      if (exercises.length === 0) {
        console.log("No hay ejercicios, intentando generar nuevos...");
        await ExerciseAPI.generateExercises(level, 5);
        const newExercises = await ExerciseAPI.getExercisesByLevel(level);

        const validNewExercises = newExercises.filter(ex => ex && typeof ex.id === 'string' && ex.id.length > 0);
         if (validNewExercises.length !== newExercises.length) {
            console.warn("Se filtraron ejercicios NUEVOS recibidos del backend sin ID válido:", newExercises);
        }
        setExercisesList(validNewExercises);
        console.log("Nuevos ejercicios generados:", validNewExercises);
      }
    } catch (error) {
      console.error('Error al cargar ejercicios:', error);
      const demoExercises = createDemoExercises(level);
      setExercisesList(demoExercises.filter(ex => ex && typeof ex.id === 'string' && ex.id.length > 0));
      console.log("Usando ejercicios demo:", demoExercises);
    } finally {
      setLoadingExercises(false);
    }
  }, []); // Dependencia vacía para useCallback, la función no depende de props o estado externo a ella

  // ... (createDemoExercises y el resto sin cambios) ...
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
           {
            id: `demo-syllable-${timestamp}-2`,
            type: ExerciseType.SYLLABLE_FORMATION,
            difficultyLevel: level,
            content: 'Forma una sílaba con la letra M y una vocal',
            options: ['MA', 'LA', 'TA', 'PA'],
            correctAnswer: 'MA',
            timeLimit: 30
          }
          // ... otros ejercicios demo ...
        ];
       case DifficultyLevel.INTERMEDIATE:
         return [
           {
            id: `demo-word-${timestamp}-1`,
            type: ExerciseType.WORD_COMPLETION,
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
            type: ExerciseType.SENTENCE_FORMATION,
            difficultyLevel: level,
            content: 'Ordena las palabras para formar una oración: gato el duerme sofá en el',
            correctAnswer: 'El gato duerme en el sofá',
            timeLimit: 60
          },
          {
            id: `demo-text-${timestamp}-2`,
            type: ExerciseType.TEXT_COMPREHENSION,
            difficultyLevel: level,
            content: 'Lee el siguiente texto y responde: "María juega en el parque con su pelota roja". ¿De qué color es la pelota de María?',
            options: ['Roja', 'Azul', 'Verde', 'Amarilla'],
            correctAnswer: 'Roja',
            timeLimit: 60
          }
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
        viewedLevel, // <-- Expone el nuevo estado
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