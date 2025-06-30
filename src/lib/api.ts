import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  baseURL: import.meta.env.VITE_API_BASE_URL,
  dangerouslyAllowBrowser: true // Only for development!
});

export const generateRecipe = async (ingredients: string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional nutritionist. Provide detailed recipes with measurements, instructions, prep time, and nutritional info. Format with Markdown."
        },
        {
          role: "user",
          content: `Create a recipe using: ${ingredients}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    return completion.choices[0]?.message?.content || "No recipe generated";
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};