import React from 'react';
import { AppRouter } from './routes/AppRouter';
import { ModalProvider } from './context/ModalContext';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ToastProvider } from './context/ToastContext';
import { ColumnProvider } from './context/ColumnContext';
import { TaskTypeProvider } from './context/TaskTypeContext';
import { TeamProvider } from './context/TeamContext';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <TeamProvider>
          <ColumnProvider>
            <TaskTypeProvider>
              <TaskProvider>
                <ModalProvider>
                  <AppRouter />
                </ModalProvider>
              </TaskProvider>
            </TaskTypeProvider>
          </ColumnProvider>
        </TeamProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
