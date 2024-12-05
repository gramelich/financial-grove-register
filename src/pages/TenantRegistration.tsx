import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TenantForm } from "@/components/tenants/TenantForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export default function TenantRegistration() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: tenants, isLoading, error } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tenants:', error);
        throw error;
      }
      return data as Tenant[];
    }
  });

  const handleTenantCreated = () => {
    setDialogOpen(false);
  };

  if (error) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-destructive">Erro ao carregar inquilinos. Por favor, tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Inquilinos
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Inquilino
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Inquilino</DialogTitle>
              </DialogHeader>
              <TenantForm onSuccess={handleTenantCreated} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Carregando inquilinos...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Data de Criação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants && tenants.length > 0 ? (
                    tenants.map((tenant) => (
                      <TableRow key={tenant.id}>
                        <TableCell>{tenant.name}</TableCell>
                        <TableCell>{tenant.slug}</TableCell>
                        <TableCell>
                          {new Date(tenant.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                        Nenhum inquilino encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}