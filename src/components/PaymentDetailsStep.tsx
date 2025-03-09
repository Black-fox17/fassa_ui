import { useForm } from 'react-hook-form';
import { Checkbox } from './Checkbox';
import { Button } from './Button';
import { PAYMENT_OPTIONS } from '../constants';
import { calculateTotalAmount } from '../utils';
import type { StepProps } from '../types';

export function PaymentDetailsStep({
  onNext,
  onPrevious,
  formData,
  setFormData,
}: StepProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      paymentOptions: formData.paymentOptions,
      amountPaid: formData.amountPaid,
    },
  });

  const selectedOptions = watch('paymentOptions', []);
  const totalAmount = calculateTotalAmount(selectedOptions);

  const onSubmit = (data: any) => {
    setFormData((prev) => ({
      ...prev,
      paymentOptions: data.paymentOptions,
      amountPaid: totalAmount,
    }));
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Select Payment Options
          </h3>
          <div className="space-y-3">
            {PAYMENT_OPTIONS.map((option) => (
              <Checkbox
                key={option.id}
                {...register('paymentOptions')}
                value={option.id}
                label={option.name}
                amount={option.amount}
              />
            ))}
          </div>
          {errors.paymentOptions && (
            <span className="text-xs text-red-500 mt-1">
              {errors.paymentOptions.message}
            </span>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-900">Total Amount:</span>
            <span className="text-2xl font-bold text-blue-600">
              ₦{totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          type="submit"
          disabled={selectedOptions.length === 0}
        >
          Next
        </Button>
      </div>
    </form>
  );
}