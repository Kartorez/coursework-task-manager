import React from 'react';
import { AppRouter } from './routes/AppRouter';
import { ModalProvider } from './context/ModalContext';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <TaskProvider>
          <ModalProvider>
            <AppRouter />
          </ModalProvider>
        </TaskProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
