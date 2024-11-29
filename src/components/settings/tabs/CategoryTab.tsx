import { CategoryForm, CategoryFormData } from "@/components/categories/CategoryForm";
import { Card } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const CategoryTab = () => {
  const queryClient = useQueryClient();

  // Query para carregar as categorias
  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        throw new Error(error.message); // Lançando erro com a mensagem
      }
      return data;
    }
  });

  // Mutação para criar categoria
  const createCategory = useMutation({
    mutationFn: async (values: CategoryFormData) => {
      const { error } = await supabase
        .from('categories')
        .insert([{
          name: values.name,
          description: values.description || null
        }]);

      if (error) {
        throw new Error(error.message); // Lançando erro com a mensagem
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoria criada com sucesso!');
    },
    onError: (error: Error) => {
      console.error("Erro ao criar categoria:", error); // Logando o erro no console
      toast.error(`Erro ao criar categoria: ${error.message}`); // Mensagem de erro personalizada
    },
  });

  // Estado de carregamento e erro
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (isError) {
    return <div>Erro ao carregar categorias.</div>;
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Nova Categoria</h3>
        <CategoryForm 
          onSubmit={(values) => {
            console.log("Enviando valores:", values);  // Log dos valores do formulário
            createCategory.mutate(values);
          }}
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
