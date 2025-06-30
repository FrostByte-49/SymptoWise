/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Tab } from '@headlessui/react'
import { motion } from 'framer-motion'

import {
  ChefHat,
  Baby,
  User,
  UserCog,
  UserCheck,
  Flame,
  Dumbbell,
  Wheat,
  Apple,
  Carrot,
  CheckCircle2,
  Check,
  XCircle,
  X,
  Loader2,
  Utensils,
  Info,
} from 'lucide-react'

type DietCategory = 'kids' | 'teens' | 'adults' | 'seniors'

type DietPlan = {
  calories: string
  protein: string
  carbs: string
  fats: string
  fiber: string
  foodsToEat: string[]
  foodsToAvoid: string[]
}

type DietData = {
  [key in DietCategory]: DietPlan
}

const categories: { id: DietCategory; label: string }[] = [
  { id: 'kids', label: 'Kids' },
  { id: 'teens', label: 'Teens' },
  { id: 'adults', label: 'Adults' },
  { id: 'seniors', label: 'Seniors' },
]

const NutritionCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: string
  icon: React.ReactNode
  color: string
}) => (
  <motion.div
    className={`${color} rounded-xl p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-all`}
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
  >
    <div className='flex items-center gap-2 mb-2'>
      <div className='p-2 rounded-full bg-white/50 dark:bg-black/20'>
        {icon}
      </div>
      <span className='text-sm font-medium text-gray-600 dark:text-gray-300'>
        {title}
      </span>
    </div>
    <span className='text-lg font-bold dark:text-white'>{value}</span>
  </motion.div>
)

