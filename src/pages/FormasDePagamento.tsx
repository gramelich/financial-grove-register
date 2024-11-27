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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const paymentMethodSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
});

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

const FormasDePagamento = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const queryClient = useQueryClient();

  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
  });

  const { data: paymentMethods, isLoading } = useQuery({
    queryKey: ['payment_methods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: PaymentMethodFormValues) => {
      const { error } = await supabase
        .from('payment_methods')
        .insert([values]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment_methods'] });
      setIsDialogOpen(false);
      form.reset();
      toast.success('Forma de pagamento criada com sucesso!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: PaymentMethodFormValues) => {
      const { error } = await supabase
        .from('payment_methods')
        .update(values)
        .eq('id', selectedMethod.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment_methods'] });
      setIsDialogOpen(false);
      setSelectedMethod(null);
      form.reset();
      toast.success('Forma de pagamento atualizada com sucesso!');
    },
  });

  const onSubmit = (values: PaymentMethodFormValues) => {
    if (selectedMethod) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Formas de Pagamento</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedMethod(null);
              form.reset();
            }}>
              <Plus className="mr-2 h-4 w-4" /> Nova Forma de Pagamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedMethod ? 'Editar' : 'Nova'} Forma de Pagamento
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {selectedMethod ? 'Atualizar' : 'Criar'} Forma de Pagamento
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {paymentMethods?.map((method) => (
            <div key={method.id} className="flex justify-between items-center p-4 border rounded">
              <div>
                <h3 className="font-medium">{method.name}</h3>
                {method.description && (
                  <p className="text-sm text-gray-500">{method.description}</p>
                )}
              </div>
              <Button variant="ghost" onClick={() => {
                setSelectedMethod(method);
                form.reset({
                  name: method.name,
                  description: method.description || '',
                });
                setIsDialogOpen(true);
              }}>
                Editar
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FormasDePagamento;