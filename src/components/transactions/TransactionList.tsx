import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/types/transaction";

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>{transaction.dueDate}</TableCell>
            <TableCell>{transaction.paymentDate}</TableCell>
            <TableCell>{transaction.supplier}</TableCell>
            <TableCell>{transaction.status}</TableCell>
            <TableCell>{transaction.category}</TableCell>
            <TableCell>{transaction.paymentMethod}</TableCell>
            <TableCell>{transaction.unit}</TableCell>
            <TableCell className={transaction.type === "entrada" ? "text-secondary" : "text-destructive"}>
              R$ {transaction.amount.toLocaleString('pt-BR')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};