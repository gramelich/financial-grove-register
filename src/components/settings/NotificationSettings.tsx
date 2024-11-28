import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control, useForm, Controller } from "react-hook-form";
import { SettingsFormValues } from "./SettingsForm";
import { Checkbox } from "@/components/ui/checkbox";

interface NotificationSettingsProps {
  control: Control<SettingsFormValues>;
}

export const NotificationSettings = ({ control }: NotificationSettingsProps) => {
  const daysOfWeek = [
    { label: 'Domingo', value: '0' },
    { label: 'Segunda', value: '1' },
    { label: 'Terça', value: '2' },
    { label: 'Quarta', value: '3' },
    { label: 'Quinta', value: '4' },
    { label: 'Sexta', value: '5' },
    { label: 'Sábado', value: '6' },
  ];

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="notification_schedule"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Horário do Disparo</FormLabel>
            <FormControl>
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="notification_status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status para Notificação</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="atrasado">Atrasado</SelectItem>
                <SelectItem value="todos">Todos</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="notification_days"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dias da Semana</FormLabel>
            <div className="grid grid-cols-2 gap-2">
              {daysOfWeek.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day.value}`}
                    checked={field.value?.includes(day.value)}
                    onCheckedChange={(checked) => {
                      const currentValue = field.value ? [...field.value] : [];
                      if (checked) {
                        field.onChange([...currentValue, day.value]);
                      } else {
                        field.onChange(currentValue.filter((v) => v !== day.value));
                      }
                    }}
                  />
                  <label htmlFor={`day-${day.value}`}>{day.label}</label>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
