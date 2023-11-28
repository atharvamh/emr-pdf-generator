interface IProps{
    label: string;
    type: string;
    id: string;
    name: string;
    value: string | number | undefined;
    options?: Array<{label: string, value: string | number}>
    onChange: (name: string, value: string) => void;
    required?: boolean;
}

const GeneralInput = ({ label, type, id, name, value, options = [], onChange, required = false } : IProps) => {
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
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
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
      />
    </div>
  );
};

export default GeneralInput;