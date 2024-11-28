import { CategoryForm } from "@/components/categories/CategoryForm";
import { Card } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type CategoryFormData = {
  name: string;
  description?: string;
};

export const CategoryTab = () => {
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const createCategory = useMutation({
    mutationFn: async (values: CategoryFormData) => {
      const { error } = await supabase
        .from('categories')
        .insert([values]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoria criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar categoria');
    },
  });

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Adicionar Nova Categoria</h3>
        <CategoryForm 
          onSubmit={(values: CategoryFormData) => createCategory.mutate(values)}
          submitLabel="Criar Categoria"
        />

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Categorias Existentes</h3>
          <div className="space-y-4">
            {categories?.map((category) => (
              <div key={category.id} className="flex justify-between items-center p-4 border rounded">
                <div>
                  <h4 className="font-medium">{category.name}</h4>
                  {category.description && (
                    <p className="text-sm text-gray-500">{category.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};