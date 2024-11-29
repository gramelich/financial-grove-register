import { CategoryForm } from "@/components/categories/CategoryForm";
import { Card } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type CategoryFormData = {
  name: string;
  description?: string;
};

export const CategoryTab = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CategoryFormData | null>(null);

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
      setFormData(null); // Reset form after successful creation
    },
    onError: () => {
      toast.error('Erro ao criar categoria');
    },
  });

  const handleFormSubmit = (values: CategoryFormData) => {
    setFormData(values);
  };

  const handleAddCategory = () => {
    if (formData) {
      createCategory.mutate(formData);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Adicionar Nova Categoria</h3>
        <div className="space-y-4">
          <CategoryForm 
            onSubmit={handleFormSubmit}
            submitLabel="Criar Categoria"
          />
          <Button 
            onClick={handleAddCategory}
            className="w-full"
            disabled={!formData}
          >
            Adicionar
          </Button>
        </div>

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