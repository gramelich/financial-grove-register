import { Card } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, Clock } from "lucide-react";
import { Transaction } from "@/types/transaction";

interface DashboardSummaryProps {
  transactions: Transaction[];
}

export const DashboardSummary = ({ transactions }: DashboardSummaryProps) => {
  const summary = {
    income: transactions.filter(t => t.type === "entrada").reduce((acc, t) => acc + t.amount, 0),
    expenses: transactions.filter(t => t.type === "saida").reduce((acc, t) => acc + t.amount, 0),
    pending: transactions.filter(t => t.status === "pendente").reduce((acc, t) => acc + t.amount, 0),
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <ArrowUpCircle className="h-8 w-8 text-secondary" />
          <div>
            <p className="text-sm text-gray-500">Entradas</p>
            <p className="text-2xl font-bold">
              R$ {summary.income.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <ArrowDownCircle className="h-8 w-8 text-destructive" />
          <div>
            <p className="text-sm text-gray-500">Saídas</p>
            <p className="text-2xl font-bold">
              R$ {summary.expenses.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Clock className="h-8 w-8 text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">A Pagar</p>
            <p className="text-2xl font-bold">
              R$ {summary.pending.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};