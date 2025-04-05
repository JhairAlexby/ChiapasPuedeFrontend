// src/context/StudentContext.tsx
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Student } from '../types/student.types';
import { DifficultyLevel } from '../types/exercise.types';
import { StudentAPI } from '../api/studentApi';

interface StudentContextProps {
  currentStudent: Student | null;
  setCurrentStudent: (student: Student | null) => void;
  students: Student[];
  loadingStudents: boolean;
  refreshStudentProgress: (studentId: string) => Promise<void>;
}

// Crear un estudiante demo con la estructura correcta
const createDemoStudent = (): Student => ({
  id: 'demo-student',
  name: 'Estudiante Demo',
  currentLevel: DifficultyLevel.BEGINNER,
  progress: {
    exercisesCompleted: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    averageResponseTime: 0
  }
});

const StudentContext = createContext<StudentContextProps | undefined>(undefined);

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Cargar lista de estudiantes
  useEffect(() => {
    let mounted = true;
    
    const loadStudents = async () => {
      setLoadingStudents(true);
      try {
        const loadedStudents = await StudentAPI.getAllStudents();
        
        if (mounted) {
          if (loadedStudents && loadedStudents.length > 0) {
            setStudents(loadedStudents);
          } else {
            const demoStudent = createDemoStudent();
            setStudents([demoStudent]);
          }
        }
      } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        if (mounted) {
          const demoStudent = createDemoStudent();
          setStudents([demoStudent]);
        }
      } finally {
        if (mounted) {
          setLoadingStudents(false);
        }
      }
    };
    
    loadStudents();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Actualizar progreso de un estudiante
  // Add a tracking mechanism to prevent duplicate updates
  const [lastUpdatedExerciseId, setLastUpdatedExerciseId] = useState<string | null>(null);
  
  // Modify the refreshStudentProgress function
  const refreshStudentProgress = async (studentId: string) => {
    try {
      console.log("Refreshing progress for student:", studentId);
      const updatedStudent = await StudentAPI.getStudentProgress(studentId);
      console.log("Received updated student data:", updatedStudent);
      
      if (updatedStudent) {
        // Asegurarse de que la estructura de progress esté completa
        if (!updatedStudent.progress) {
          updatedStudent.progress = {
            exercisesCompleted: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            averageResponseTime: 0
          };
        }
        
        // Actualizar estudiante actual si es el mismo
        if (currentStudent?.id === studentId) {
          console.log("Updating current student with new progress:", updatedStudent.progress);
          setCurrentStudent(updatedStudent);
        }
        
        // Actualizar en la lista de estudiantes
        setStudents(prevStudents => 
          prevStudents.map(student => 
            student.id === studentId ? updatedStudent : student
          )
        );
      } else {
        // If API returns null, manually update the student progress
        // But only if we haven't already updated for this exercise
        if (currentStudent && currentStudent.id === studentId) {
          // Get exerciseId from evaluation context or state
          const currentExerciseId = null; // TODO: Add proper evaluation result state/context
          
          // Only update if this is a new exercise completion
          if (currentExerciseId && lastUpdatedExerciseId !== currentExerciseId) {
            setLastUpdatedExerciseId(currentExerciseId);
            
            const updatedProgress = {
              ...currentStudent.progress,
              exercisesCompleted: currentStudent.progress.exercisesCompleted + 1,
              correctAnswers: currentExerciseId
                ? currentStudent.progress.correctAnswers + 1 
                : currentStudent.progress.correctAnswers,
              incorrectAnswers: currentExerciseId
                ? currentStudent.progress.incorrectAnswers + 1 
                : currentStudent.progress.incorrectAnswers,
            };
            
            const manuallyUpdatedStudent = {
              ...currentStudent,
              progress: updatedProgress
            };
            
            console.log("Manually updated student:", manuallyUpdatedStudent);
            setCurrentStudent(manuallyUpdatedStudent);
            
            // Also update in the students list
            setStudents(prevStudents => 
              prevStudents.map(student => 
                student.id === studentId ? manuallyUpdatedStudent : student
              )
            );
          } else {
            console.log("Skipping duplicate update for exercise:", currentExerciseId);
          }
        }
      }
    } catch (error) {
      console.error('Error al actualizar progreso:', error);
    }
  };

  return (
    <StudentContext.Provider
      value={{
        currentStudent,
        setCurrentStudent,
        students,
        loadingStudents,
        refreshStudentProgress: async (studentId: string): Promise<void> => {
          await refreshStudentProgress(studentId);
        }
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = (): StudentContextProps => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent debe ser usado dentro de un StudentProvider');
  }
  return context;
};