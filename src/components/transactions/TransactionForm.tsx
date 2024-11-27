import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { TransactionFormFields } from "./TransactionFormFields";

const transactionSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  dueDate: z.string().min(1, "Data de vencimento é obrigatória"),
  paymentDate: z.string().optional(),
  supplier: z.string().min(1, "Fornecedor é obrigatório"),
  status: z.string().min(1, "Status é obrigatório"),
  category: z.string().min(1, "Plano de contas é obrigatório"),
  paymentMethod: z.string().min(1, "Forma de pagamento é obrigatória"),
  unit: z.string().min(1, "Unidade é obrigatória"),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  type: z.enum(["entrada", "saida"]),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSubmit: (data: TransactionFormValues) => void;
  onClose: () => void;
}

export const TransactionForm = ({ onSubmit, onClose }: TransactionFormProps) => {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      dueDate: "",
      paymentDate: "",
      supplier: "",
      status: "",
      category: "",
      paymentMethod: "",
      unit: "",
      amount: 0,
      type: "entrada",
    },
  });

  const handleSubmit = (data: TransactionFormValues) => {
    onSubmit(data);
    form.reset();
    onClose();
    toast.success("Lançamento criado com sucesso!");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <TransactionFormFields control={form.control} />
        <Button type="submit" className="w-full">Salvar Lançamento</Button>
      </form>
    </Form>
  );
};