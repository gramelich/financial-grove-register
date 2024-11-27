import { Control } from "react-hook-form";
import { TransactionFormValues } from "./TransactionForm";
import { BasicFields } from "./fields/BasicFields";
import { DateFields } from "./fields/DateFields";
import { StatusFields } from "./fields/StatusFields";
import { AmountFields } from "./fields/AmountFields";
import { CategoryFields } from "./fields/CategoryFields";
import { AdditionalFields } from "./fields/AdditionalFields";

interface TransactionFormFieldsProps {
  control: Control<TransactionFormValues>;
}

export const TransactionFormFields = ({ control }: TransactionFormFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <BasicFields control={control} />
      <DateFields control={control} />
      <StatusFields control={control} />
      <AmountFields control={control} />
      <CategoryFields control={control} />
      <AdditionalFields control={control} />
    </div>
  );
};