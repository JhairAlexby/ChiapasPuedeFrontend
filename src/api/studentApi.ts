import { Student } from '../types/student.types';
import { DifficultyLevel } from '../types/exercise.types';
import { API_BASE_URL } from './config';

const createDemoStudent = (): Student => ({
  id: 'demo-student-fallback',
  name: 'Estudiante Demo',
  currentLevel: DifficultyLevel.BEGINNER,
  progress: {
    exercisesCompleted: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    averageResponseTime: 0
  }
});

export const StudentAPI = {
  async getAllStudents(): Promise<Student[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/students`);
      
      if (!response.ok) {
        throw new Error('Error al obtener estudiantes');
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        return data.map(student => {
          if (!student.progress) {
            student.progress = {
              exercisesCompleted: 0,
              correctAnswers: 0,
              incorrectAnswers: 0,
              averageResponseTime: 0
            };
          }
          return student;
        });
      }
      
      return [createDemoStudent()];
    } catch (error) {
      console.error('Error en getAllStudents:', error);
      return [createDemoStudent()];
    }
  },
  
  async getStudentProgress(studentId: string): Promise<Student | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/progression/${studentId}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener progreso del estudiante');
      }
      
      const data = await response.json();
      
      if (data && data.id) {
        if (!data.progress) {
          data.progress = {
            exercisesCompleted: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            averageResponseTime: 0
          };
        }
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Error en getStudentProgress:', error);
      return null;
    }
  },
};