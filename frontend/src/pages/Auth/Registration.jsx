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
      showToast('Успішна реєстрація', 'success');
    } catch {
      showToast('Помилка при реєстрації', 'error');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-[#18191d] border border-gray-200 dark:border-[#262830] shadow-xl dark:shadow-2xl flex flex-col items-center transition-colors">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-blue-500 text-blue-600 dark:text-blue-400 font-bold text-lg bg-blue-500/10 mb-4">
          {new Date().getDate()}
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">
          Створити акаунт
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          Почніть планувати свій час разом із Task Manager
        </p>

        <form className="w-full space-y-3.5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Ім’я користувача
            </label>
            <input
              type="text"
              id="username"
              placeholder="username"
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-[#1f2026] text-gray-900 dark:text-white border border-gray-300 dark:border-[#2e303a] focus:border-blue-500 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              {...register('username')}
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="name@example.com"
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-[#1f2026] text-gray-900 dark:text-white border border-gray-300 dark:border-[#2e303a] focus:border-blue-500 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-[#1f2026] text-gray-900 dark:text-white border border-gray-300 dark:border-[#2e303a] focus:border-blue-500 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Підтвердження паролю
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-[#1f2026] text-gray-900 dark:text-white border border-gray-300 dark:border-[#2e303a] focus:border-blue-500 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-sm transition-all"
          >
            Зареєструватись
          </button>

          <div className="pt-2 text-center text-xs text-gray-500 dark:text-gray-400">
            <span>Вже маєте акаунт? </span>
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Увійти
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
