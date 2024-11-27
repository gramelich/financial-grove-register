import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Control } from "react-hook-form";
import { SettingsFormValues } from "./SettingsForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TelegramSettingsProps {
  control: Control<SettingsFormValues>;
}

export const TelegramSettings = ({ control }: TelegramSettingsProps) => {
  const handleTestNotification = async () => {
    try {
      const { data: settings } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['telegram_bot_token', 'telegram_chat_id', 'telegram_message_template']);

      if (!settings) {
        toast.error('Configurações não encontradas');
        return;
      }

      const response = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botToken: settings.find(s => s.key === 'telegram_bot_token')?.value,
          chatId: settings.find(s => s.key === 'telegram_chat_id')?.value,
          message: settings.find(s => s.key === 'telegram_message_template')?.value || 'Teste de notificação',
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar notificação');
      }

      toast.success('Notificação de teste enviada com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar notificação de teste');
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="telegram_bot_token"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Token do Bot</FormLabel>
            <FormControl>
              <Input type="password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="telegram_chat_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chat ID</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="telegram_message_template"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Modelo de Mensagem</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" onClick={handleTestNotification}>
        Testar Notificação
      </Button>
    </div>
  );
};