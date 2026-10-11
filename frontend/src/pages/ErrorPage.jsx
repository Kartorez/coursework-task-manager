import { Link } from 'react-router-dom';

const messages = {
  404: {
    title: 'Сторінку не знайдено',
    desc: 'Сторінка, яку ви шукаєте, не існує або була переміщена.',
  },
  500: {
    title: 'Помилка сервера',
    desc: 'Щось пішло не так на сервері. Спробуйте пізніше.',
  },
  401: {
    title: 'Не авторизовано',
    desc: 'Будь ласка, увійдіть у систему для доступу до цієї сторінки.',
  },
  403: {
    title: 'Доступ заборонено',
    desc: 'У вас недостатньо прав для перегляду цієї сторінки.',
  },
};

const ErrorPage = ({ code = 404, title }) => {
  const message = messages[code] || messages[404];
  const displayTitle = title || message.title;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <span className="text-7xl sm:text-8xl font-black text-blue-500/20 mb-2">
        {code}
      </span>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {displayTitle}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mb-6">{message.desc}</p>

      <Link
        to="/"
        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-md shadow-blue-500/20"
      >
        На головну
      </Link>
    </div>
  );
};

export default ErrorPage;