const DietPage: React.FC = () => {
  const [dietData, setDietData] = useState<DietData | null>(null)
  const [ingredients, setIngredients] = useState<string>('')
  const [generatedRecipe, setGeneratedRecipe] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const fetchDietData = async () => {
      try {
        const response = await fetch('/assets/json/diet_plan.json')
        if (!response.ok) throw new Error('Failed to fetch diet data')
        const data = await response.json()
        setDietData(data)
      } catch (error) {
        console.error('Error loading diet data:', error)
      }
    }

    fetchDietData()
  }, [])

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      alert('Please enter some ingredients first!')
      return
    }

    setIsGenerating(true)
    setGeneratedRecipe('')

    try {
      const response = await fetch(
        'https://api.chatanywhere.com.cn/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are a Michelin-star chef and nutritionist. Create restaurant-quality recipes with:
    
                    ## MUST FOLLOW FORMAT:

                    # [Recipe Name]
                    [1-2 sentence enticing description highlighting key flavors and health benefits]

                    ## 🛒 Ingredients
                    - Exact measurements (metric and imperial)
                    - Grouped by recipe components if needed

                    ## ⏱ Prep Time
                    X minutes

                    ## 🍳 Cooking Time
                    X minutes

                    ## 🧑‍🍳 Instructions
                    1. Step-by-step directions with cooking techniques
                    2. Include temperature settings and visual cues
                    3. Separate into logical numbered steps

                    ## 🌱 Nutritional Benefits
                    - Highlight 2-3 key health benefits
                    - Mention macronutrient balance

                    ## 💡 Chef's Tips
                    - Substitutions for dietary restrictions
                    - Storage suggestions
                    - Serving recommendations

                    Use proper Markdown formatting with:
                    - # for recipe title
                    - ## for section headers
                    - - for bullet points
                    - 1. for numbered steps
                    - **bold** for important notes
                    - Emojis for visual organization`,
              },
              {
                role: 'user',
                content: `Create a delicious, healthy recipe using these ingredients: ${ingredients}.
              Make it accessible for home cooks while maintaining gourmet quality.
              Include options for common dietary needs (vegetarian, gluten-free etc.).`,
              },
            ],
            temperature: 0.65,
            max_tokens: 1500,
            top_p: 0.9, // Balances Creativity & Focus
          }),
        }
      )

      const data = await response.json()
      setGeneratedRecipe(
        data.choices[0]?.message?.content || 'No recipe could be generated.'
      )
    } catch (error) {
      console.error('Recipe generation error:', error)
      setGeneratedRecipe('Failed to generate recipe. Please try again later.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-center mb-12'
      >
        <h1 className='text-3xl font-bold mb-3 text-gray-800 dark:text-white'>
          <span className='text-primary-600 dark:text-primary-400'>Nutrition</span>
          <span className='text-accent-600 dark:text-accent-400'> Plans</span>
        </h1>
        <p className='text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto capitalize'>
          Tailored dietary recommendations for every age group
        </p>
      </motion.div>

      <Tab.Group>
        <Tab.List className='flex space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl max-w-2xl mx-auto mb-10'>
          {categories.map((cat) => (
            <Tab
              key={cat.id}
              className={({ selected }) =>
                `w-full py-3 text-sm font-medium rounded-lg transition-all focus:outline-none ${
                  selected
                    ? 'bg-white dark:bg-gray-700 shadow text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`
              }
            >
              <span className='flex items-center justify-center gap-2'>
                {cat.id === 'kids' && <Baby className='h-4 w-4' />}
                {cat.id === 'teens' && <User className='h-4 w-4' />}
                {cat.id === 'adults' && <UserCog className='h-4 w-4' />}
                {cat.id === 'seniors' && <UserCheck className='h-4 w-4' />}
                {cat.label}
              </span>
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className='mb-16'>
          {categories.map((cat) => (
            <Tab.Panel key={cat.id} className='focus:outline-none'>
              {dietData ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className='space-y-8'
                >
                  <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                    <NutritionCard
                      title='Calories'
                      value={dietData[cat.id].calories}
                      icon={<Flame className='h-4 w-4' />}
                      color='bg-orange-50 dark:bg-orange-900/20'
                    />
                    <NutritionCard
                      title='Protein'
                      value={dietData[cat.id].protein}
                      icon={<Dumbbell className='h-4 w-4' />}
                      color='bg-blue-50 dark:bg-blue-900/20'
                    />
                    <NutritionCard
                      title='Carbs'
                      value={dietData[cat.id].carbs}
                      icon={<Wheat className='h-4 w-4' />}
                      color='bg-green-50 dark:bg-green-900/20'
                    />
                    <NutritionCard
                      title='Fats'
                      value={dietData[cat.id].fats}
                      icon={<Apple className='h-4 w-4' />}
                      color='bg-yellow-50 dark:bg-yellow-900/20'
                    />
                    <NutritionCard
                      title='Fiber'
                      value={dietData[cat.id].fiber}
                      icon={<Carrot className='h-4 w-4' />}
                      color='bg-purple-50 dark:bg-purple-900/20'
                    />
                  </div>

                  <div className='grid md:grid-cols-2 gap-6'>
                    <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-green-100 dark:border-green-900/30'>
                      <div className='flex items-center gap-3 mb-4'>
                        <CheckCircle2 className='h-5 w-5 text-green-500' />
                        <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
                          Recommended Foods
                        </h3>
                      </div>
                      <ul className='space-y-3'>
                        {dietData[cat.id].foodsToEat.map((food, idx) => (
                          <li key={idx} className='flex items-start gap-3'>
                            <Check className='h-4 w-4 mt-0.5 text-green-500 flex-shrink-0' />
                            <span className='text-gray-700 dark:text-gray-300'>
                              {food}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30'>
                      <div className='flex items-center gap-3 mb-4'>
                        <XCircle className='h-5 w-5 text-red-500' />
                        <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
                          Foods to Avoid
                        </h3>
                      </div>
                      <ul className='space-y-3'>
                        {dietData[cat.id].foodsToAvoid.map((food, idx) => (
                          <li key={idx} className='flex items-start gap-3'>
                            <X className='h-4 w-4 mt-0.5 text-red-500 flex-shrink-0' />
                            <span className='text-gray-700 dark:text-gray-300'>
                              {food}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className='flex justify-center items-center h-64'>
                  <Loader2 className='h-8 w-8 animate-spin text-primary-500' />
                </div>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>

      {/* Enhanced Recipe Generator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className='bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900/30'
      >
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-3 rounded-full bg-blue-100 dark:bg-blue-900/30'>
            <ChefHat className='h-6 w-6 text-blue-600 dark:text-blue-400' />
          </div>
          <div>
            <h2 className='text-2xl font-bold text-gray-800 dark:text-white'>
              AI Recipe Generator
            </h2>
            <p className='text-sm text-gray-600 dark:text-gray-400 capitalize'>
              Get personalized recipes based on your ingredients
            </p>
          </div>
        </div>

        <div className='flex flex-col md:flex-row gap-4 mb-6'>
          <input
            type='text'
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder='e.g. chicken, broccoli, rice, olive oil'
            className='flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white'
            onKeyDown={(e) => e.key === 'Enter' && generateRecipe()}
          />
          <button
            onClick={generateRecipe}
            disabled={isGenerating}
            className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            {isGenerating ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Generating...
              </>
            ) : (
              <>
                <Utensils className='h-4 w-4' />
                Generate Recipe
              </>
            )}
          </button>
        </div>

        {generatedRecipe && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className='bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-amber-200 dark:border-gray-700'
          >
            <div className='prose dark:prose-invert max-w-none'>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className='text-3xl font-bold mb-6 text-amber-800 dark:text-amber-300 border-b-2 border-amber-200 dark:border-amber-700 pb-2 flex items-center gap-2'
                      {...props}
                    >
                      <ChefHat className='h-8 w-8' />
                      {props.children}
                    </h1>
                  ),
                  h2: ({ node, ...props }) => {
                    const children =
                      typeof props.children === 'string' ? props.children : ''
                    return (
                      <h2
                        className='text-2xl font-semibold mt-8 mb-4 text-amber-700 dark:text-amber-300 flex items-center gap-2'
                        {...props}
                      >
                        {children.includes('Ingredient') ? (
                          <Utensils className='h-6 w-6' />
                        ) : children.includes('Instruction') ? (
                          <Flame className='h-6 w-6' />
                        ) : (
                          <Info className='h-6 w-6' />
                        )}
                        {props.children}
                      </h2>
                    )
                  },
                  h3: ({ node, ...props }) => (
                    <h3
                      className='text-xl font-medium mt-6 mb-3 text-amber-600 dark:text-amber-200'
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className='mb-4 text-gray-800 dark:text-gray-300 leading-relaxed'
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className='list-disc pl-5 mb-6 space-y-2 marker:text-amber-500 dark:marker:text-amber-400'
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className='list-decimal pl-5 mb-6 space-y-2 marker:font-bold marker:text-amber-500 dark:marker:text-amber-400'
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li
                      className='text-gray-800 dark:text-gray-300 pl-2 hover:bg-amber-50 dark:hover:bg-gray-700 rounded px-2 py-1 transition-colors'
                      {...props}
                    />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong
                      className='font-bold text-amber-600 dark:text-amber-400'
                      {...props}
                    />
                  ),
                  em: ({ node, ...props }) => (
                    <em
                      className='italic text-amber-700 dark:text-amber-300'
                      {...props}
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className='border-l-4 border-amber-500 dark:border-amber-400 pl-4 my-4 text-gray-700 dark:text-gray-300 italic bg-amber-50 dark:bg-gray-700 p-3 rounded-r'
                      {...props}
                    />
                  ),
                }}
              >
                {generatedRecipe}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default DietPage
