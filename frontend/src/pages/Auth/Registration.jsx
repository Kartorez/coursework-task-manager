import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authService } from '../../api/authService';
import { useToast } from '../../context/ToastContext';

const schema = yup.object({
  username: yup
    .string()
    .required('Ім’я користувача є обов’язковим')
    .min(3, 'Мінімум 3 символи'),
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
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Паролі не співпадають')
    .required('Підтвердіть пароль'),
});

const Registration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();
  const { showToast } = useToast();
  const onSubmit = async (data) => {
    try {
      await authService.register({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      navigate('/login');
      showToast('Успішна реєстрація ', 'success');
    } catch (error) {
      showToast('Помилка при реєстрації ', 'error');
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
        <h2 className="form-title">Реєстрація</h2>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username:
            </label>
            <input
              type="text"
              id="username"
              placeholder="Введіть username"
              className="form-input"
              {...register('username')}
            />
            <p className="input-errors">{errors.username?.message}</p>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              placeholder="Введіть email"
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
              placeholder="Введіть пароль"
              className="form-input"
              {...register('password')}
            />
            <p className="input-errors">{errors.password?.message}</p>
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password" className="form-label">
              Підтвердіть пароль:
            </label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Підтвердіть пароль"
              className="form-input"
              {...register('confirmPassword')}
            />
            <p className="input-errors">{errors.confirmPassword?.message}</p>
          </div>

          <button type="submit" className="form-button button">
            Реєстрація
          </button>

          <div className="form-footer">
            <span>Вже маєте акаунт?</span>
            <Link to="/login" className="form-link">
              Увійти
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
