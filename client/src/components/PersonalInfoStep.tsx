import { useForm } from 'react-hook-form';
import { Input } from './Input';
import { Button } from './Button';
import { DEPARTMENTS } from '../constants';
import type { StepProps } from '../types';

export function PersonalInfoStep({ onNext, formData, setFormData }: StepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: formData.name,
      matricNumber: formData.matricNumber,
      department: formData.department,
    },
  });

  const onSubmit = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <Input
            {...register('name', { required: 'Name is required' })}
            placeholder="Enter your full name"
            error={errors.name?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matric Number
          </label>
          <Input
            {...register('matricNumber', {
              required: 'Matric number is required',
              pattern: {
                value: /^\d{6}$/,
                message: 'Please enter a valid 6-digit matric number',
              },
            })}
            placeholder="Enter your matric number"
            error={errors.matricNumber?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            {...register('department', { required: 'Department is required' })}
            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <option value="">Select your department</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <span className="text-xs text-red-500 mt-1">
              {errors.department.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}