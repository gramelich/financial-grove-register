import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const tenantFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  slug: z.string().min(2, "Slug deve ter pelo menos 2 caracteres")
    .regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
});

type TenantFormValues = z.infer<typeof tenantFormSchema>;

export function TenantForm() {
  const navigate = useNavigate();
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      name: "",
      slug: "",
    }
  });

  const onSubmit = async (values: TenantFormValues) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não encontrado");

      // Insert new tenant
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .insert({
          name: values.name,
          slug: values.slug,
        })
        .select()
        .single();

      if (tenantError) throw tenantError;

      // Associate user with tenant
      const { error: userError } = await supabase
        .from('tenant_users')
        .insert({
          tenant_id: tenantData.id,
          user_id: user.id,
          role: 'admin'
        });

      if (userError) throw userError;

      toast.success("Inquilino cadastrado com sucesso!");
      navigate("/");
    } catch (error: any) {
      console.error('Erro ao criar inquilino:', error);
      toast.error(error.message || "Erro ao cadastrar inquilino");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Building2 className="h-6 w-6" />
          <h1>Novo Inquilino</h1>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Inquilino</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Input {...field} placeholder="exemplo-empresa" />
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