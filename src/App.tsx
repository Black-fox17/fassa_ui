import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { PersonalInfoStep } from './components/PersonalInfoStep';
import { PaymentDetailsStep } from './components/PaymentDetailsStep';
import { ReceiptUploadStep } from './components/ReceiptUploadStep';
import { SuccessStep } from './components/SuccessStep';
import fassa from '../fassa.jpg';
import type { FormData } from './types';

const steps = [
  { title: 'Personal Information', component: PersonalInfoStep },
  { title: 'Payment Details', component: PaymentDetailsStep },
  { title: 'Upload Receipt', component: ReceiptUploadStep },
  { title: 'Success', component: SuccessStep },
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    matricNumber: '',
    department: '',
    amountPaid: 0,
    paymentOptions: [],
    receipt: null,
  });

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src = {fassa} className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            FASSA Payment Verification
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Faculty of Science Students' Association
          </p>
        </div>

        {currentStep < steps.length - 1 && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.slice(0, -1).map((step, index) => (
                <div
                  key={step.title}
                  className={`flex items-center ${
                    index < steps.length - 2 ? 'flex-1' : ''
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      index <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 2 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {steps.slice(0, -1).map((step, index) => (
                <div
                  key={step.title}
                  className={`text-xs font-medium ${
                    index <= currentStep ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <CurrentStepComponent
            onNext={handleNext}
            onPrevious={handlePrevious}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      </div>
    </div>
  );
}

export default App;