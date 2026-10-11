import { useState } from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const [previewTab, setPreviewTab] = useState('kanban');
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: 'Як працює система команд та призначення задач?',
      a: 'Ви можете створити команду в пару кліків та скопіювати унікальний 6-значний код запрошення або додати колег за їх email/ніком. При створенні задачі у випадаючому списку ви бачите виключно учасників вашої команди, що забезпечує повну приватність та фокус.',
    },
    {
      q: 'Чи можна планувати розклад по годинах у календарі?',
      a: 'Так! Наш інтерактивний календар підтримує крок у 30 хвилин. Ви можете перетягувати задачі з беклогу на будь-який слот, змінювати тривалість і переміщати події між днями та годинами простим Drag & Drop.',
    },
    {
      q: 'Як змінювати порядок колонок на канбан-дошці?',
      a: 'Просто затисніть ручку перетягування (⠿) у шапці колонки та перетягніть її між будь-якими сусідніми колонками. Синя напрямна лінія вкаже точне місце вставки.',
    },
    {
      q: 'Чи підтримуються світла та темна теми?',
      a: 'Так, Task Manager створений з повною підтримкою глибокої темної теми та чистої світлої теми з миттєвим перемиканням в один клік у шапці сайту.',
    },
  ];

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth bg-[#f8f9fa] dark:bg-[#131417] text-gray-800 dark:text-[#e2e4ea] transition-colors">
      <div className="relative">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] sm:w-[850px] h-[400px] bg-gradient-to-tr from-blue-500/20 via-indigo-500/15 to-purple-500/20 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-[850px] right-0 w-[450px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-[1600px] left-0 w-[500px] h-[400px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />

        <section className="px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24 max-w-6xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6 shadow-sm hover:scale-105 transition-transform cursor-default">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Task Manager • Новий рівень планування та командної роботи</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mb-6">
            Організуйте проєкти, час та команди{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              в єдиному просторі
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mb-8 sm:mb-10 leading-relaxed font-normal">
            Інтерактивний календар з плануванням по 30 хвилин, гнучка канбан-дошка з розумним DnD між колонками, ізольовані команди та миттєва синхронізація завдань.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center w-full max-w-md mb-12">
            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-500/25 transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Розпочати безкоштовно</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white dark:bg-[#1c1d22] hover:bg-gray-50 dark:hover:bg-[#252730] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-[#2e303a] font-semibold text-sm transition-all shadow-sm flex items-center justify-center"
            >
              Увійти в акаунт
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200/60 dark:border-[#22242b] w-full max-w-3xl">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500">✓</span>
              <span>Безкоштовно для студентів та команд</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-blue-500">✓</span>
              <span>Інтерактивний Drag & Drop</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-purple-500">✓</span>
              <span>Ізольовані робочі команди</span>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 pb-20 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-gray-200/90 dark:border-[#282a33] bg-white/80 dark:bg-[#16171b]/90 backdrop-blur-xl shadow-2xl overflow-hidden transition-all">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-[#252730] bg-gray-50/70 dark:bg-[#191a20]/70">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 font-semibold text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                  Task Manager — Інтерактивне демо
                </span>
              </div>

              <div className="flex items-center p-1 rounded-xl bg-gray-200/80 dark:bg-[#20222a] border border-gray-300/50 dark:border-[#2c2f3b]">
                <button
                  onClick={() => setPreviewTab('kanban')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${previewTab === 'kanban'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  📌 Канбан-дошка
                </button>
                <button
                  onClick={() => setPreviewTab('calendar')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${previewTab === 'calendar'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  📅 Календар 30-хв
                </button>
              </div>
            </div>

            <div className="px-5 py-3 border-b border-gray-100 dark:border-[#22242c] flex items-center justify-between bg-white dark:bg-[#16171b]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                  Проєкт: Курсова робота
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  👥 Dev Team [8K2M9Q]
                </span>
              </div>
              <span className="text-[11px] text-gray-400 dark:text-gray-500">
                Синхронізовано щойно
              </span>
            </div>

            <div className="p-4 sm:p-6 bg-[#f8f9fa] dark:bg-[#111215] min-h-[380px]">
              {previewTab === 'kanban' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-2xl bg-gray-100 dark:bg-[#18191e] border border-gray-200 dark:border-[#252732] flex flex-col gap-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200/80 dark:border-[#282a35]">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">⠿</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          До виконання
                        </span>
                        <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-gray-200 dark:bg-[#252834] text-gray-600 dark:text-gray-400">
                          2
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-[#20222a] border border-gray-200 dark:border-[#2d303b] shadow-sm hover:border-blue-500/40 transition-all cursor-grab space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                          #Навчання
                        </span>
                        <span className="text-[10px] text-gray-400">14 Жовтня</span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-snug">
                        Підготувати розділ архітектури БД
                      </h4>
                      <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500 dark:text-gray-400">
                        <span>⏰ 14:00 - 15:30</span>
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-500 font-bold text-[10px] flex items-center justify-center">
                          К
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-[#20222a] border border-gray-200 dark:border-[#2d303b] shadow-sm hover:border-blue-500/40 transition-all cursor-grab space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          #Бекенд
                        </span>
                        <span className="text-[10px] text-gray-400">15 Жовтня</span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-snug">
                        Налаштувати Sequelize асоціації команд
                      </h4>
                      <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500 dark:text-gray-400">
                        <span>⏰ 10:00 - 11:30</span>
                        <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-500 font-bold text-[10px] flex items-center justify-center">
                          А
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-gray-100 dark:bg-[#18191e] border border-blue-500/30 bg-blue-50/20 dark:bg-[#1a1c24] flex flex-col gap-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200/80 dark:border-[#282a35]">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">⠿</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          В процесі
                        </span>
                        <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                          1
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-[#20222a] border-2 border-blue-500 shadow-md space-y-2 cursor-grab ring-2 ring-blue-500/20">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          #Фронтенд
                        </span>
                        <span className="text-[10px] font-bold text-blue-500">Сьогодні</span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-snug">
                        Дроп колонок між сусідніми позиціями
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                        Інтерактивний вертикальний індикатор вставки...
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500 dark:text-gray-400">
                        <span>⏰ 12:00 - 13:30</span>
                        <div className="flex -space-x-1.5">
                          <div className="w-5 h-5 rounded-full bg-blue-500 text-white font-bold text-[9px] flex items-center justify-center ring-2 ring-white dark:ring-[#20222a]">
                            К
                          </div>
                          <div className="w-5 h-5 rounded-full bg-indigo-500 text-white font-bold text-[9px] flex items-center justify-center ring-2 ring-white dark:ring-[#20222a]">
                            О
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-gray-100 dark:bg-[#18191e] border border-gray-200 dark:border-[#252732] flex flex-col gap-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200/80 dark:border-[#282a35]">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">⠿</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          Готово
                        </span>
                        <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-gray-200 dark:bg-[#252834] text-gray-600 dark:text-gray-400">
                          1
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-[#20222a] border border-gray-200 dark:border-[#2d303b] shadow-sm opacity-80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          #UI/UX
                        </span>
                        <span className="text-[10px] text-emerald-500 font-bold">✓ Завершено</span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-snug line-through text-gray-500">
                        Темна тема та мобільне меню-шторка
                      </h4>
                      <div className="flex items-center justify-between pt-1 text-[11px] text-gray-400">
                        <span>⏰ 09:30 - 11:00</span>
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 font-bold text-[10px] flex items-center justify-center">
                          ✓
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-2xl bg-gray-100 dark:bg-[#18191e] border border-gray-200 dark:border-[#252732] flex flex-col gap-2">
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      📋 Беклог (Без дати)
                    </span>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#20222a] border border-dashed border-gray-300 dark:border-[#2e313c] text-xs font-medium text-gray-700 dark:text-gray-300 cursor-grab">
                      Рефакторинг API авторизації
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#20222a] border border-dashed border-gray-300 dark:border-[#2e313c] text-xs font-medium text-gray-700 dark:text-gray-300 cursor-grab">
                      Написання висновків
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-auto">
                      ⇄ Перетягніть у розклад праворуч
                    </p>
                  </div>

                  <div className="md:col-span-3 p-4 rounded-2xl bg-white dark:bg-[#18191e] border border-gray-200 dark:border-[#252732] space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-[#242630]">
                      <span className="font-bold text-xs text-gray-900 dark:text-white">
                        Розклад на день (крок 30 хв)
                      </span>
                      <span className="text-xs text-blue-500 font-semibold">
                        Жовтень 2026
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-[#20222a] border border-gray-100 dark:border-[#282a35]">
                        <span className="text-gray-400 font-bold w-12 text-[11px]">09:00</span>
                        <div className="flex-1 p-1.5 rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400 font-sans font-semibold text-xs border border-blue-500/25">
                          Стендап команди [Dev Team] • 09:00 - 09:30
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-[#20222a] border border-gray-100 dark:border-[#282a35]">
                        <span className="text-gray-400 font-bold w-12 text-[11px]">10:00</span>
                        <div className="flex-1 p-2 rounded-md bg-purple-500/15 text-purple-600 dark:text-purple-400 font-sans font-semibold text-xs border border-purple-500/25">
                          Розробка системи колонок Канбан • 10:00 - 11:30 (90 хв)
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-[#20222a] border border-gray-100 dark:border-[#282a35]">
                        <span className="text-gray-400 font-bold w-12 text-[11px]">11:30</span>
                        <div className="flex-1 p-1.5 rounded-md border border-dashed border-gray-300 dark:border-[#333644] text-gray-400 font-sans text-xs flex items-center justify-center">
                          + Вільний слот (натисніть або перетягніть задачу)
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-[#20222a] border border-gray-100 dark:border-[#282a35]">
                        <span className="text-gray-400 font-bold w-12 text-[11px]">14:00</span>
                        <div className="flex-1 p-2 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-sans font-semibold text-xs border border-emerald-500/25">
                          Зустріч з керівником проєкту • 14:00 - 15:00
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-16 sm:py-24 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
              Все необхідне для ідеального робочого процесу
            </h2>
            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400">
              Повний набір інструментів: від індивідуального планування дня до злагодженої командної розробки.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#18191d] border border-gray-200 dark:border-[#262830] hover:border-blue-500/50 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                📅
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                Календар з 30-хв сіткою
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Плануйте завдання з точним таймінгом. Клікніть на будь-які пів години, щоб створити подію, або перетягуйте задачі з беклогу прямо в розклад.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#18191d] border border-gray-200 dark:border-[#262830] hover:border-indigo-500/50 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                📌
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                Розумна Канбан-дошка
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Створюйте власні статуси колонок. Змінюйте порядок колонок, вставляючи їх точно між сусідніми позиціями з візуальним індикатором.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#18191d] border border-gray-200 dark:border-[#262830] hover:border-purple-500/50 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                👥
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                Ізольовані Команди
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Працюйте тільки зі своїми колегами! Діліться швидким 6-значним кодом команди та призначайте виконавців тільки з учасників своєї команди.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#18191d] border border-gray-200 dark:border-[#262830] hover:border-emerald-500/50 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🏷️
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                Категорії та Теги
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Групуйте задачі за кольоровими типами (Робота, Навчання, Спорт, Особисте) та додавайте довільні теги для швидкого візуального розпізнавання.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#18191d] border border-gray-200 dark:border-[#262830] hover:border-amber-500/50 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                📱
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                Мобільний Drawer & UI
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Адаптований інтерфейс для смартфонів. Виїзна шторка меню, швидка плаваюча кнопка `+` та плавний горизонтальний скрол колонок.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#18191d] border border-gray-200 dark:border-[#262830] hover:border-rose-500/50 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                Синхронізація в реальному часі
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Надійний бекенд на Node.js та PostgreSQL. Оптимістичні оновлення інтерфейсу, зберігання стану колонок у профілі та миттєвий відгук.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-16 max-w-5xl mx-auto border-t border-gray-200/80 dark:border-[#22242c]">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              Як розпочати роботу за 3 кроки
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Жодних складних налаштувань чи довгого навчання
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#18191d] border border-gray-200 dark:border-[#262830] text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
                1
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                Швидка реєстрація
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Створіть свій безкоштовний акаунт за 15 секунд і отримайте доступ до робочої дошки.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#18191d] border border-gray-200 dark:border-[#262830] text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto shadow-md shadow-indigo-500/20">
                2
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                Створіть або приєднайтесь до команди
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Згенеруйте 6-значний код команди та запросіть колег для спільних завдань.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#18191d] border border-gray-200 dark:border-[#262830] text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto shadow-md shadow-purple-500/20">
                3
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                Плануйте та досягайте цілей
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Розподіляйте час у 30-хвилинній сітці та рухайте задачі до статусу «Готово».
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-16 max-w-4xl mx-auto border-t border-gray-200/80 dark:border-[#22242c]">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              Поширені запитання
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Відповіді на головні питання щодо роботи з Task Manager
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-200 dark:border-[#262830] bg-white dark:bg-[#18191d] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className={`text-base font-bold transition-transform duration-200 ${activeFaq === idx ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-[#20222a] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 sm:px-6 py-16 max-w-5xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-center relative overflow-hidden shadow-2xl shadow-blue-600/30">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Готові взяти під контроль кожну хвилину продуктивності?
              </h2>
              <p className="text-xs sm:text-base text-blue-100 font-normal">
                Приєднуйтесь до Task Manager вже зараз. Створіть команду, розподіліть задачі та спостерігайте, як ваші проєкти рухаються вперед.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/register"
                  className="px-8 py-3 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  Створити акаунт зараз →
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-xl bg-black/20 hover:bg-black/30 text-white font-medium text-sm transition-colors border border-white/20"
                >
                  Вже маєте акаунт? Увійти
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="px-4 sm:px-6 py-8 border-t border-gray-200 dark:border-[#22242c] bg-white dark:bg-[#121316]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
              <div className="flex items-center justify-center w-6 h-6 rounded-lg border border-blue-500 text-blue-500 font-bold text-xs bg-blue-500/10">
                11
              </div>
              <span>Task Manager</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/login" className="hover:text-blue-500 transition-colors">
                Вхід
              </Link>
              <Link to="/register" className="hover:text-blue-500 transition-colors">
                Реєстрація
              </Link>
              <span className="text-gray-400">Курсовий проєкт</span>
            </div>
            <div>
              © {new Date().getFullYear()} Task Manager. Всі права захищено.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
