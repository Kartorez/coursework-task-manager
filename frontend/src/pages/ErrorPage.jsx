import { Link, useLocation } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {
  const location = useLocation();
  const code = location.state?.code || 404;

  const messages = {
    404: {
      title: 'Page Not Found',
      desc: 'The page you are looking for does not exist or has been moved.',
    },
    500: {
      title: 'Internal Server Error',
      desc: 'Something went wrong on our end. Please try again later.',
    },
    401: {
      title: 'Unauthorized',
      desc: 'You need to log in to access this page.',
    },
    403: {
      title: 'Access Denied',
      desc: 'You do not have permission to view this page.',
    },
  };

  const message = messages[code] || messages[404];

  return (
    <div className="error-page">
      <h1 className="error-code">{code}</h1>
      <h2 className="error-message">{message.title}</h2>
      <p className="error-description">{message.desc}</p>

      <Link to="/" className="error-button button">
        Go Home
      </Link>
    </div>
  );
};

export default ErrorPage;
