import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/types/transaction";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
}

export const TransactionList = ({ transactions, onEdit }: TransactionListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Descrição</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead>Pagamento</TableHead>
          <TableHead>Fornecedor</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Plano de Contas</TableHead>
          <TableHead>Forma</TableHead>
          <TableHead>Unidade</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>{transaction.due_date}</TableCell>
            <TableCell>{transaction.payment_date}</TableCell>
            <TableCell>{transaction.supplier}</TableCell>
            <TableCell>{transaction.status}</TableCell>
            <TableCell>{transaction.category}</TableCell>
            <TableCell>{transaction.payment_method}</TableCell>
            <TableCell>{transaction.unit}</TableCell>
            <TableCell className={transaction.type === "entrada" ? "text-secondary" : "text-destructive"}>
              R$ {transaction.amount.toLocaleString('pt-BR')}
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" onClick={() => onEdit(transaction)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};