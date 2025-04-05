import { DifficultyLevel, Exercise } from '../types/exercise.types';
import { API_BASE_URL } from './config';

export const ExerciseAPI = {
  // Obtener ejercicios por nivel de dificultad
  async getExercisesByLevel(level: DifficultyLevel): Promise<Exercise[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/${level}`);
      if (!response.ok) {
        throw new Error('Error al obtener ejercicios');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getExercisesByLevel:', error);
      return [];
    }
  },

  // Generar nuevos ejercicios
  async generateExercises(level: DifficultyLevel, count: number = 5): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/generate/${level}?count=${count}`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error('Error al generar ejercicios');
      }
      
      return true;
    } catch (error) {
      console.error('Error en generateExercises:', error);
      return false;
    }
  }
};