import { useForm } from 'react-hook-form';
import { Check, Upload } from 'lucide-react';
import { Button } from './Button';
import type { StepProps } from '../types';
import { useState } from 'react';
import { simulateOCR } from '../utils';
import { FASSA_ACCOUNT_NUMBER } from '../constants';

export function ReceiptUploadStep({
  onNext,
  onPrevious,
  formData,
  setFormData,
}: StepProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      receipt: formData.receipt,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const file = data.receipt[0];
      if (!file) {
        setError('Please upload a receipt');
        return;
      }
      setUploaded(true);
      // Simulate OCR processing
      const ocrResult = await simulateOCR(file);

      // Verify the extracted information
      if (ocrResult.accountNumber !== FASSA_ACCOUNT_NUMBER) {
        setError('Invalid account number detected in the receipt');
        return;
      }

      if (ocrResult.amount !== formData.amountPaid) {
        setError('Amount in receipt does not match the selected payment options');
        return;
      }

      setFormData((prev) => ({ ...prev, receipt: file }));
      onNext();
    } catch (err) {
      setError('An error occurred while processing the receipt');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="flex flex-col items-center">

            {uploaded ? (
              <div className="flex items-center justify-center bg-green-50 border border-green-200 rounded-md h-12 w-12">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            ) : (
              <><Upload className="h-12 w-12 text-gray-400" /><div className="mt-4 text-center">
                  <label
                    htmlFor="receipt"
                    className="cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
                  >
                    <span>Upload your receipt</span>
                    <input
                      id="receipt"
                      type="file"
                      className="sr-only"
                      accept="image/*,.pdf"
                      {...register('receipt', { required: 'Receipt is required' })} />
                  </label>
                  <p className="text-sm text-gray-500">
                    PNG, JPG or PDF up to 10MB
                  </p>
                </div></>
            )}
            
          </div>
        </div>

        {errors.receipt && (
          <span className="text-xs text-red-500">
            {errors.receipt.message}
          </span>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Payment Summary
          </h4>
          <dl className="space-y-1">
            <div className="flex justify-between">
              <dt className="text-sm text-blue-600">Amount:</dt>
              <dd className="text-sm font-medium text-blue-800">
                ₦{formData.amountPaid.toLocaleString()}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-blue-600">Account Number:</dt>
              <dd className="text-sm font-medium text-blue-800">
                {FASSA_ACCOUNT_NUMBER}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          type="submit"
          disabled={isProcessing}
        >
          {isProcessing ? 'Verifying...' : 'Verify Payment'}
        </Button>
      </div>
    </form>
  );
}