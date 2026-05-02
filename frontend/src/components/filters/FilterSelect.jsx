import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import './FilterSelect.css';

const portalStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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
  const shared = {
    placeholder,
    classNamePrefix: 'filter-select',
    value,
    onChange,
    isMulti,
    isClearable,
    menuPortalTarget: document.body,
    styles: portalStyles,
  };

  return (
    <div className={`filter-group ${className}`}>
      {label && <label className="filter-label">{label}</label>}

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
