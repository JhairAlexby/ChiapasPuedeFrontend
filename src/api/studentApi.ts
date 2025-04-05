import { Student } from '../types/student.types';
import { API_BASE_URL } from './config';

export const StudentAPI = {
  // Obtener todos los estudiantes
  async getAllStudents(): Promise<Student[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/students`);
      
      if (!response.ok) {
        throw new Error('Error al obtener estudiantes');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getAllStudents:', error);
      return [];
    }
  },
  
  // Obtener progreso de un estudiante específico
  async getStudentProgress(studentId: string): Promise<Student | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/progression/${studentId}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener progreso del estudiante');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getStudentProgress:', error);
      return null;
    }
  },
};