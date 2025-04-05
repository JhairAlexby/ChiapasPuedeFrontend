// src/api/studentApi.ts (corregido)
import { Student } from '../types/student.types';
import { DifficultyLevel } from '../types/exercise.types';
import { API_BASE_URL } from './config';

// Crea un estudiante demo con la estructura correcta
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
  // Obtener todos los estudiantes
  async getAllStudents(): Promise<Student[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/students`);
      
      if (!response.ok) {
        throw new Error('Error al obtener estudiantes');
      }
      
      const data = await response.json();
      
      // Verificar que los datos sean válidos y tengan la estructura esperada
      if (Array.isArray(data) && data.length > 0) {
        return data.map(student => {
          // Asegurarse de que todos los estudiantes tengan la estructura correcta
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
      
      // Si no hay datos o no son válidos, devolver un arreglo con un estudiante demo
      return [createDemoStudent()];
    } catch (error) {
      console.error('Error en getAllStudents:', error);
      // En caso de error, devolver un arreglo con un estudiante demo
      return [createDemoStudent()];
    }
  },
  
  // Obtener progreso de un estudiante específico
  async getStudentProgress(studentId: string): Promise<Student | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/progression/${studentId}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener progreso del estudiante');
      }
      
      const data = await response.json();
      
      // Verificar que los datos sean válidos
      if (data && data.id) {
        // Asegurarse de que el estudiante tenga la estructura correcta
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
      
      // Si no hay datos válidos, devolver null
      return null;
    } catch (error) {
      console.error('Error en getStudentProgress:', error);
      return null;
    }
  },
};