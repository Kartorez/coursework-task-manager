import React from 'react';
import { AppRouter } from './routes/AppRouter';
import { ModalProvider } from './context/ModalContext';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ToastProvider } from './context/ToastContext';
import { ColumnProvider } from './context/ColumnContext';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ColumnProvider>
          <TaskProvider>
            <ModalProvider>
              <AppRouter />
            </ModalProvider>
          </TaskProvider>
        </ColumnProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
