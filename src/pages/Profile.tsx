import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

const Profile = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <User className="h-6 w-6" />
        Meu Perfil
      </h1>
      
      <Card className="p-6">
        <p className="text-muted-foreground">
          Página em construção. Em breve você poderá editar seus dados pessoais aqui.
        </p>
      </Card>
    </div>
  );
};

export default Profile;