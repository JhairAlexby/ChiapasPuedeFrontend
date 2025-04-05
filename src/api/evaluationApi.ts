import { StudentResponse, EvaluationResult } from '../types/evaluation.types';
import { API_BASE_URL } from './config';

export const EvaluationAPI = {
  async evaluateResponse(studentResponse: StudentResponse): Promise<EvaluationResult | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/evaluation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentResponse),
      });
      
      if (!response.ok) {
        throw new Error('Error al evaluar respuesta');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en evaluateResponse:', error);
      return null;
    }
  },
};
