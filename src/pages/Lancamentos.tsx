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
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      description: "Pagamento Cliente A",
      dueDate: "2024-03-20",
      paymentDate: "2024-03-20",
      supplier: "Cliente A",
      status: "Pago",
      category: "Vendas",
      paymentMethod: "PIX",
      unit: "Vila Velha",
      amount: 1500,
      type: "entrada",
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (data: TransactionFormValues) => {
    const newTransaction = {
      ...data,
      id: transactions.length + 1,
    };
    setTransactions([...transactions, newTransaction]);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lançamentos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Lançamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Lançamento</DialogTitle>
            </DialogHeader>
            <TransactionForm onSubmit={handleSubmit} onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <TransactionList transactions={transactions} />
      </Card>
    </div>
  );
};

export default Lancamentos;