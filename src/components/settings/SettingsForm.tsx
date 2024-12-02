import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { SupabaseSettings } from "./SupabaseSettings";
import { TelegramSettings } from "./TelegramSettings";
import { NotificationSettings } from "./NotificationSettings";
import { CategoryTab } from "./tabs/CategoryTab";
import { PaymentMethodTab } from "./tabs/PaymentMethodTab";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSessionContext } from '@supabase/auth-helpers-react';

const settingsFormSchema = z.object({
  supabase_api_key: z.string().optional(),
  supabase_url: z.string().optional(),
  telegram_bot_token: z.string().optional(),
  telegram_chat_id: z.string().optional(),
  telegram_message_template: z.string().optional(),
  notification_schedule: z.string().optional(),
  notification_status: z.string().optional(),
  notification_days: z.array(z.string()).optional(),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export const SettingsForm = () => {
  const { session } = useSessionContext();
  const queryClient = useQueryClient();
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      if (!session) throw new Error('No session');
      
      const { data, error } = await supabase
        .from('settings')
        .select('*');
      
      if (error) throw error;
      return data;
    },
    enabled: !!session
  });

  // Set form values when settings are loaded
  React.useEffect(() => {
    if (settings) {
      const formValues = settings.reduce((acc, setting) => ({
        ...acc,
        [setting.key]: setting.value,
      }), {});
      form.reset(formValues);
    }
  }, [settings, form]);

  const updateSettings = useMutation({
    mutationFn: async (values: SettingsFormValues) => {
      const updates = Object.entries(values).map(([key, value]) => ({
        key,
        value: value?.toString(),
      }));

      const { error } = await supabase
        .from('settings')
        .upsert(updates.map(update => ({
          key: update.key,
          value: update.value,
        })));

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Configurações salvas com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao salvar configurações');
      console.error(error);
    },
  });

  const onSubmit = (values: SettingsFormValues) => {
    updateSettings.mutate(values);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="supabase" className="space-y-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="supabase">Supabase</TabsTrigger>
            <TabsTrigger value="telegram">Telegram</TabsTrigger>
            <TabsTrigger value="disparo">Disparo</TabsTrigger>
            <TabsTrigger value="plano-de-contas">Plano de Contas</TabsTrigger>
            <TabsTrigger value="formas-de-pagamento">Formas de Pagamento</TabsTrigger>
          </TabsList>

          <TabsContent value="supabase">
            <Card className="p-6">
              <SupabaseSettings control={form.control} />
            </Card>
          </TabsContent>

          <TabsContent value="telegram">
            <Card className="p-6">
              <TelegramSettings control={form.control} />
            </Card>
          </TabsContent>

          <TabsContent value="disparo">
            <Card className="p-6">
              <NotificationSettings control={form.control} />
            </Card>
          </TabsContent>

          <TabsContent value="plano-de-contas">
            <CategoryTab />
          </TabsContent>

          <TabsContent value="formas-de-pagamento">
            <PaymentMethodTab />
          </TabsContent>
        </Tabs>

        <Button type="submit">Salvar Configurações</Button>
      </form>
    </Form>
  );
};
