import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { TransactionFormValues } from "../TransactionForm";

interface DateFieldsProps {
  control: Control<TransactionFormValues>;
}

export const DateFields = ({ control }: DateFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="dueDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Vencimento</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="paymentDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Pagamento (Opcional)</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};