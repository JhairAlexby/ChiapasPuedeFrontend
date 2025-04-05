export interface StudentResponse {
    studentId: string;
    exerciseId: string;
    answer: string;
    responseTimeMs: number;
    timestamp: Date;
  }
  
  export interface EvaluationResult {
    studentId: string;
    exerciseId: string;
    isCorrect: boolean;
    feedback: string;
    suggestedNextExerciseType?: ExerciseType;
  }