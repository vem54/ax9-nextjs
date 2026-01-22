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
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black',
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
          <span>Loading...</span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
