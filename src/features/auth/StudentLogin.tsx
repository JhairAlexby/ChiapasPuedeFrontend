import { useState, useEffect } from 'react';
import { useStudent } from '../../context/StudentContext';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Student } from '../../types/student.types';
import './StudentLogin.css';

export const StudentLogin = () => {
  const { students, setCurrentStudent, loadingStudents, refreshStudentProgress } = useStudent();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (!loadingStudents && students) { 
      if (students.length === 1) {
        const unicoEstudiante = students[0];
        console.log("Iniciando sesión automáticamente con el único estudiante:", unicoEstudiante);
        refreshStudentProgress(unicoEstudiante.id)
            .catch(err => {
                console.error("Error al refrescar progreso para auto-login, usando datos locales:", err);
            })
            .finally(() => {
                 
                 setCurrentStudent(unicoEstudiante);
            });

      } else if (students.length > 1) {
        
      }
    }
  }, [loadingStudents, students, setCurrentStudent, refreshStudentProgress]); // Dependencias del efecto

  const handleLogin = () => {
    if (selectedStudent) {
      refreshStudentProgress(selectedStudent.id)
        .catch(e => console.error("Error refrescando progreso en login manual", e))
        .finally(() => {
        });
      setCurrentStudent(selectedStudent);
    }
  };

 
  if (loadingStudents) {
    return (
      <div className="student-login-container">
        <Card title="Cargando...">
          <p>Por favor espera...</p>
        </Card>
      </div>
    );
  }

  if (!loadingStudents && students.length === 0) {
     return (
       <div className="student-login-container">
         <Card title="Bienvenido a Chiapas Puede">
           <p>No hay perfiles de estudiante disponibles. Contacta al administrador.</p>
         </Card>
       </div>
     );
  }

  
  if (!loadingStudents && students.length > 1) {
    return (
      <div className="student-login-container">
        <Card title="Bienvenido a Chiapas Puede">
          <>
            <h3>Selecciona tu perfil</h3>
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
            <div className="button-group">
              <Button
                onClick={handleLogin}
                disabled={!selectedStudent}
              >
                Continuar
              </Button>
            </div>
          </>
        </Card>
      </div>
    );
  }

 
  return (
       <div className="student-login-container">
         <Card title="Iniciando sesión...">
           <p>Un momento...</p>
         </Card>
       </div>
  );

}; 