import { useState } from 'react';

const WEEKDAYS = ['П', 'В', 'С', 'Ч', 'П', 'С', 'Н'];

const MiniCalendar = ({ selectedDate, onSelectDate }) => {
  const [viewDate, setViewDate] = useState(selectedDate || new Date());

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const monthName = viewDate.toLocaleDateString('uk-UA', {
    month: 'long',
    year: 'numeric',
  });
  const formattedMonthName =
    monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const prevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  let firstDayIndex = firstDayOfMonth.getDay() - 1;
  if (firstDayIndex === -1) firstDayIndex = 6;

  const totalDays = lastDayOfMonth.getDate();

  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
  const prevDays = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    prevDays.push({
      day: prevMonthLastDay - i,
      month: currentMonth - 1,
      isCurrentMonth: false,
    });
  }

  const currentDays = [];
  for (let i = 1; i <= totalDays; i++) {
    currentDays.push({
      day: i,
      month: currentMonth,
      isCurrentMonth: true,
    });
  }

  const totalSlots = 35;
  const nextDaysCount = Math.max(0, totalSlots - (prevDays.length + currentDays.length));
  const nextDays = [];
  for (let i = 1; i <= nextDaysCount; i++) {
    nextDays.push({
      day: i,
      month: currentMonth + 1,
      isCurrentMonth: false,
    });
  }

  const allDays = [...prevDays, ...currentDays, ...nextDays];

  const today = new Date();
  const isToday = (d, m) =>
    today.getDate() === d &&
    today.getMonth() === m &&
    today.getFullYear() === currentYear;

  const isSelected = (d, m) =>
    selectedDate &&
    selectedDate.getDate() === d &&
    selectedDate.getMonth() === m &&
    selectedDate.getFullYear() === currentYear;

  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
          {formattedMonthName}
        </span>
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <button
            onClick={prevMonth}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#252832] hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextMonth}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#252832] hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {WEEKDAYS.map((w, idx) => (
          <span
            key={idx}
            className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 py-1"
          >
            {w}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {allDays.map((item, idx) => {
          const current = isToday(item.day, item.month);
          const selected = isSelected(item.day, item.month);

          return (
            <button
              key={idx}
              onClick={() => {
                const target = new Date(currentYear, item.month, item.day);
                onSelectDate?.(target);
              }}
              className={`w-7 h-7 mx-auto rounded-full text-xs flex items-center justify-center transition-all ${
                selected
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30'
                  : current
                  ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold ring-1 ring-blue-500/50'
                  : item.isCurrentMonth
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#252832]'
                  : 'text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#1f2026]'
              }`}
            >
              {item.day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
