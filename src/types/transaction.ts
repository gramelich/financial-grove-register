export type Transaction = {
  id: number;
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
  created_at?: string;
  updated_at?: string;
};