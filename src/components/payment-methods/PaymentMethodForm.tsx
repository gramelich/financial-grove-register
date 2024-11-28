// src/components/payment-methods/PaymentMethodForm.tsx
import React from "react";
import { Button } from "@/components/ui/button"; // Verifique se o Button não está causando problemas
import { useForm } from "react-hook-form";

const PaymentMethodForm = ({ defaultValues, onSubmit, submitLabel }) => {
  const { register, handleSubmit } = useForm({
    defaultValues,
  });

  const handleFormSubmit = (data) => {
    console.log("Form submitted:", data); // Adicionando log para depuração
    onSubmit(data); // Chama a função onSubmit passada como prop
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
      <button type="submit">{submitLabel}</button> {/* Mudei para um botão padrão para depuração */}
    </form>
  );
};

export default PaymentMethodForm;
