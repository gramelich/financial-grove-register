import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

const Lancamentos = () => {
  // Temporary mock data
  const transactions = [
    {
      id: 1,
      description: "Pagamento Cliente A",
      dueDate: "2024-03-20",
      paymentDate: "2024-03-20",
      supplier: "Cliente A",
      status: "Pago",
      category: "Vendas",
      paymentMethod: "PIX",
      unit: "Vila Velha",
      amount: 1500,
      type: "entrada",
    },
    // Add more mock data as needed
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lançamentos</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Lançamento
        </Button>
      </div>

      <Card>
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
      </Card>
    </div>
  );
};

export default Lancamentos;