import { Card } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@/types/transaction";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState } from "react";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { toast } from "@/components/ui/use-toast";

const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

const Dashboard = () => {
  const { session } = useSessionContext();
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
    status: "",
    category: "",
  });

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', filters, session?.user.id],
    queryFn: async () => {
      try {
        if (!session?.user.id) {
          throw new Error('No user session');
        }

        // First get the user's tenant
        const { data: tenantUser, error: tenantError } = await supabase
          .from('tenant_users')
          .select('tenant_id')
          .eq('user_id', session.user.id)
          .single();

        if (tenantError) {
          console.error('Error fetching tenant:', tenantError);
          throw tenantError;
        }

        if (!tenantUser?.tenant_id) {
          throw new Error('No tenant found for user');
        }

        // Then query transactions for that tenant
        let query = supabase
          .from('transactions')
          .select('*')
          .eq('tenant_id', tenantUser.tenant_id)
          .order('created_at', { ascending: false });

        if (filters.startDate) {
          query = query.gte('due_date', filters.startDate);
        }
        if (filters.endDate) {
          query = query.lte('due_date', filters.endDate);
        }
        if (filters.type && filters.type !== 'all') {
          query = query.eq('type', filters.type);
        }
        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        }
        if (filters.category && filters.category !== 'all') {
          query = query.eq('category', filters.category);
        }

        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching transactions:', error);
          throw error;
        }

        return data as Transaction[];
      } catch (error) {
        console.error('Error in query:', error);
        toast({
          title: "Error",
          description: "Failed to load transactions. Please try again.",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!session?.user.id
  });

  const summary = {
    income: transactions.filter(t => t.type === "entrada").reduce((acc, t) => acc + t.amount, 0),
    expenses: transactions.filter(t => t.type === "saida").reduce((acc, t) => acc + t.amount, 0),
    pending: transactions.filter(t => t.status === "pendente").reduce((acc, t) => acc + t.amount, 0),
  };

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

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <Card className="p-6">
        <TransactionFilters 
          filters={filters} 
          onFilterChange={setFilters}
          onSearch={() => {}} // Atualiza automaticamente
        />
      </Card>

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
    </div>
  );
};

export default Dashboard;