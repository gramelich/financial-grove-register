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
import { TransactionFilters } from "@/components/transactions/TransactionFilters";

// Separate the mutation logic
const useTransactionMutations = (queryClient: any, setIsDialogOpen: (open: boolean) => void) => {
  const createMutation = useMutation({
    mutationFn: async (data: TransactionFormValues) => {
      const { error } = await supabase
        .from('transactions')
        .insert([{
          description: data.description,
          due_date: data.dueDate,
          payment_date: data.paymentDate || null,
          supplier: data.supplier,
          status: data.status,
          category: data.category,
          payment_method: data.paymentMethod || null,
          unit: data.unit,
          amount: data.amount,
          actual_amount: data.actualAmount || null,
          type: data.type,
          barcode: data.barcode || null,
          invoice_number: data.invoiceNumber || null,
        }]);
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
    mutationFn: async (data: TransactionFormValues & { id?: number }) => {
      if (!data.id) return;

      const { error } = await supabase
        .from('transactions')
        .update({
          description: data.description,
          due_date: data.dueDate,
          payment_date: data.paymentDate || null,
          supplier: data.supplier,
          status: data.status,
          category: data.category,
          payment_method: data.paymentMethod || null,
          unit: data.unit,
          amount: data.amount,
          actual_amount: data.actualAmount || null,
          type: data.type,
          barcode: data.barcode || null,
          invoice_number: data.invoiceNumber || null,
        })
        .eq('id', data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Lançamento atualizado com sucesso!');
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error('Erro ao atualizar lançamento');
    },
  });

  return { createMutation, updateMutation };
};

const Lancamentos = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "all",
    status: "all",
    category: "all",
  });
  const [showResults, setShowResults] = useState(false);
  const queryClient = useQueryClient();
  
  const { createMutation, updateMutation } = useTransactionMutations(queryClient, setIsDialogOpen);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', filters, showResults],
    queryFn: async () => {
      if (!showResults) return [];
      
      let query = supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.startDate) {
        query = query.gte('due_date', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('due_date', filters.endDate);
      }
      if (filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: showResults,
  });

  const handleSubmit = async (data: TransactionFormValues) => {
    if (selectedTransaction) {
      await updateMutation.mutateAsync({ ...data, id: selectedTransaction.id });
    } else {
      await createMutation.mutateAsync(data);
      setIsDialogOpen(false);
    }
    setSelectedTransaction(null);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleSearch = () => {
    setShowResults(true);
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
              initialData={selectedTransaction ? {
                description: selectedTransaction.description,
                dueDate: selectedTransaction.due_date,
                paymentDate: selectedTransaction.payment_date || "",
                supplier: selectedTransaction.supplier,
                status: selectedTransaction.status,
                category: selectedTransaction.category,
                paymentMethod: selectedTransaction.payment_method || "",
                unit: selectedTransaction.unit,
                amount: selectedTransaction.amount,
                actualAmount: selectedTransaction.actual_amount || 0,
                type: selectedTransaction.type,
                barcode: selectedTransaction.barcode || "",
                invoiceNumber: selectedTransaction.invoice_number || "",
              } : undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <TransactionFilters 
          filters={filters} 
          onFilterChange={setFilters}
          onSearch={handleSearch}
        />
      </Card>

      {showResults && (
        <Card>
          <TransactionList 
            transactions={transactions} 
            onEdit={handleEdit}
          />
        </Card>
      )}
    </div>
  );
};

export default Lancamentos;