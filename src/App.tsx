import { useEffect } from 'react';
import { useStudent } from './context/StudentContext';
import { useExercise } from './context/ExerciseContext';
import { StudentLogin } from './features/auth/StudentLogin';
import { Dashboard } from './features/dashboard/Dashboard';
import { ExerciseView } from './features/exercises/ExerciseView';
import { ResultView } from './features/results/ResultView';
import './App.css';

export default function App() {
  const { currentStudent } = useStudent();
  const { currentExercise, lastEvaluationResult } = useExercise();
  
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          <img src="/logo.png" alt="Chiapas Puede" />
          <h1>Chiapas Puede</h1>
        </div>
      </header>
      
      <main className="app-content">
        {!currentStudent ? (
          <StudentLogin />
        ) : (
          <Dashboard />
        )}
        
        {/* Modal para ejercicio actual */}
        {currentExercise && <ExerciseView />}
        
        {/* Modal para resultado de evaluación */}
        {lastEvaluationResult && <ResultView />}
      </main>
      
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Chiapas Puede - Apoyando la enseñanza de lecto-escritura</p>
      </footer>
    </div>
  );
}