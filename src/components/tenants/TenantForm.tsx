import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useQueryClient } from "@tanstack/react-query";

const tenantFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  slug: z.string().min(2, "Slug deve ter pelo menos 2 caracteres")
    .regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
});

type TenantFormValues = z.infer<typeof tenantFormSchema>;

interface TenantFormProps {
  onSuccess?: () => void;
}

export function TenantForm({ onSuccess }: TenantFormProps) {
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const queryClient = useQueryClient();
  
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      name: "",
      slug: "",
    }
  });

  const onSubmit = async (values: TenantFormValues) => {
    try {
      if (!session?.user) {
        toast.error("Usuário não autenticado");
        return;
      }

      // Start a transaction using RPC to ensure both operations succeed or fail together
      const { data: tenantData, error: tenantError } = await supabase.rpc('create_tenant_with_user', {
        p_name: values.name,
        p_slug: values.slug,
        p_user_id: session.user.id
      });

      if (tenantError) {
        if (tenantError.code === '23505') { // Unique violation
          toast.error("Este slug já está em uso. Por favor, escolha outro.");
          return;
        }
        throw tenantError;
      }

      toast.success("Inquilino cadastrado com sucesso!");
      form.reset();
      
      // Invalidate the tenants query to trigger a refetch
      await queryClient.invalidateQueries({ queryKey: ['tenants'] });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/");
      }
    } catch (error: any) {
      console.error('Erro ao criar inquilino:', error);
      toast.error(error.message || "Erro ao cadastrar inquilino");
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    form.setValue('slug', value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Inquilino</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Minha Empresa" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug (identificador único)</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="ex: minha-empresa"
                  onChange={handleSlugChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Cadastrar Inquilino
        </Button>
      </form>
    </Form>
  );
}