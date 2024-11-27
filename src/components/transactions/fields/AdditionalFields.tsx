import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { TransactionFormValues } from "../TransactionForm";

interface AdditionalFieldsProps {
  control: Control<TransactionFormValues>;
}

export const AdditionalFields = ({ control }: AdditionalFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="unit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Unidade</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="vila_velha">Vila Velha</SelectItem>
                <SelectItem value="vitoria">Vitória</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="barcode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Código de Barras</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="invoiceNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número da Nota Fiscal</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};