import { CheckCircle } from 'lucide-react';
import { Button } from './Button';
import type { StepProps } from '../types';

export function SuccessStep({ formData }: StepProps) {
  const handleDownload = () => {
    // In a real application, this would generate a PDF receipt
    alert('Receipt download functionality would be implemented here');
  };

  return (
    <div className="text-center">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      
      <h2 className="mt-6 text-2xl font-semibold text-gray-900">
        Payment Verified Successfully!
      </h2>
      
      <p className="mt-2 text-sm text-gray-600">
        Your payment has been verified and recorded in our system.
      </p>

      <div className="mt-8 bg-gray-50 rounded-lg p-6 text-left">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Payment Details
        </h3>
        
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600">Name:</dt>
            <dd className="text-sm font-medium text-gray-900">{formData.name}</dd>
          </div>
          
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600">Matric Number:</dt>
            <dd className="text-sm font-medium text-gray-900">
              {formData.matricNumber}
            </dd>
          </div>
          
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600">Department:</dt>
            <dd className="text-sm font-medium text-gray-900">
              {formData.department}
            </dd>
          </div>
          
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600">Amount Paid:</dt>
            <dd className="text-sm font-medium text-gray-900">
              ₦{formData.amountPaid.toLocaleString()}
            </dd>
          </div>
          
          <div className="pt-3 border-t border-gray-200">
            <dt className="text-sm text-gray-600 mb-2">Payments Made:</dt>
            <dd className="text-sm font-medium text-gray-900">
              <ul className="list-disc list-inside space-y-1">
                {formData.paymentOptions.map((optionId) => {
                  const option = PAYMENT_OPTIONS.find((opt) => opt.id === optionId);
                  return option ? (
                    <li key={option.id}>
                      {option.name} - ₦{option.amount.toLocaleString()}
                    </li>
                  ) : null;
                })}
              </ul>
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-8">
        <Button onClick={handleDownload}>
          Download Receipt
        </Button>
      </div>
    </div>
  );
}