export type Transaction = {
  id: number;
  description: string;
  due_date: string;
  payment_date?: string;
  supplier: string;
  status: string;
  category: string;
  payment_method?: string;
  unit: string;
  amount: number;
  type: "entrada" | "saida";
  created_at?: string;
  updated_at?: string;
  actual_amount?: number | null;  // Added this property
  barcode?: string | null;        // Added this property
  invoice_number?: string | null; // Added this property
};

export type TransactionFormValues = {
  description: string;
  dueDate: string;
  paymentDate?: string;
  supplier: string;
  status: string;
  category: string;
  paymentMethod?: string;
  unit: string;
  amount: number;
  type: "entrada" | "saida";
  actualAmount?: number;
  barcode?: string;
  invoiceNumber?: string;
};