import { Card } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardChartsProps {
  transactions: Transaction[];
}

const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

export const DashboardCharts = ({ transactions }: DashboardChartsProps) => {
  const categoryData = Object.entries(
    transactions.reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) acc[category] = 0;
      acc[category] += transaction.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const monthlyData = Object.entries(
    transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.due_date).toLocaleString('pt-BR', { month: 'short' });
      if (!acc[month]) acc[month] = { income: 0, expenses: 0 };
      if (transaction.type === "entrada") {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expenses += transaction.amount;
      }
      return acc;
    }, {} as Record<string, { income: number; expenses: number }>)
  ).map(([month, data]) => ({
    month,
    ...data,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Fluxo de Caixa Mensal</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
              <Legend />
              <Bar dataKey="income" name="Entradas" fill="#10B981" />
              <Bar dataKey="expenses" name="Saídas" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Distribuição por Categoria</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: R$ ${value.toLocaleString('pt-BR')}`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};