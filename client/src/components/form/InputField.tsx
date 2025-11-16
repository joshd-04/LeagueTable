import { HTMLInputTypeAttribute } from 'react';

interface InputFieldProps {
  type: HTMLInputTypeAttribute | undefined;
  required?: boolean;
  value?: string | number;
  setValue?: (newValue: string | number) => void;
  error?: string;
  setError?: (newError: string) => void;

  options: {
    label: string;
    labelCaption?: string;
    placeholder: string;
  };
}

export default function InputField({
  type,
  required = true,
  value,
  setValue,
  error,
  setError,

  options,
}: InputFieldProps) {
  return (
    <div className="flex flex-col justify-baseline items-baseline w-full">
      <p className="font-bold text-sm">
        {options.label}
        {options.labelCaption && (
          <span className="font-normal"> - {options.labelCaption}</span>
        )}
      </p>
      <input
        type={type}
        required={required}
        className="bg-[var(--bg-light)] rounded-[10px] px-[16px] py-[8px] font-[family-name:var(--font-instrument-sans)] font-normal text-[1rem] md:text-[1.125rem] xl:text-[1.25rem] text-[var(--text)] placeholder:text-muted outline-none border-[var(--border)]/50 border-2 w-full 
        "
        placeholder={options.placeholder}
        value={value}
        onChange={(e) => {
          if (setError && setValue) {
            setError('');
            setValue(e.target.value);
          }
        }}
      />
      <p
        style={{ opacity: error ? undefined : '0' }}
        className="font-normal text-danger w-full"
      >
        Error<span className="font-normal"> - {error}</span>
      </p>
    </div>
  );
}
