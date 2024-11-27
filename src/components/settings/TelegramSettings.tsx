import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Control } from "react-hook-form";
import { SettingsFormValues } from "./SettingsForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

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
];

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

      // Get transactions for testing (simulating multiple transactions on the same day)
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .limit(3);

      if (!transactions || transactions.length === 0) {
        toast.error('Nenhum lançamento encontrado para teste');
        return;
      }

      // Process the message template with the transactions data
      let messageTemplate = settings.find(s => s.key === 'telegram_message_template')?.value || 'Teste de notificação';
      
      // Calculate total amount and count
      const totalAmount = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
      const count = transactions.length;

      // Replace global variables
      messageTemplate = messageTemplate
        .replace(/{totalAmount}/g, totalAmount.toString())
        .replace(/{count}/g, count.toString());

      // Create a list of transactions if there are multiple
      let transactionsText = '';
      transactions.forEach((transaction, index) => {
        let transactionTemplate = messageTemplate;
        Object.entries(transaction).forEach(([key, value]) => {
          if (typeof value === 'string' || typeof value === 'number') {
            const regex = new RegExp(`{${key}}`, 'g');
            transactionTemplate = transactionTemplate.replace(regex, value.toString());
          }
        });
        transactionsText += `${index + 1}. ${transactionTemplate}\n`;
      });

      const { error } = await supabase.functions.invoke('telegram-test', {
        body: {
          botToken: settings.find(s => s.key === 'telegram_bot_token')?.value,
          chatId: settings.find(s => s.key === 'telegram_chat_id')?.value,
          message: count > 1 ? 
            `Você tem ${count} lançamentos:\n\n${transactionsText}` :
            transactionsText.trim(),
        },
      });

      if (error) {
        throw error;
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
              <Input {...field} placeholder="Ex: {description} - R$ {amount}" />
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