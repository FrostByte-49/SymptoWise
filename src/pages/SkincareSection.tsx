import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  SparkleIcon, 
  ChevronDown, 
  Clock,
  Info
} from 'lucide-react';
// import { useHealthData } from '../contexts/HealthDataContext';

type SkinCondition = 'acne' | 'oily' | 'dry' | 'sensitive' | 'aging';

const SkincareSection: React.FC = () => {
  // const { skincareRoutines } = useHealthData();
  const [selectedCondition, setSelectedCondition] = useState<SkinCondition>('acne');
  const [expandedSection, setExpandedSection] = useState<'morning' | 'evening' | 'weekly' | null>('morning');
  
  // Skin condition data
  const skinConditions: Record<SkinCondition, {
    title: string;
    description: string;
    image: string;
    morningRoutine: { step: string; product: string }[];
    eveningRoutine: { step: string; product: string }[];
    weeklyTreatments: string[];
    tips: string[];
    diet: string[];
    avoidProducts: string[];
  }> = {
    acne: {
      title: 'Acne-Prone Skin',
      description: 'Focuses on controlling oil production, preventing clogged pores, and reducing inflammation.',
      image: 'https://images.unsplash.com/photo-1589221134210-f010476445e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWNuZSUyMHByb25lJTIwc2tpbnxlbnwwfDB8MHx8fDI%3D',
      morningRoutine: [
        { step: 'Cleanse', product: 'Gentle foaming cleanser with salicylic acid' },
        { step: 'Tone', product: 'Alcohol-free toner with niacinamide' },
        { step: 'Treat', product: 'Lightweight serum with salicylic acid or benzoyl peroxide' },
        { step: 'Moisturize', product: 'Oil-free, non-comedogenic moisturizer' },
        { step: 'Protect', product: 'Oil-free mineral sunscreen SPF 30+' },
      ],
      eveningRoutine: [
        { step: 'Remove makeup', product: 'Micellar water or oil-free makeup remover' },
        { step: 'Cleanse', product: 'Same morning cleanser or benzoyl peroxide wash' },
        { step: 'Exfoliate', product: 'BHA/salicylic acid exfoliant (2-3x per week)' },
        { step: 'Treat', product: 'Spot treatment with benzoyl peroxide or sulfur' },
        { step: 'Moisturize', product: 'Lightweight gel moisturizer' },
      ],
      weeklyTreatments: [
        'Clay mask once weekly to draw out impurities',
        'Hydrating mask once weekly to prevent dehydration',
        'Chemical exfoliant peel (if skin tolerates it)',
      ],
      tips: [
        'Change pillowcases 2-3 times weekly',
        'Avoid touching your face throughout the day',
        'Clean phone screen regularly',
        'Use non-comedogenic makeup labeled "oil-free"',
        'Wash face after sweating heavily',
      ],
      diet: [
        'Reduce dairy consumption',
        'Limit high-glycemic foods',
        'Increase omega-3 fatty acids',
        'Consume zinc-rich foods',
        'Stay hydrated with at least 8 glasses of water daily',
      ],
      avoidProducts: [
        'Heavy oils and butters',
        'Alcohol-based products',
        'Fragranced skincare',
        'Coconut oil (comedogenic for many)',
        'Physical scrubs with large particles',
      ],
    },
    oily: {
      title: 'Oily Skin',
      description: 'Focuses on balancing oil production without stripping the skin and maintaining hydration.',
      image: 'https://img.freepik.com/free-photo/ai-generated-cute-girl-pic_23-2150649930.jpg?ga=GA1.1.1462889499.1750941580&semt=ais_hybrid&w=740',
      morningRoutine: [
        { step: 'Cleanse', product: 'Gel or foaming cleanser with glycolic acid' },
        { step: 'Tone', product: 'Balancing toner with witch hazel or green tea' },
        { step: 'Treat', product: 'Lightweight serum with niacinamide' },
        { step: 'Moisturize', product: 'Oil-free gel moisturizer' },
        { step: 'Protect', product: 'Mattifying sunscreen SPF 30+' },
      ],
      eveningRoutine: [
        { step: 'Remove makeup', product: 'Oil-free makeup remover or micellar water' },
        { step: 'Cleanse', product: 'Same morning cleanser' },
        { step: 'Exfoliate', product: 'BHA/AHA exfoliant (2-3x per week)' },
        { step: 'Treat', product: 'Retinol serum (start with low concentration)' },
        { step: 'Moisturize', product: 'Lightweight gel or lotion moisturizer' },
      ],
      weeklyTreatments: [
        'Clay or charcoal mask to absorb excess oil',
        'Hydrating mask to balance skin',
        'Gentle chemical peel with glycolic acid',
      ],
      tips: [
        'Use blotting papers throughout the day',
        'Look for "oil-free" and "non-comedogenic" on products',
        'Don\'t over-wash your face (max 2-3 times daily)',
        'Use moisturizer even though skin is oily',
        'Consider using a mattifying primer under makeup',
      ],
      diet: [
        'Reduce refined carbohydrates and sugars',
        'Increase zinc-rich foods like nuts and seeds',
        'Consume more vitamin B5 (pantothenic acid)',
        'Eat foods rich in omega-3 fatty acids',
        'Stay hydrated with at least 8 glasses of water daily',
      ],
      avoidProducts: [
        'Heavy creams and oils',
        'Alcohol-based astringents',
        'Fragranced products',
        'Occlusive ingredients like petroleum jelly',
        'Heavy makeup foundations',
      ],
    },
    dry: {
      title: 'Dry Skin',
      description: 'Focuses on restoring and maintaining moisture in the skin while strengthening the skin barrier.',
      image: 'https://img.freepik.com/free-photo/woman-applying-face-cream-her-skin_23-2151983500.jpg?ga=GA1.1.1462889499.1750941580&semt=ais_hybrid&w=740',
      morningRoutine: [
        { step: 'Cleanse', product: 'Cream or milk cleanser with ceramides' },
        { step: 'Tone', product: 'Hydrating toner with hyaluronic acid' },
        { step: 'Treat', product: 'Hydrating serum with hyaluronic acid and/or glycerin' },
        { step: 'Moisturize', product: 'Rich cream with ceramides and fatty acids' },
        { step: 'Protect', product: 'Moisturizing sunscreen SPF 30+' },
      ],
      eveningRoutine: [
        { step: 'Remove makeup', product: 'Cleansing balm or oil' },
        { step: 'Cleanse', product: 'Cream cleanser' },
        { step: 'Exfoliate', product: 'Gentle AHA exfoliant 1-2x per week' },
        { step: 'Treat', product: 'Hydrating serum with multiple molecular weights of hyaluronic acid' },
        { step: 'Moisturize', product: 'Rich night cream or sleeping mask' },
        { step: 'Seal', product: 'Facial oil with squalane or jojoba oil' },
      ],
      weeklyTreatments: [
        'Hydrating sheet mask twice weekly',
        'Overnight moisture mask',
        'Gentle enzyme exfoliation mask',
      ],
      tips: [
        'Use a humidifier, especially during winter',
        'Avoid hot water when washing face',
        'Pat face dry instead of rubbing',
        'Apply products to damp skin to lock in moisture',
        'Consider facial oils as an additional moisture step',
      ],
      diet: [
        'Increase intake of healthy fats (avocados, nuts, olive oil)',
        'Consume omega-3 rich foods',
        'Eat vitamin E rich foods (almonds, sunflower seeds)',
        'Include collagen-supporting foods (bone broth, berries)',
        'Stay hydrated with at least 8 glasses of water daily',
      ],
      avoidProducts: [
        'Products with alcohol, sulfates, or fragrance',
        'Harsh physical exfoliants',
        'Foaming cleansers',
        'Astringent toners',
        'Overly hot water for cleansing',
      ],
    },
    sensitive: {
      title: 'Sensitive Skin',
      description: 'Focuses on gentle, soothing ingredients that calm irritation and strengthen the skin barrier.',
      image: 'https://img.freepik.com/free-photo/woman-looking-her-rosacea-mirror_23-2150248345.jpg?ga=GA1.1.1462889499.1750941580&semt=ais_hybrid&w=740',
      morningRoutine: [
        { step: 'Cleanse', product: 'Gentle fragrance-free cleanser with minimal ingredients' },
        { step: 'Soothe', product: 'Thermal water spray or centella asiatica toner' },
        { step: 'Treat', product: 'Serum with centella asiatica or madecassoside' },
        { step: 'Moisturize', product: 'Fragrance-free moisturizer with ceramides' },
        { step: 'Protect', product: 'Mineral sunscreen with zinc oxide and/or titanium dioxide' },
      ],
      eveningRoutine: [
        { step: 'Remove makeup', product: 'Gentle micellar water or cleansing milk' },
        { step: 'Cleanse', product: 'Same gentle cleanser as morning' },
        { step: 'Soothe', product: 'Calming essence with licorice root or green tea' },
        { step: 'Treat', product: 'Barrier repair serum with ceramides' },
        { step: 'Moisturize', product: 'Soothing night cream with colloidal oatmeal or allantoin' },
      ],
      weeklyTreatments: [
        'Gentle hydrating mask with oat extract',
        'Aloe vera gel mask',
        'Plain yogurt mask (if dairy is not a trigger)',
      ],
      tips: [
        'Patch test all new products',
        'Introduce one new product at a time (wait 2 weeks)',
        'Avoid extreme temperatures',
        'Keep skincare simple with minimal ingredients',
        'Avoid mechanical exfoliation and opt for very gentle chemical options',
      ],
      diet: [
        'Identify and avoid food triggers (common ones: dairy, gluten, processed foods)',
        'Increase anti-inflammatory foods (turmeric, ginger, green leafy vegetables)',
        'Consume omega-3 rich foods to reduce inflammation',
        'Stay hydrated with at least 8 glasses of water daily',
        'Consider probiotics for gut health which may impact skin',
      ],
      avoidProducts: [
        'Fragrances and essential oils',
        'Alcohol in any form',
        'Chemical sunscreens (opt for mineral)',
        'Harsh preservatives like methylisothiazolinone',
        'Physical scrubs or brushes',
      ],
    },
    aging: {
      title: 'Aging Skin',
      description: 'Focuses on supporting collagen production, increasing cell turnover, and providing intensive hydration.',
      image: 'https://img.freepik.com/free-photo/side-view-smiley-woman-applying-face-cream_23-2149419810.jpg?ga=GA1.1.1462889499.1750941580&semt=ais_hybrid&w=740',
      morningRoutine: [
        { step: 'Cleanse', product: 'Gentle creamy cleanser with antioxidants' },
        { step: 'Tone', product: 'Hydrating toner with niacinamide' },
        { step: 'Treat', product: 'Vitamin C serum (10-20%)' },
        { step: 'Eye Care', product: 'Eye cream with peptides and caffeine' },
        { step: 'Moisturize', product: 'Rich moisturizer with peptides and ceramides' },
        { step: 'Protect', product: 'Broad-spectrum SPF 50+ with antioxidants' },
      ],
      eveningRoutine: [
        { step: 'Remove makeup', product: 'Cleansing balm or oil' },
        { step: 'Cleanse', product: 'Same gentle cleanser as morning' },
        { step: 'Tone', product: 'Hydrating toner with glycerin' },
        { step: 'Treat', product: 'Retinol or retinoid serum (start low concentration)' },
        { step: 'Eye Care', product: 'Rich eye cream with retinol or peptides' },
        { step: 'Moisturize', product: 'Night cream with peptides, ceramides, and antioxidants' },
        { step: 'Seal', product: 'Facial oil with rosehip or bakuchiol' },
      ],
      weeklyTreatments: [
        'AHA treatment or mask once weekly',
        'Hydrating sheet mask twice weekly',
        'LED red light therapy sessions',
      ],
      tips: [
        'Sleep on your back to prevent sleep lines',
        'Use upward motions when applying skincare',
        'Consider gua sha or facial massage tools',
        'Always apply product to neck and décolletage',
        'Be patient - results take time with anti-aging skincare',
      ],
      diet: [
        'Increase collagen-supporting foods (bone broth, berries, citrus)',
        'Eat antioxidant-rich foods (berries, dark leafy greens, colorful vegetables)',
        'Consume healthy fats (avocados, olive oil, nuts)',
        'Reduce sugar and processed foods',
        'Stay hydrated with at least 8 glasses of water daily',
      ],
      avoidProducts: [
        'Harsh sulfate cleansers',
        'High concentration AHAs without building tolerance',
        'Denatured alcohol in high concentrations',
        'Fragrances that can cause irritation',
        'Using too many active ingredients at once',
      ],
    },
  };
  
  // Toggle section expansion
  const toggleSection = (section: 'morning' | 'evening' | 'weekly') => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  // Get current skin condition data
  const currentCondition = skinConditions[selectedCondition];
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="mt-5 text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          <span className='text-primary-600 dark:text-primary-400'>Skincare</span>
          <span className='text-accent-600 dark:text-accent-400'> Solutions</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 capitalize">
          Personalized skincare routines for your unique skin needs
        </p>
      </div>
      
      {/* Skin condition selector */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {(Object.keys(skinConditions) as SkinCondition[]).map((condition) => (
          <motion.button
            key={condition}
            onClick={() => setSelectedCondition(condition)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCondition === condition 
                ? 'bg-accent-500 text-white shadow-sm' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {skinConditions[condition].title}
          </motion.button>
        ))}
      </div>
      
      {/* Selected condition content */}
      <motion.div
        key={selectedCondition}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Hero image and description */}
        <div className="card overflow-hidden mb-6">
          <div className="relative h-48 md:h-64 overflow-hidden rounded-t-xl">
            <img 
              src={currentCondition.image} 
              alt={currentCondition.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                  <SparkleIcon size={20} className="mr-2 text-accent-400" />
                  {currentCondition.title}
                </h2>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300">
              {currentCondition.description}
            </p>
          </div>
        </div>
        
        {/* Morning routine */}
        <div className="card mb-6">
          <button 
            onClick={() => toggleSection('morning')}
            className="flex justify-between items-center w-full px-6 py-4"
          >
            <div className="flex items-center">
              <Clock size={20} className="text-accent-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Morning Routine
              </h3>
            </div>
            <ChevronDown 
              size={20} 
              className={`text-gray-500 transition-transform ${expandedSection === 'morning' ? 'rotate-180' : ''}`}
            />
          </button>
          
          {expandedSection === 'morning' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-6 pb-6"
            >
              <ol className="space-y-4">
                {currentCondition.morningRoutine.map((item, index) => (
                  <li key={index} className="flex">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">
                        {item.step}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {item.product}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </motion.div>
          )}
        </div>
        
        {/* Evening routine */}
        <div className="card mb-6">
          <button 
            onClick={() => toggleSection('evening')}
            className="flex justify-between items-center w-full px-6 py-4"
          >
            <div className="flex items-center">
              <Clock size={20} className="text-accent-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Evening Routine
              </h3>
            </div>
            <ChevronDown 
              size={20} 
              className={`text-gray-500 transition-transform ${expandedSection === 'evening' ? 'rotate-180' : ''}`}
            />
          </button>
          
          {expandedSection === 'evening' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-6 pb-6"
            >
              <ol className="space-y-4">
                {currentCondition.eveningRoutine.map((item, index) => (
                  <li key={index} className="flex">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">
                        {item.step}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {item.product}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </motion.div>
          )}
        </div>
        
        {/* Weekly treatments */}
        <div className="card mb-6">
          <button 
            onClick={() => toggleSection('weekly')}
            className="flex justify-between items-center w-full px-6 py-4"
          >
            <div className="flex items-center">
              <Clock size={20} className="text-accent-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Weekly Treatments
              </h3>
            </div>
            <ChevronDown 
              size={20} 
              className={`text-gray-500 transition-transform ${expandedSection === 'weekly' ? 'rotate-180' : ''}`}
            />
          </button>
          
          {expandedSection === 'weekly' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-6 pb-6"
            >
              <ul className="space-y-2">
                {currentCondition.weeklyTreatments.map((treatment, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 flex items-center justify-center text-xs mr-3 mt-0.5">
                      ✓
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{treatment}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
        
        {/* Tips & Diet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <SparkleIcon size={18} className="text-accent-500 mr-2" />
              Skincare Tips
            </h3>
            <ul className="space-y-2">
              {currentCondition.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 flex items-center justify-center text-xs mr-3 mt-0.5">
                    ✓
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <SparkleIcon size={18} className="text-accent-500 mr-2" />
              Dietary Recommendations
            </h3>
            <ul className="space-y-2">
              {currentCondition.diet.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 flex items-center justify-center text-xs mr-3 mt-0.5">
                    ✓
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Products to Avoid */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Info size={18} className="text-error-500 mr-2" />
            Products to Avoid
          </h3>
          <ul className="space-y-2">
            {currentCondition.avoidProducts.map((product, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-error-100 dark:bg-error-900/30 text-error-600 dark:text-error-400 flex items-center justify-center text-xs mr-3 mt-0.5">
                  ✕
                </div>
                <span className="text-gray-700 dark:text-gray-300">{product}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Footer note */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 capitalize">
          <p>Always patch test new products and consult with a dermatologist for personalized advice.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default SkincareSection;