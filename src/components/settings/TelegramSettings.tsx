import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Control, useWatch } from "react-hook-form";
import { SettingsFormValues } from "./SettingsForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { MessageTemplateVariables } from "./telegram/MessageTemplateVariables";
import { NotificationTester } from "./telegram/NotificationTester";

interface TelegramSettingsProps {
  control: Control<SettingsFormValues>;
}

export const TelegramSettings = ({ control }: TelegramSettingsProps) => {
  const currentMessageTemplate = useWatch({
    control,
    name: "telegram_message_template",
  });

  const handleSaveSettings = async () => {
    try {
      const { error } = await supabase
        .from("settings")
        .upsert([
          { key: "telegram_bot_token", value: currentMessageTemplate },
          { key: "telegram_chat_id", value: currentMessageTemplate },
          { key: "telegram_message_template", value: currentMessageTemplate },
        ], { onConflict: 'key' });

      if (error) throw error;
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
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
              <Textarea
                {...field}
                placeholder="👋 Olá, o boleto do fornecedor: *{supplier}*&#10;&#10;💰 Valor previsto: *{amount}*&#10;&#10;⚠️ *Vence hoje! - {dueDate}* ⚠️&#10;&#10;Despesa da unidade: *{unit}*"
                className="min-h-[200px] font-mono"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <MessageTemplateVariables />

      <div className="flex space-x-4">
        <Button type="button" onClick={handleSaveSettings}>
          Salvar Configurações
        </Button>
        <NotificationTester currentMessageTemplate={currentMessageTemplate} />
      </div>
    </div>
  );
};