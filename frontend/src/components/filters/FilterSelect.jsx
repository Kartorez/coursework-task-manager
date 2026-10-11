import Select from 'react-select';
import AsyncSelect from 'react-select/async';

const isDarkMode = () =>
  typeof document !== 'undefined' &&
  (document.documentElement.classList.contains('dark') ||
    document.documentElement.getAttribute('data-theme') === 'dark');

const getSelectStyles = () => {
  const dark = isDarkMode();

  return {
    control: (base, state) => ({
      ...base,
      backgroundColor: dark ? '#1f2026' : '#ffffff',
      borderColor: state.isFocused ? '#3b82f6' : dark ? '#2e303a' : '#d1d5db',
      borderRadius: '0.75rem',
      minHeight: '36px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : dark ? '#3e414e' : '#9ca3af',
      },
      cursor: 'pointer',
      fontSize: '0.85rem',
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '2px 8px',
      gap: '4px',
    }),
    singleValue: (base) => ({
      ...base,
      color: dark ? '#e2e4ea' : '#1f2937',
    }),
    placeholder: (base) => ({
      ...base,
      color: dark ? '#717584' : '#9ca3af',
    }),
    input: (base) => ({
      ...base,
      color: dark ? '#ffffff' : '#111827',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: dark ? '#18191d' : '#ffffff',
      border: `1px solid ${dark ? '#2e303a' : '#e5e7eb'}`,
      borderRadius: '0.75rem',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden',
      zIndex: 9999,
    }),
    menuList: (base) => ({
      ...base,
      padding: '4px',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#2563eb'
        : state.isFocused
        ? dark
          ? '#242630'
          : '#f3f4f6'
        : 'transparent',
      color: state.isSelected
        ? '#ffffff'
        : dark
        ? '#d1d5db'
        : '#374151',
      borderRadius: '0.5rem',
      fontSize: '0.85rem',
      padding: '6px 10px',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#2563eb',
        color: '#ffffff',
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#2563eb',
      borderRadius: '0.375rem',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#ffffff',
      fontSize: '0.75rem',
      fontWeight: '500',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#ffffff',
      ':hover': {
        backgroundColor: '#1d4ed8',
        color: '#ffffff',
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: dark ? '#717584' : '#9ca3af',
      padding: '4px',
      ':hover': {
        color: dark ? '#d1d5db' : '#4b5563',
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: dark ? '#717584' : '#9ca3af',
      padding: '4px',
      ':hover': {
        color: '#ef4444',
      },
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };
};

const FilterSelect = ({
  label,
  placeholder = 'Виберіть...',
  loadOptions,
  defaultOptions = [],
  value = [],
  onChange,
  className = '',
  isMulti = true,
  isClearable = false,
}) => {
  const styles = getSelectStyles();

  const shared = {
    placeholder,
    value,
    onChange,
    isMulti,
    isClearable,
    menuPortalTarget: typeof document !== 'undefined' ? document.body : null,
    styles,
  };

  return (
    <div className={`flex flex-col gap-1 min-w-[150px] sm:w-44 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 pl-1">
          {label}
        </label>
      )}

      {loadOptions ? (
        <AsyncSelect
          cacheOptions
          defaultOptions={defaultOptions}
          loadOptions={loadOptions}
          {...shared}
        />
      ) : (
        <Select options={defaultOptions} {...shared} />
      )}
    </div>
  );
};

export default FilterSelect;
