import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Configuracoes = () => {
  const [novaForma, setNovaForma] = useState("");
  const [formasRecebimento, setFormasRecebimento] = useState<string[]>([]);

  const adicionarFormaRecebimento = () => {
    if (!novaForma.trim()) {
      toast.error("Digite uma forma de recebimento");
      return;
    }
    setFormasRecebimento([...formasRecebimento, novaForma]);
    setNovaForma("");
    toast.success("Forma de recebimento adicionada");
  };

  const removerFormaRecebimento = (index: number) => {
    const novasFormas = formasRecebimento.filter((_, i) => i !== index);
    setFormasRecebimento(novasFormas);
    toast.success("Forma de recebimento removida");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <Tabs defaultValue="supabase" className="space-y-4">
        <TabsList>
          <TabsTrigger value="supabase">Supabase</TabsTrigger>
          <TabsTrigger value="telegram">Telegram</TabsTrigger>
          <TabsTrigger value="disparo">Disparo</TabsTrigger>
          <TabsTrigger value="planos">Planos de Contas</TabsTrigger>
          <TabsTrigger value="formas">Formas de Recebimento</TabsTrigger>
        </TabsList>

        <TabsContent value="supabase">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apikey">API Key</Label>
              <Input id="apikey" placeholder="Sua Supabase API Key" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL do Projeto</Label>
              <Input id="url" placeholder="URL do seu projeto Supabase" />
            </div>
            <Button>Salvar Configurações</Button>
          </Card>
        </TabsContent>

        <TabsContent value="telegram">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Token do Bot</Label>
              <Input id="token" placeholder="Token do seu bot Telegram" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chatid">Chat ID</Label>
              <Input id="chatid" placeholder="ID do chat" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Modelo de Mensagem</Label>
              <Input id="message" placeholder="Configure sua mensagem" />
            </div>
            <Button>Salvar Configurações</Button>
          </Card>
        </TabsContent>

        <TabsContent value="disparo">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schedule">Agendamento</Label>
              <Input id="schedule" type="time" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conditions">Condições</Label>
              <Input id="conditions" placeholder="Configure as condições de disparo" />
            </div>
            <Button>Testar Disparo</Button>
          </Card>
        </TabsContent>

        <TabsContent value="planos">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Planos de Contas</Label>
              {/* Implementar lista de planos de contas */}
            </div>
            <Button>Adicionar Plano</Button>
          </Card>
        </TabsContent>

        <TabsContent value="formas">
          <Card className="p-6 space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="forma">Nova Forma de Recebimento</Label>
                <Input
                  id="forma"
                  placeholder="Digite a forma de recebimento"
                  value={novaForma}
                  onChange={(e) => setNovaForma(e.target.value)}
                />
              </div>
              <Button
                className="mt-6"
                onClick={adicionarFormaRecebimento}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Forma de Recebimento</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formasRecebimento.map((forma, index) => (
                  <TableRow key={index}>
                    <TableCell>{forma}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removerFormaRecebimento(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;