import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PaymentMethodForm } from "@/components/payment-methods/PaymentMethodForm";

const FormasDePagamento = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const queryClient = useQueryClient();

  // Busca de métodos de pagamento
  const { data: paymentMethods, isLoading } = useQuery({
    queryKey: ['payment_methods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Criação de método de pagamento
  const createMutation = useMutation({
    mutationFn: async (values: { name: string; description?: string }) => {
      const { error } = await supabase
        .from('payment_methods')
        .insert([values]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment_methods'] });
      setIsDialogOpen(false);
      toast.success('Forma de pagamento criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar forma de pagamento');
    },
  });

  // Atualização de método de pagamento
  const updateMutation = useMutation({
    mutationFn: async (values: { name: string; description?: string }) => {
      const { error } = await supabase
        .from('payment_methods')
        .update(values)
        .eq('id', selectedMethod.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment_methods'] });
      setIsDialogOpen(false);
      setSelectedMethod(null);
      toast.success('Forma de pagamento atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar forma de pagamento');
    },
  });

  // Lidar com envio do formulário
  const handleSubmit = (values: { name: string; description?: string }) => {
    if (selectedMethod) {
      updateMutation.mutate(values); // Atualizar
    } else {
      createMutation.mutate(values); // Criar
    }
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Formas de Pagamento</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedMethod(null);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Nova Forma de Pagamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedMethod ? 'Editar' : 'Nova'} Forma de Pagamento
              </DialogTitle>
            </DialogHeader>
            <PaymentMethodForm
              defaultValues={selectedMethod}
              onSubmit={handleSubmit}
              submitLabel={selectedMethod ? 'Atualizar' : 'Criar'}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {paymentMethods?.map((method) => (
            <div key={method.id} className="flex justify-between items-center p-4 border rounded">
              <div>
                <h3 className="font-medium">{method.name}</h3>
                {method.description && (
                  <p className="text-sm text-gray-500">{method.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => {
                  setSelectedMethod(method);
                  setIsDialogOpen(true);
                }}>
                  Editar
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => deleteMutation.mutate(method.id)}
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

export default FormasDePagamento;
