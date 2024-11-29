import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NotificationTesterProps {
  currentMessageTemplate: string | undefined;
}

export const NotificationTester = ({ currentMessageTemplate }: NotificationTesterProps) => {
  const handleTestNotification = async () => {
    try {
      const { data: settings } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", ["telegram_bot_token", "telegram_chat_id", "telegram_message_template"]);

      if (!settings) {
        toast.error("Configurações não encontradas");
        return;
      }

      const { data: transactions } = await supabase.from("transactions").select("*").limit(3);

      if (!transactions || transactions.length === 0) {
        toast.error("Nenhum lançamento encontrado para teste");
        return;
      }

      const botToken = settings.find((s) => s.key === "telegram_bot_token")?.value;
      const chatId = settings.find((s) => s.key === "telegram_chat_id")?.value;

      if (!botToken || !chatId) {
        toast.error("Token do bot ou Chat ID não configurados.");
        return;
      }

      const messageTemplate =
        currentMessageTemplate || 
        settings.find((s) => s.key === "telegram_message_template")?.value || 
        "Teste de notificação";

      for (const transaction of transactions) {
        let transactionTemplate = messageTemplate;
        Object.entries(transaction).forEach(([key, value]) => {
          if (typeof value === "string" || typeof value === "number") {
            const regex = new RegExp(`{${key}}`, "g");
            const formattedValue =
              key === "amount" || key === "actual_amount"
                ? Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                : value.toString();
            transactionTemplate = transactionTemplate.replace(regex, formattedValue);
          }
        });

        await supabase.functions.invoke("telegram-test", {
          body: {
            botToken,
            chatId,
            message: transactionTemplate.trim(),
          },
        });

        if (transaction.barcode) {
          await supabase.functions.invoke("telegram-test", {
            body: {
              botToken,
              chatId,
              message: `Código de barras/PIX:\n${transaction.barcode}`,
            },
          });
        }
      }

      toast.success("Notificações de teste enviadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar notificações de teste");
      console.error(error);
    }
  };

  return (
    <Button type="button" onClick={handleTestNotification}>
      Testar Notificação
    </Button>
  );
};