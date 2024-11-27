import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Configuracoes = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <Tabs defaultValue="supabase" className="space-y-4">
        <TabsList>
          <TabsTrigger value="supabase">Supabase</TabsTrigger>
          <TabsTrigger value="telegram">Telegram</TabsTrigger>
          <TabsTrigger value="disparo">Disparo</TabsTrigger>
          <TabsTrigger value="planos">Planos de Contas</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default Configuracoes;