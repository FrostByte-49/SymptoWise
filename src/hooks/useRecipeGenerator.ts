import { useState } from 'react';
import { generateRecipe } from '../lib/api';
import { useToast } from '../contexts/ToastContext';

export const useRecipeGenerator = () => {
  const [recipe, setRecipe] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const generate = async (ingredients: string) => {
    if (!ingredients.trim()) {
      showToast('Please enter some ingredients', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const generated = await generateRecipe(ingredients);
      setRecipe(generated);
      showToast('Recipe generated successfully!', 'success');
    } catch (error) {
      console.error('Recipe generation failed:', error);
      showToast('Failed to generate recipe', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return { recipe, generate, isLoading };
};