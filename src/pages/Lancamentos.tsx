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
import { TransactionForm, TransactionFormValues } from "@/components/transactions/TransactionForm";
import { TransactionList } from "@/components/transactions/TransactionList";
import { Transaction } from "@/types/transaction";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Lancamentos = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Erro ao carregar lançamentos');
        throw error;
      }

      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TransactionFormValues) => {
      const { error } = await supabase
        .from('transactions')
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Lançamento criado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar lançamento');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: TransactionFormValues) => {
      if (!selectedTransaction) return;

      const { error } = await supabase
        .from('transactions')
        .update(data)
        .eq('id', selectedTransaction.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Lançamento atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar lançamento');
    },
  });

  const handleSubmit = async (data: TransactionFormValues) => {
    if (selectedTransaction) {
      await updateMutation.mutateAsync(data);
    } else {
      await createMutation.mutateAsync(data);
    }
    setIsDialogOpen(false);
    setSelectedTransaction(null);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lançamentos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedTransaction(null)}>
              <Plus className="mr-2 h-4 w-4" /> Novo Lançamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedTransaction ? 'Editar' : 'Novo'} Lançamento
              </DialogTitle>
            </DialogHeader>
            <TransactionForm 
              onSubmit={handleSubmit} 
              onClose={() => setIsDialogOpen(false)}
              initialData={selectedTransaction || undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <TransactionList 
          transactions={transactions} 
          onEdit={handleEdit}
        />
      </Card>
    </div>
  );
};

export default Lancamentos;