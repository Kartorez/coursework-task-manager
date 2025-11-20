import AsyncSelect from 'react-select/async';
import './FilterSelect.css';

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
  return (
    <div className={`filter-group ${className}`}>
      {label && <label className="filter-label">{label}</label>}

      <AsyncSelect
        cacheOptions
        defaultOptions={defaultOptions}
        loadOptions={loadOptions}
        placeholder={placeholder}
        classNamePrefix="filter-select"
        value={value}
        onChange={onChange}
        isMulti={isMulti}
        isClearable={isClearable}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />
    </div>
  );
};

export default FilterSelect;
