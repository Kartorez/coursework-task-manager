import './ErrorPage.css';

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

const ErrorPage = ({ code = 404, title }) => {
  const message = messages[code] || messages[404];
  const displayTitle = title || message.title;

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="error-page">
      <h1 className="error-code">{code}</h1>
      <h2 className="error-message">{displayTitle}</h2>
      <p className="error-description">{message.desc}</p>

      <button onClick={handleGoHome} className="error-button button">
        На головну
      </button>
    </div>
  );
};

export default ErrorPage;
