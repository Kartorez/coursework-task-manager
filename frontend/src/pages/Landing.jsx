import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing">
      <div className="landing-hero">
        <h1 className="landing-title">
          <img src="/images/logo.png" alt="Logo" className="logo" />
          Task Manager
        </h1>
        <p className="landing-subtitle">
          Продуктивний інструмент для керування задачами
        </p>
      </div>

      <div className="landing-features">
        <div className="feature-card">
          <div className="feature-icon">✔</div>
          <h3>Керування задачами</h3>
          <p>
            Створюйте, редагуйте та переміщуйте задачі — швидко та інтуїтивно.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📌</div>
          <h3>Kanban дошка</h3>
          <p>Контролюйте прогрес у колонках “To Do”, “In Progress”, “Done”.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>Мобільність і зручність</h3>
          <p>
            Адаптивний дизайн, плавне меню та доступність з будь-якого пристрою.
          </p>
        </div>
      </div>

      <div className="landing-cta">
        <Link to="/login" className="cta-btn">
          Увійти
        </Link>
        <Link to="/register" className="cta-btn secondary">
          Створити акаунт
        </Link>
      </div>

      <p className="landing-footer">
        Мінімалістично, зручно і продуктивно — усе для комфортної роботи.{' '}
      </p>
    </div>
  );
};

export default Landing;
