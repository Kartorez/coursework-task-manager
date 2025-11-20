import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const schema = yup.object({
  email: yup
    .string()
    .required('Email є обов’язковим')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Некоректний формат email'
    ),
  password: yup
    .string()
    .required('Пароль є обов’язковим')
    .min(6, 'Мінімум 6 символів'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      showToast('Успішна авторизація ', 'success');
      if (user) navigate('/');
    } catch {
      showToast('Невірний логін або пароль', 'error');
    }
  };
  return (
    <div className="form-layout">
      <div className="form-container">
        <div className="form-logo">
          <img
            src="images/logo_big.png"
            alt="Logo"
            className="form-logo__image"
          />
        </div>
        <h2 className="form-title">З поверненням</h2>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              placeholder="Введіть ваш Email"
              className="form-input"
              {...register('email')}
            />
            <p className="input-errors">{errors.email?.message}</p>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Пароль:
            </label>
            <input
              type="password"
              id="password"
              placeholder="Введіть ваш пароль"
              className="form-input"
              {...register('password')}
            />
            <p className="input-errors">{errors.password?.message}</p>
          </div>

          <button type="submit" className="form-button button">
            Увійти
          </button>

          <div className="form-footer">
            <span>Не маєте акаунт?</span>
            <Link to="/register" className="form-link">
              Зареєструватись
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
