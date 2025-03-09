import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '../utils';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  amount: number;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, amount, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-3 cursor-pointer">
        <input
          type="checkbox"
          className={cn(
            'h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600',
            className
          )}
          ref={ref}
          {...props}
        />
        <span className="text-sm font-medium text-gray-700">
          {label} - ₦{amount.toLocaleString()}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };