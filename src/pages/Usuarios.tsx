import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserForm } from "@/components/users/UserForm";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  role: string;
  tenant_name: string;
}

const Usuarios = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery({
    queryKey: ['tenant-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenant_users')
        .select(`
          id,
          role,
          user_id,
          tenants (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Now fetch the emails for these users
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      // Map the data to include email from auth
      return data.map((user) => ({
        id: user.id,
        email: authData.user.email, // We'll only see the current user's email
        role: user.role,
        tenant_name: user.tenants?.name || '',
      }));
    }
  });

  const handleUserCreated = () => {
    setDialogOpen(false);
    toast({
      title: "Sucesso",
      description: "Usuário criado com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Usuários
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Usuário</DialogTitle>
              </DialogHeader>
              <UserForm onSuccess={handleUserCreated} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Carregando usuários...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Papel</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.tenant_name}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                        Nenhum usuário encontrado
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
};

export default Usuarios;