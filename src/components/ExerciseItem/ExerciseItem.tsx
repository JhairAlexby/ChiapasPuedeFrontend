import { Exercise, ExerciseType } from '../../types/exercise.types';
import { Card } from '../Card/Card';
import './ExerciseItem.css';

interface ExerciseItemProps {
  exercise: Exercise;
  onClick: () => void;
}

export const ExerciseItem = ({ exercise, onClick }: ExerciseItemProps) => {
  // Función para obtener un emoji según el tipo de ejercicio
  const getExerciseEmoji = (type: ExerciseType): string => {
    switch (type) {
      case ExerciseType.LETTER_RECOGNITION:
        return '🔤';
      case ExerciseType.SYLLABLE_FORMATION:
        return '🔡';
      case ExerciseType.WORD_COMPLETION:
        return '📝';
      case ExerciseType.SENTENCE_FORMATION:
        return '📄';
      case ExerciseType.TEXT_COMPREHENSION:
        return '📚';
      default:
        return '📋';
    }
  };
  
  // Función para obtener un título según el tipo de ejercicio
  const getExerciseTypeLabel = (type: ExerciseType): string => {
    switch (type) {
      case ExerciseType.LETTER_RECOGNITION:
        return 'Reconocimiento de letras';
      case ExerciseType.SYLLABLE_FORMATION:
        return 'Formación de sílabas';
      case ExerciseType.WORD_COMPLETION:
        return 'Completar palabras';
      case ExerciseType.SENTENCE_FORMATION:
        return 'Formar oraciones';
      case ExerciseType.TEXT_COMPREHENSION:
        return 'Comprensión de texto';
      default:
        return 'Ejercicio';
    }
  };
  
  return (
    <Card className="exercise-item" onClick={onClick}>
      <div className="exercise-icon">
        {getExerciseEmoji(exercise.type)}
      </div>
      <div className="exercise-details">
        <div className="exercise-type">{getExerciseTypeLabel(exercise.type)}</div>
        <div className="exercise-preview">{exercise.content.substring(0, 50)}...</div>
      </div>
    </Card>
  );
};