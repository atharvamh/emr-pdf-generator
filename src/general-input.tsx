interface IProps{
    label: string;
    type: string;
    id: string;
    name: string;
    value: string | number | undefined;
    options?: Array<{label: string, value: string | number}>
    onChange: (name: string, value: string) => void;
    onTxtAreaChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
}

const GeneralInput = ({ label, type, id, name, value, options = [], onChange, onTxtAreaChange, required = false, disabled = false } : IProps) => {
  if (type === 'dropdown') {
    return (
      <div className="mb-4 w-full">
        <label htmlFor={id} className="block text-sm font-medium">
          <span>{label}</span>
          {
            required ? <span className="text-red-500"> *</span> : <></>
          }
        </label>
        <select
          id={id}
          name={name}
          className="mt-1 p-2 border rounded-md text-gray-800 w-full"
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          required={required}
          disabled={disabled}
        >
          <option value="" disabled hidden>--</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  else if(type === 'textarea') {
    return (
      <div className="mb-4 w-full">
        <label htmlFor={id} className="block text-sm font-medium">
          <span>{label}</span>
          {
            required ? <span className="text-red-500"> *</span> : <></>
          }
        </label>
        <textarea
          id={id}
          name={name}
          className="mt-1 p-2 border rounded-md text-gray-800 text-sm w-full"
          value={value}
          onChange={(e) => onTxtAreaChange?.(e.currentTarget.value)}
          style={{ minHeight: "18rem" }}
          required={required}
          disabled={disabled}
        />
      </div>
    )
  }

  return (
    <div className="mb-4 w-full">
      <label htmlFor={id} className="block text-sm font-medium">
        <span>{label}</span>
        {
          required ? <span className="text-red-500"> *</span> : <></>
        }
      </label>
      <input
        type={type}
        id={id}
        name={name}
        className="mt-1 p-2 border rounded-md text-gray-800 w-full"
        value={value}
        onChange={(e) => onChange(name, e.currentTarget.value)}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default GeneralInput;