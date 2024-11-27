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

const Lancamentos = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleSubmit = (data: TransactionFormValues) => {
    if (selectedTransaction) {
      // Atualizar transação existente
      const updatedTransactions = transactions.map((t) =>
        t.id === selectedTransaction.id
          ? { ...selectedTransaction, ...data }
          : t
      );
      setTransactions(updatedTransactions);
    } else {
      // Criar nova transação com todos os campos obrigatórios
      const newTransaction: Transaction = {
        id: transactions.length + 1,
        description: data.description,
        dueDate: data.dueDate,
        paymentDate: data.paymentDate,
        supplier: data.supplier,
        status: data.status,
        category: data.category,
        paymentMethod: data.paymentMethod || "",
        unit: data.unit,
        amount: data.amount,
        type: data.type,
      };
      setTransactions([...transactions, newTransaction]);
    }
    setIsDialogOpen(false);
    setSelectedTransaction(null);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

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