import * as React from 'react';
const { forwardRef, useId } = React;
import { cn } from '@/src/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      leftIcon,
      rightIcon,
      containerClassName,
      labelClassName,
      inputClassName,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${useId()}`;

    return (
      <div className={cn('space-y-2 w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-semibold text-gray-700 text-right',
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            className={cn(
              'block w-full h-14 px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition-all duration-200 text-left',
              {
                'pr-14': leftIcon,
                'border-red-500': error,
                'focus:border-red-500 focus:ring-red-200': error,
              },
              inputClassName,
              className
            )}
            ref={ref}
            dir="ltr"
            {...props}
          />
          {leftIcon && (
            <div className="absolute inset-y-0 right-0 pr-1.5 flex items-center pointer-events-none">
              <div className="w-10 h-10 flex items-center justify-center text-gray-500 bg-purple-100 rounded-xl transition-colors duration-200">
                {React.cloneElement(leftIcon as React.ReactElement<{ className?: string }>, {
                  className: 'w-5 h-5',
                })}
              </div>
            </div>
          )}
  
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 text-right">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <Input
        type={showPassword ? 'text' : 'password'}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-purple-600 transition-colors"
          >
          </button>
        }
        ref={ref}
        {...props}
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

