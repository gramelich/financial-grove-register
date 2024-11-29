import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

export const availableVariables = [
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

export const MessageTemplateVariables = () => {
  return (
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
  );
};