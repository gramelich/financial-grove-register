import PaymentMethodForm, { PaymentMethodFormData } from "@/components/payment-methods/PaymentMethodForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export const PaymentMethodTab = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: paymentMethods, isLoading } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const createPaymentMethod = useMutation({
    mutationFn: async (values: PaymentMethodFormData) => {
      const { error } = await supabase.from("payment_methods").insert([
        {
          name: values.name,
          description: values.description || null,
        },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      setIsDialogOpen(false);
      toast.success("Forma de pagamento criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar forma de pagamento: ${error.message}`);
    },
  });

  const updatePaymentMethod = useMutation({
    mutationFn: async (values: PaymentMethodFormData) => {
      const { error } = await supabase
        .from("payment_methods")
        .update({
          name: values.name,
          description: values.description || null,
        })
        .eq("id", selectedMethod.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      setIsDialogOpen(false);
      setSelectedMethod(null);
      toast.success("Forma de pagamento atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar forma de pagamento: ${error.message}`);
    },
  });

  const deletePaymentMethod = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("payment_methods").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Forma de pagamento excluída com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir forma de pagamento: ${error.message}`);
    },
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Formas de Pagamento</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setSelectedMethod(null);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Nova Forma de Pagamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedMethod ? "Editar" : "Nova"} Forma de Pagamento
              </DialogTitle>
            </DialogHeader>
            <PaymentMethodForm
              defaultValues={selectedMethod}
              onSubmit={(values) => {
                if (selectedMethod) {
                  updatePaymentMethod.mutate(values);
                } else {
                  createPaymentMethod.mutate(values);
                }
              }}
              submitLabel={selectedMethod ? "Atualizar" : "Criar"}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {paymentMethods?.map((method) => (
            <div
              key={method.id}
              className="flex justify-between items-center p-4 border rounded"
            >
              <div>
                <h3 className="font-medium">{method.name}</h3>
                {method.description && (
                  <p className="text-sm text-gray-500">{method.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedMethod(method);
                    setIsDialogOpen(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => deletePaymentMethod.mutate(method.id)}
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};