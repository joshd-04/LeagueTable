import { HTMLInputTypeAttribute } from 'react';
import Label from '../text/Label';

interface InputFieldProps {
  type: HTMLInputTypeAttribute | undefined;
  required?: boolean;
  value?: string | number;
  setValue?: (newValue: string | number) => void;
  error?: string;
  setError?: (newError: string) => void;
  validatorFn?: (inputText: string | number) => {
    pass: boolean;
    message?: string;
  };
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
  validatorFn,
  options,
}: InputFieldProps) {
  if (validatorFn && value && setError) {
    const result = validatorFn(value);
    if (result.pass === false && result.message) {
      setError(result.message);
    }
  }

  // font details taken from <Paragraph />
  return (
    <div className="flex flex-col justify-baseline items-baseline w-full">
      <Label style={{ fontWeight: 'bold' }}>
        {options.label}
        {options.labelCaption && (
          <span className="font-normal"> - {options.labelCaption}</span>
        )}
      </Label>
      <input
        type={type}
        required={required}
        className="bg-[var(--bg-light)] rounded-[10px] px-[16px] py-[8px] font-[family-name:var(--font-instrument-sans)] font-normal text-[1rem] md:text-[1.125rem] xl:text-[1.25rem] text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none border-[var(--border)]/50 border-2 w-full 
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
      <Label
        style={{
          fontWeight: 'normal',
          color: 'var(--danger)',
          width: '100%',
          opacity: error ? undefined : '0',
        }}
      >
        Error<span className="font-normal"> - {error}</span>
      </Label>
    </div>
  );
}
