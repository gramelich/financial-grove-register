// src/components/payment-methods/PaymentMethodForm.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

const PaymentMethodForm = ({ defaultValues, onSubmit, submitLabel }) => {
  const { register, handleSubmit } = useForm({
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
          className="mt-1 p-2 border border-gray-300 rounded"
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
          className="mt-1 p-2 border border-gray-300 rounded"
          placeholder="Digite uma descrição (opcional)"
        />
      </div>
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
};

export default PaymentMethodForm;
