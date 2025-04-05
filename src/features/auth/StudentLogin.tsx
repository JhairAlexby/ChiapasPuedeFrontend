import { useState, useEffect } from 'react';
import { useStudent } from '../../context/StudentContext';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Student } from '../../types/student.types';
import { DifficultyLevel } from '../../types/exercise.types';
import './StudentLogin.css';

export const StudentLogin = () => {
  const { students, setCurrentStudent, loadingStudents } = useStudent();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newStudentName, setNewStudentName] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Preseleccionar el primer estudiante si hay solo uno
  useEffect(() => {
    if (students.length === 1) {
      setSelectedStudent(students[0]);
    }
  }, [students]);

  const handleLogin = () => {
    if (selectedStudent) {
      setCurrentStudent(selectedStudent);
    }
  };

  const handleCreateStudent = () => {
    if (newStudentName.trim()) {
      // En una aplicación real, enviaríamos esta información al backend
      // Aquí simplemente creamos un objeto de estudiante en memoria
      const newStudent: Student = {
        id: `student-${Date.now()}`,
        name: newStudentName.trim(),
        currentLevel: DifficultyLevel.BEGINNER,
        progress: {
          exercisesCompleted: 0,
          correctAnswers: 0,
          incorrectAnswers: 0,
          averageResponseTime: 0
        }
      };
      
      setSelectedStudent(newStudent);
      setCurrentStudent(newStudent);
    }
  };

  if (loadingStudents) {
    return (
      <div className="student-login-container">
        <Card title="Cargando estudiantes...">
          <p>Por favor espera mientras cargamos la información...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="student-login-container">
      <Card title="Bienvenido a Chiapas Puede">
        {isCreatingNew ? (
          <div className="create-student-form">
            <h3>Crear nuevo estudiante</h3>
            <input
              type="text"
              placeholder="Nombre del estudiante"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              className="student-name-input"
            />
            <div className="button-group">
              <Button onClick={handleCreateStudent} disabled={!newStudentName.trim()}>
                Crear y continuar
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setIsCreatingNew(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h3>Selecciona tu perfil</h3>
            {students.length > 0 ? (
              <div className="student-list">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className={`student-item ${selectedStudent?.id === student.id ? 'selected' : ''}`}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="student-avatar">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="student-name">{student.name}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay estudiantes registrados. Crea uno nuevo para comenzar.</p>
            )}
            <div className="button-group">
              <Button 
                onClick={handleLogin} 
                disabled={!selectedStudent}
              >
                Continuar
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setIsCreatingNew(true)}
              >
                Crear nuevo estudiante
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};