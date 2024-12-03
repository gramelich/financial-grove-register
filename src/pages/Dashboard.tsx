import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@/types/transaction";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { toast } from "@/components/ui/use-toast";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

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
        const { data: tenantUsers, error: tenantError } = await supabase
          .from('tenant_users')
          .select('tenant_id')
          .eq('user_id', session.user.id)
          .maybeSingle(); // Using maybeSingle() instead of single()

        if (tenantError) {
          console.error('Error fetching tenant:', tenantError);
          throw tenantError;
        }

        if (!tenantUsers) {
          toast({
            title: "No Access",
            description: "You are not associated with any tenant. Please contact your administrator.",
            variant: "destructive",
          });
          return [];
        }

        const tenantId = tenantUsers.tenant_id;

        // Then query transactions for that tenant
        let query = supabase
          .from('transactions')
          .select('*')
          .eq('tenant_id', tenantId)
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

      <DashboardSummary transactions={transactions} />
      <DashboardCharts transactions={transactions} />
    </div>
  );
};

export default Dashboard;