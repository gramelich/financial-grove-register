import React from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

type PaymentMethodFormData = {
  name: string;
  description?: string;
};

interface PaymentMethodFormProps {
  defaultValues?: Partial<PaymentMethodFormData>;
  onSubmit: (data: PaymentMethodFormData) => void;
  submitLabel: string;
}

const PaymentMethodForm = ({ defaultValues = {}, onSubmit, submitLabel }: PaymentMethodFormProps) => {
  const { register, handleSubmit } = useForm<PaymentMethodFormData>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Nome
        </label>
        <input
          id="name"
          {...register("name", { required: true })}
          className="mt-1 p-2 w-full border border-gray-300 rounded"
          placeholder="Digite o nome da forma de pagamento"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Descrição
        </label>
        <input
          id="description"
          {...register("description")}
          className="mt-1 p-2 w-full border border-gray-300 rounded"
          placeholder="Digite uma descrição (opcional)"
        />
      </div>
      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
};

export default PaymentMethodForm;