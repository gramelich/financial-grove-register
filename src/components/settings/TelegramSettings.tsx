import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Control, useWatch } from "react-hook-form";
import { SettingsFormValues } from "./SettingsForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

interface TelegramSettingsProps {
  control: Control<SettingsFormValues>;
}

const availableVariables = [
  { name: "description", description: "Descrição do lançamento" },
  { name: "supplier", description: "Nome do fornecedor" },
  { name: "amount", description: "Valor do lançamento" },
  { name: "dueDate", description: "Data de vencimento" },
  { name: "paymentDate", description: "Data de pagamento" },
  { name: "status", description: "Status do lançamento" },
  { name: "category", description: "Plano de contas" },
  { name: "paymentMethod", description: "Forma de pagamento" },
  { name: "unit", description: "Unidade" },
  { name: "type", description: "Tipo (entrada/saída)" },
  { name: "totalAmount", description: "Valor total dos lançamentos" },
  { name: "count", description: "Quantidade de lançamentos" },
  { name: "barcode", description: "Código de barras" },
  { name: "invoiceNumber", description: "Número da nota fiscal" },
];

export const TelegramSettings = ({ control }: TelegramSettingsProps) => {
  // Monitora o valor atual do campo "telegram_message_template"
  const currentMessageTemplate = useWatch({
    control,
    name: "telegram_message_template",
  });

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

      // Prioriza o valor atual do campo do formulário
      const messageTemplate =
        currentMessageTemplate || settings.find((s) => s.key === "telegram_message_template")?.value || "Teste de notificação";

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

        // Envia a mensagem principal
        await supabase.functions.invoke("telegram-test", {
          body: {
            botToken,
            chatId,
            message: transactionTemplate.trim(),
          },
        });

        // Envia o código de barras, se houver
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

      <Alert>
        <AlertDescription>
          <p className="mb-2">Variáveis disponíveis para o modelo de mensagem:</p>
          <ScrollArea className="h-32 rounded-md border p-2">
            <div className="space-y-2">
              {availableVariables.map((variable) => (
                <div key={variable.name} className="text-sm">
                  <code className="bg-muted px-1 py-0.5 rounded">{`{${variable.name}}`}</code>
                  <span className="ml-2 text-muted-foreground">{variable.description}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </AlertDescription>
      </Alert>

      <Button type="button" onClick={handleTestNotification}>
        Testar Notificação
      </Button>
    </div>
  );
};
