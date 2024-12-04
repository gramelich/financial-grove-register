import { TenantForm } from "@/components/tenants/TenantForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function TenantRegistration() {
  return (
    <div className="container max-w-lg mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Cadastro de Inquilino
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TenantForm />
        </CardContent>
      </Card>
    </div>
  );
}