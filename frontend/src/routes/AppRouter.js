import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MinLayout';
import Dashboard from '../pages/Dashboard';
import Tasks from '../pages/Tasks';
import Login from '../pages/Auth/Login';
import Registration from '../pages/Auth/Registration';
import Landing from '../pages/Landing';
import ErrorPage from '../pages/ErrorPage';
import { ErrorBoundary } from '../components/ErrorBoundary';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <MainLayout />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,

    children: [
      {
        path: 'landing',
        element: (
          <PublicRoute>
            <Landing />
          </PublicRoute>
        ),
      },
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <Registration />
          </PublicRoute>
        ),
      },

      {
        index: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'tasks',
        element: (
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        ),
      },

      { path: '*', element: <ErrorPage code={404} /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
