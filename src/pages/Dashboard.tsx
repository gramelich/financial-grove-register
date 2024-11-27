import { Card } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, Clock } from "lucide-react";

const Dashboard = () => {
  // Temporary mock data
  const summary = {
    income: 15000,
    expenses: 8500,
    pending: 3200,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
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
    </div>
  );
};

export default Dashboard;