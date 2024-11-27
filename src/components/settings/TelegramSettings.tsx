import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Control } from "react-hook-form";
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

      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .limit(3);

      if (!transactions || transactions.length === 0) {
        toast.error('Nenhum lançamento encontrado para teste');
        return;
      }

      let messageTemplate = settings.find(s => s.key === 'telegram_message_template')?.value || 'Teste de notificação';
      
      const totalAmount = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
      const count = transactions.length;

      messageTemplate = messageTemplate
        .replace(/{totalAmount}/g, totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
        .replace(/{count}/g, count.toString());

      let transactionsText = '';
      transactions.forEach((transaction, index) => {
        let transactionTemplate = messageTemplate;
        Object.entries(transaction).forEach(([key, value]) => {
          if (typeof value === 'string' || typeof value === 'number') {
            const regex = new RegExp(`{${key}}`, 'g');
            const formattedValue = key === 'amount' 
              ? Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              : value.toString();
            transactionTemplate = transactionTemplate.replace(regex, formattedValue);
          }
        });
        transactionsText += `${transactionTemplate}\n\n`;
        if (transaction.barcode) {
          transactionsText += `Código de barras/PIX:\n${transaction.barcode}\n\n`;
        }
      });

      const { error } = await supabase.functions.invoke('telegram-test', {
        body: {
          botToken: settings.find(s => s.key === 'telegram_bot_token')?.value,
          chatId: settings.find(s => s.key === 'telegram_chat_id')?.value,
          message: transactionsText.trim(),
        },
      });

      if (error) throw error;

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