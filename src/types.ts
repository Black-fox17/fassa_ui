export interface PaymentOption {
  id: string;
  name: string;
  amount: number;
}

export interface FormData {
  name: string;
  matricNumber: string;
  department: string;
  amountPaid: number;
  paymentOptions: string[];
  receipt: File | null;
}

export interface StepProps {
  onNext: () => void;
  onPrevious: () => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}