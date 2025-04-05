import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StudentProvider } from './context/StudentContext';
import { ExerciseProvider } from './context/ExerciseContext';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('No se encontró el elemento root en el HTML');
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentProvider>
      <ExerciseProvider>
        <App />
      </ExerciseProvider>
    </StudentProvider>
  </StrictMode>
);
