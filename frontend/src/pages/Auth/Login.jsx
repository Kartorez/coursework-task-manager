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
      showToast('Успішна авторизація', 'success');
      if (user) navigate('/');
    } catch {
      showToast('Невірний логін або пароль', 'error');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-[#18191d] border border-gray-200 dark:border-[#262830] shadow-xl dark:shadow-2xl flex flex-col items-center transition-colors">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-blue-500 text-blue-600 dark:text-blue-400 font-bold text-lg bg-blue-500/10 mb-4">
          {new Date().getDate()}
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">
          З поверненням
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          Увійдіть у свій акаунт Task Manager
        </p>

        <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-[#1f2026] text-gray-900 dark:text-white border border-gray-300 dark:border-[#2e303a] focus:border-blue-500 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
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
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-[#1f2026] text-gray-900 dark:text-white border border-gray-300 dark:border-[#2e303a] focus:border-blue-500 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-sm transition-all"
          >
            Увійти
          </button>

          <div className="pt-2 text-center text-xs text-gray-500 dark:text-gray-400">
            <span>Не маєте акаунту? </span>
            <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Зареєструватись
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
