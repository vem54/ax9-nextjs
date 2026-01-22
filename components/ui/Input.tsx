import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, hint, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium mb-2"
          >
            {label}
            {props.required && <span className="text-gray-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full px-3 py-3 text-sm',
            'bg-white border',
            'placeholder:text-gray-500',
            'transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black',
            error
              ? 'border-black bg-red-50'
              : 'border-black focus:border-gray-500',
            props.disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : '',
            className,
          ].join(' ')}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-gray-500 mt-2">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-black mt-2">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, hint, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium mb-2"
          >
            {label}
            {props.required && <span className="text-gray-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={[
            'w-full px-3 py-3 text-sm',
            'bg-white border',
            'placeholder:text-gray-500',
            'transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black',
            'resize-none',
            error
              ? 'border-black bg-red-50'
              : 'border-black focus:border-gray-500',
            props.disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : '',
            className,
          ].join(' ')}
          rows={4}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-gray-500 mt-2">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-black mt-2">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Input;
