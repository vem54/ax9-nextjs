import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      loading,
      disabled,
      fullWidth,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = [
      'inline-flex items-center justify-center',
      'font-medium uppercase tracking-wide',
      'transition-colors duration-200',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      fullWidth ? 'w-full' : '',
    ].join(' ');

    const variants = {
      primary: 'bg-black text-white hover:bg-gray-500 active:bg-gray-500',
      secondary:
        'bg-white text-black border border-black hover:bg-black hover:text-white active:bg-black active:text-white',
      ghost: 'bg-transparent text-black hover:text-gray-500 active:text-gray-500',
    };

    const sizes = {
      sm: 'px-3 py-2 text-xs',
      md: 'px-4 py-3 text-sm',
      lg: 'px-6 py-4 text-sm',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
