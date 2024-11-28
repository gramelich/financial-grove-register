// src/components/settings/tabs/PaymentMethodTab.tsx
import PaymentMethodForm from "@/components/payment-methods/PaymentMethodForm";
import { Card } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type PaymentMethodFormData = {
  name: string;
  description?: string;
};

export const PaymentMethodTab = () => {
  const queryClient = useQueryClient();

  const { data: paymentMethods } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  const createPaymentMethod = useMutation({
    mutationFn: async (values: PaymentMethodFormData) => {
      const { error } = await supabase
        .from('payment_methods')
        .insert([values]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      toast.success('Forma de pagamento criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar forma de pagamento');
    },
  });

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Adicionar Nova Forma de Pagamento</h3>
        <PaymentMethodForm 
          onSubmit={(values: PaymentMethodFormData) => {
            console.log("Submitting:", values); // Log para ver os valores
            createPaymentMethod.mutate(values);
          }}
          submitLabel="Criar Forma de Pagamento"
        />

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Formas de Pagamento Existentes</h3>
          <div className="space-y-4">
            {paymentMethods?.map((method) => (
              <div key={method.id} className="flex justify-between items-center p-4 border rounded">
                <div>
                  <h4 className="font-medium">{method.name}</h4>
                  {method.description && (
                    <p className="text-sm text-gray-500">{method.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
