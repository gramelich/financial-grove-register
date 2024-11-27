import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { SettingsFormValues } from "./SettingsForm";

interface SupabaseSettingsProps {
  control: Control<SettingsFormValues>;
}

export const SupabaseSettings = ({ control }: SupabaseSettingsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="supabase_api_key"
        render={({ field }) => (
          <FormItem>
            <FormLabel>API Key</FormLabel>
            <FormControl>
              <Input type="password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="supabase_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL do Projeto</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};