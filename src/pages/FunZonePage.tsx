import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QuoteIcon, RefreshCcw, Heart, Star, Share2, ChevronLeft, ChevronRight } from 'lucide-react';

interface MoodQuote {
  quote: string;
  author: string;
}

interface SkinHoroscope {
  sign: string;
  horoscope: string;
  luckySkinProduct: string;
}

interface HealthMeme {
  id: string;
  title: string;
  image: string;
  likes: number;
  comments: number;
}

// Quotes
const moodQuotes: MoodQuote[] = [
  {
    "quote": "Your skin has been through a lot today. It deserves some love and a good serum.",
    "author": "Skincare Sage"
  },
  {
    "quote": "Drinking water might not solve all your problems, but it's a good place to start.",
    "author": "Hydration Nation"
  },
  {
    "quote": "Don't let a bad day make you think you have a bad life. Take your meds and keep going.",
    "author": "Wellness Warrior"
  },
  {
    "quote": "Self-care isn't selfish, it's necessary. Put on that face mask and breathe.",
    "author": "Mindfulness Maven"
  },
  {
    "quote": "Your body is a temple, but even temples need maintenance days.",
    "author": "Health Guru"
  },
  {
    "quote": "The glow you seek comes from within—and also from a really good moisturizer.",
    "author": "Skincare Philosopher"
  },
  {
    "quote": "Taking care of yourself is the most powerful way to begin taking care of others.",
    "author": "Wellness Wisdom"
  },
  {
    "quote": "Health is a relationship between you and your body. Treat it with love and respect.",
    "author": "Anonymous"
  },
  {
    "quote": "A healthy outside starts from the inside.",
    "author": "Robert Urich"
  },
  {
    "quote": "The greatest wealth is health.",
    "author": "Virgil"
  },
  {
    "quote": "Take care of your body. It’s the only place you have to live.",
    "author": "Jim Rohn"
  },
  {
    "quote": "Wellness is not a destination, it’s a way of life.",
    "author": "Anonymous"
  },
  {
    "quote": "Your health is an investment, not an expense.",
    "author": "Anonymous"
  },
  {
    "quote": "A healthy mind in a healthy body is the greatest blessing.",
    "author": "Juvenal"
  },
  {
    "quote": "The first step to change is awareness. The second step is acceptance.",
    "author": "Mental Health Advocate"
  },
  {
    "quote": "Sleep is the best meditation.",
    "author": "Dalai Lama"
  },
  {
    "quote": "Movement is medicine for the body and mind.",
    "author": "Fitness Proverb"
  },
  {
    "quote": "Healing is an art. It takes time, it takes practice, it takes love.",
    "author": "Anonymous"
  },
  {
    "quote": "Your diet is a bank account. Good food choices are good investments.",
    "author": "Bethenny Frankel"
  },
  {
    "quote": "A moment of patience in a moment of anger saves a thousand moments of regret.",
    "author": "Mental Health Wisdom"
  },
  {
    "quote": "The part can never be well unless the whole is well.",
    "author": "Plato"
  },
  {
    "quote": "Rest when you’re weary. Refresh and renew yourself—your body, your mind, your spirit.",
    "author": "Anonymous"
  },
  {
    "quote": "You don’t have to be perfect to be healthy.",
    "author": "Anonymous"
  },
  {
    "quote": "The body achieves what the mind believes.",
    "author": "Fitness Motivation"
  },
  {
    "quote": "You are allowed to take breaks. You don’t have to earn rest.",
    "author": "Self-Care Reminder"
  },
  {
    "quote": "Anxiety does not empty tomorrow of its sorrows, but only empties today of its strength.",
    "author": "Charles Spurgeon"
  },
  {
    "quote": "Your mental health is more important than the test, the interview, the meeting, the family dinner, and the grocery run.",
    "author": "Anonymous"
  },
  {
    "quote": "The secret of change is to focus all your energy not on fighting the old, but on building the new.",
    "author": "Socrates"
  },
  {
    "quote": "You are stronger than you think, more capable than you imagine, and worth more than you realize.",
    "author": "Anonymous"
  },
  {
    "quote": "Healing isn’t linear. Some days you’ll feel strong, others you’ll feel weak—and that’s okay.",
    "author": "Anonymous"
  },
  {
    "quote": "A healthy lifestyle isn’t about perfection, it’s about balance.",
    "author": "Anonymous"
  },
  {
    "quote": "Your body hears everything your mind says. Stay positive.",
    "author": "Anonymous"
  },
  {
    "quote": "Small steps still move you forward.",
    "author": "Anonymous"
  },
  {
    "quote": "Mental health is not a destination, but a process. It’s about how you drive, not where you’re going.",
    "author": "Noam Shpancer"
  },
  {
    "quote": "The only bad workout is the one that didn’t happen.",
    "author": "Fitness Motivation"
  },
  {
    "quote": "You don’t have to control your thoughts; you just have to stop letting them control you.",
    "author": "Dan Millman"
  },
  {
    "quote": "Self-care is how you take your power back.",
    "author": "Anonymous"
  },
  {
    "quote": "Your health account, your bank account—they’re the same thing. The more you invest, the richer you are.",
    "author": "Anonymous"
  },
  {
    "quote": "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.",
    "author": "Anonymous"
  },
  {
    "quote": "The food you eat can be either the safest and most powerful form of medicine or the slowest form of poison.",
    "author": "Ann Wigmore"
  },
  {
    "quote": "Happiness is the highest form of health.",
    "author": "Dalai Lama"
  },
  {
    "quote": "You are not a burden. You are a human being with needs, and that’s okay.",
    "author": "Anonymous"
  },
  {
    "quote": "A calm mind brings inner strength and self-confidence, which is very important for good health.",
    "author": "Dalai Lama"
  },
  {
    "quote": "The best project you’ll ever work on is yourself.",
    "author": "Anonymous"
  },
  {
    "quote": "You don’t have to set yourself on fire to keep others warm.",
    "author": "Anonymous"
  },
  {
    "quote": "Healing takes courage, and we all have courage, even if we have to dig a little to find it.",
    "author": "Tori Amos"
  },
  {
    "quote": "Your health is the crown on your head that only the sick can see.",
    "author": "African Proverb"
  },
  {
    "quote": "Progress, not perfection.",
    "author": "Anonymous"
  },
  {
    "quote": "The groundwork for all happiness is good health.",
    "author": "Leigh Hunt"
  },
  {
    "quote": "Be patient with yourself. Nothing in nature blooms all year.",
    "author": "Anonymous"
  },
  {
    "quote": "You are not your illness. You have an individual story to tell. You have a name, a history, a personality. Staying yourself is part of the battle.",
    "author": "Julian Seifter"
  }
];

// Horoscope
const skinHoroscopes: SkinHoroscope[] = [
  {
    sign: "Aries",
    horoscope: "Your skin is craving adventure this week. Try incorporating a new vitamin C serum to match your fiery energy.",
    luckySkinProduct: "Exfoliating toner"
  },
  {
    sign: "Taurus",
    horoscope: "Stability is your strength, Taurus. Your skin needs grounding - focus on rich moisturizers with ceramides.",
    luckySkinProduct: "Overnight mask"
  },
  {
    sign: "Gemini",
    horoscope: "Two routines might work better than one for your dual nature. Consider a lighter morning routine and intensive evening care.",
    luckySkinProduct: "Dual-phase cleanser"
  },
  {
    sign: "Cancer",
    horoscope: "Your sensitive soul needs sensitive skincare. Nurture your skin barrier with gentle, fragrance-free products this week.",
    luckySkinProduct: "Centella serum"
  },
  {
    sign: "Leo",
    horoscope: "Time to let your skin shine as bright as your personality! Focus on illuminating products and glowy finishes.",
    luckySkinProduct: "Illuminating primer"
  },
  {
    sign: "Virgo",
    horoscope: "Your methodical nature loves a routine. This week, perfect your skincare steps and track your progress meticulously.",
    luckySkinProduct: "Chemical exfoliant"
  },
  {
    sign: "Libra",
    horoscope: "Balance is key for you. If your skin feels oily in some places and dry in others, embrace multi-masking this week.",
    luckySkinProduct: "Balancing toner"
  },
  {
    sign: "Scorpio",
    horoscope: "Your intense nature requires potent skincare. Look for transformative ingredients like retinol and peptides.",
    luckySkinProduct: "Retinol serum"
  },
  {
    sign: "Sagittarius",
    horoscope: "Adventure calls, but don't forget sun protection on your journeys! Your skin needs shielding from environmental stressors.",
    luckySkinProduct: "Antioxidant sunscreen"
  },
  {
    sign: "Capricorn",
    horoscope: "Your disciplined approach to life should extend to skincare. Consistency is your path to results this week.",
    luckySkinProduct: "Peptide cream"
  },
  {
    sign: "Aquarius",
    horoscope: "Innovative skincare technology calls to you. Explore devices or cutting-edge ingredients to satisfy your forward-thinking nature.",
    luckySkinProduct: "LED light therapy"
  },
  {
    sign: "Pisces",
    horoscope: "Your dreamy nature needs hydration. Focus on water-based serums and oceanic ingredients for your sensitive skin.",
    luckySkinProduct: "Hyaluronic acid serum"
  }
];

// Memes
const healthMemes: HealthMeme[] = [
  {
    id: "1",
    title: "When you join a Zoom meeting but forget to mute your chaotic household",
    image: "https://images.pexels.com/photos/6325984/pexels-photo-6325984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    likes: 4500,
    comments: 210
  },
  {
    id: "2",
    title: "Me refreshing my inbox waiting for the 'you're hired' email",
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    likes: 3876,
    comments: 165
  },
  {
    id: "3",
    title: "When you set an alarm for 7 AM but your brain decides it's a suggestion",
    image: "https://images.pexels.com/photos/1819650/pexels-photo-1819650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    likes: 5123,
    comments: 198
  },
  {
     id: "4",
     title: "Me buying another coffee mug because 'this one speaks to my soul'",
     image: "https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
     likes: 2934,
     comments: 142
  },
  {
    id: "5",
    title: "When you open 47 browser tabs and call it 'research'",
    image: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    likes: 6201,
    comments: 275
  },
  {
    id: "6",
    title: "When your Wi-Fi drops in the middle of a Netflix cliffhanger",
    image: "https://images.pexels.com/photos/4474031/pexels-photo-4474031.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    likes: 5789,
    comments: 230
  },
  {
    id: "7",
    title: "Me pretending I read the terms and conditions before clicking 'Agree'",
    image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    likes: 4102,
    comments: 180
  },
  {
    id: "8",
    title: "When you say 'I'll start my diet tomorrow' for the 17th day in a row",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    likes: 4890,
    comments: 195
  },
  {
    id: "9",
    title: "When you spend 30 minutes crafting the perfect text and get a 'k' back",
    image: "https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    likes: 5342,
    comments: 220
  },
  {
    id: "10",
    title: "Me trying to adult but Googling 'how to boil an egg' at 25",
    image: "https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    likes: 4678,
    comments: 205
  }
];

// Jokes
const healthJokes = [
  {
    id: "j1",
    text: "Why did the doctor carry a red pen? In case they needed to draw blood!",
    category: "Medical Humor"
  },
  {
    id: "j2",
    text: "I told my therapist I was addicted to Twitter. They said they didn't follow.",
    category: "Mental Health"
  },
  {
    id: "j3",
    text: "Why don't skeletons fight each other? They don't have the guts!",
    category: "Fitness"
  },
  {
    id: "j4",
    text: "My diet is a series of 'last suppers'.",
    category: "Diet"
  },
  {
    id: "j5",
    text: "I bought a sleep tracker. Now I can see in graphs exactly how sleep-deprived I am!",
    category: "Sleep"
  },
  {
    id: "j6",
    text: "Why did the yoga instructor go to jail? For excessive possession of inner peace!",
    category: "Fitness"
  },
  {
    id: "j7",
    text: "I'm on a seafood diet. I see food and I eat it.",
    category: "Diet"
  },
  {
    id: "j8",
    text: "My gym teacher told me to touch my toes. I said, 'I don't have that app'.",
    category: "Fitness"
  },
  {
    id: "j9",
    text: "I'm reading a book about anti-gravity. It's impossible to put down!",
    category: "Mental Health"
  },
  {
    id: "j10",
    text: "Why did the scarecrow win an award? Because he was outstanding in his field!",
    category: "Mental Health"
  },
  {
    id: "j11",
    text: "Why did the nurse carry a red marker? In case they needed to draw blood!",
    category: "Medical Humor"
  },
  {
    id: "j12",
    text: "I told my doctor I broke my arm in two places. He told me to stop going to those places.",
    category: "Medical Humor"
  },
  {
    id: "j13",
    text: "Why did the germ cross the microscope? To get to the other slide!",
    category: "Medical Humor"
  },
  {
    id: "j14",
    text: "I bought some shoes from a drug dealer. I don't know what he laced them with, but I've been tripping all day.",
    category: "Mental Health"
  },
  {
    id: "j15",
    text: "My therapist says I have a preoccupation with vengeance. We'll see about that.",
    category: "Mental Health"
  },
  {
    id: "j16",
    text: "Why did the hipster burn his tongue? He drank his coffee before it was cool.",
    category: "Diet"
  },
  {
    id: "j17",
    text: "I'm on a whiskey diet. I've lost three days already.",
    category: "Diet"
  },
  {
    id: "j18",
    text: "Sleep is my favorite color.",
    category: "Sleep"
  },
  {
    id: "j19",
    text: "I don't snore. I dream I'm a motorcycle.",
    category: "Sleep"
  },
  {
    id: "j20",
    text: "Why did the gym close down? It just didn't work out!",
    category: "Fitness"
  },
  {
    id: "j21",
    text: "I bought a treadmill once. Best clothes rack I ever owned.",
    category: "Fitness"
  },
  {
    id: "j22",
    text: "Why don't eggs tell jokes? They'd crack each other up!",
    category: "Diet"
  },
  {
    id: "j23",
    text: "I told my psychiatrist I was hearing voices. He said you don't have a psychiatrist.",
    category: "Mental Health"
  },
  {
    id: "j24",
    text: "Why did the doctor carry a ladder? To reach the high blood pressure!",
    category: "Medical Humor"
  },
  {
    id: "j25",
    text: "I used to be addicted to soap, but I'm clean now.",
    category: "Mental Health"
  },
  {
    id: "j26",
    text: "Why did the tomato turn red? Because it saw the salad dressing!",
    category: "Diet"
  },
  {
    id: "j27",
    text: "I told my doctor I've been feeling like a pair of curtains. He said pull yourself together!",
    category: "Medical Humor"
  },
  {
    id: "j28",
    text: "Why did the man miss his funeral? He wasn't feeling it.",
    category: "Medical Humor"
  },
  {
    id: "j29",
    text: "I'm reading a horror book about gluten. It's truly terrifying!",
    category: "Diet"
  },
  {
    id: "j30",
    text: "Why did the germ get promoted? It was outstanding in its field!",
    category: "Medical Humor"
  },
  {
    id: "j31",
    text: "I told my therapist I was feeling insignificant. She said, 'You matter!' I said, 'Oh good, I was worried I might not matter.'",
    category: "Mental Health"
  },
  {
    id: "j32",
    text: "Why did the skeleton go to the party alone? He had no body to go with him!",
    category: "Fitness"
  },
  {
    id: "j33",
    text: "I'm on a 30-day diet. So far I've lost 15 days!",
    category: "Diet"
  },
  {
    id: "j34",
    text: "Why did the nurse carry a red pen? In case she needed to draw blood!",
    category: "Medical Humor"
  },
  {
    id: "j35",
    text: "I told my psychiatrist I was hearing voices. He said you don't have a psychiatrist.",
    category: "Mental Health"
  },
  {
    id: "j36",
    text: "Why don't scientists trust atoms? Because they make up everything!",
    category: "Medical Humor"
  },
  {
    id: "j37",
    text: "I used to be addicted to the hokey pokey, but I turned myself around.",
    category: "Mental Health"
  },
  {
    id: "j38",
    text: "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    category: "Fitness"
  },
  {
    id: "j39",
    text: "I'm on a seafood diet. Every time I see food, I eat it!",
    category: "Diet"
  },
  {
    id: "j40",
    text: "Why did the scarecrow win an award? Because he was outstanding in his field!",
    category: "Mental Health"
  },
  {
    id: "j41",
    text: "I told my therapist I was feeling insignificant. She said, 'You matter!' I said, 'Oh good, I was worried I might not matter.'",
    category: "Mental Health"
  },
  {
    id: "j42",
    text: "Why did the skeleton go to the party alone? He had no body to go with him!",
    category: "Fitness"
  },
  {
    id: "j43",
    text: "I'm on a 30-day diet. So far I've lost 15 days!",
    category: "Diet"
  },
  {
    id: "j44",
    text: "Why did the nurse carry a red pen? In case she needed to draw blood!",
    category: "Medical Humor"
  },
  {
    id: "j45",
    text: "I told my psychiatrist I was hearing voices. He said you don't have a psychiatrist.",
    category: "Mental Health"
  },
  {
    id: "j46",
    text: "Why don't scientists trust atoms? Because they make up everything!",
    category: "Medical Humor"
  },
  {
    id: "j47",
    text: "I used to be addicted to the hokey pokey, but I turned myself around.",
    category: "Mental Health"
  },
  {
    id: "j48",
    text: "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    category: "Fitness"
  },
  {
    id: "j49",
    text: "I'm on a seafood diet. Every time I see food, I eat it!",
    category: "Diet"
  },
  {
    id: "j50",
    text: "Why did the scarecrow win an award? Because he was outstanding in his field!",
    category: "Mental Health"
  }
];

const FunZonePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quotes' | 'horoscopes' | 'memes' | 'jokes'>('quotes');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [currentHoroscopeIndex, setCurrentHoroscopeIndex] = useState(0);
  const [currentJokeIndex, setCurrentJokeIndex] = useState(0);

  const getRandomQuote = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * moodQuotes.length);
    } while (newIndex === currentQuoteIndex);
    setCurrentQuoteIndex(newIndex);
  };

  const getRandomJoke = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * healthJokes.length);
    } while (newIndex === currentJokeIndex);
    setCurrentJokeIndex(newIndex);
  };

  const nextHoroscope = () => {
    setCurrentHoroscopeIndex((prev) => 
      prev === skinHoroscopes.length - 1 ? 0 : prev + 1
    );
  };

  const prevHoroscope = () => {
    setCurrentHoroscopeIndex((prev) => 
      prev === 0 ? skinHoroscopes.length - 1 : prev - 1
    );
  };

  const handleShare = (content: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Fun Zone Content',
        text: content,
      }).catch(console.error);
    } else {
      console.log('Shared:', content);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          <span className='text-primary-600 dark:text-primary-400'>Fun</span>
          <span className='text-accent-600 dark:text-accent-400'> Zone</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 capitalize">
          Lighten up with quotes, horoscopes, memes, and jokes
        </p>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {(['quotes', 'horoscopes', 'memes', 'jokes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>


      <div className="py-4">
        {activeTab === 'quotes' && (
          <motion.div
            key="quotes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-8 rounded-lg shadow"
          >
            <div className="flex justify-center mb-6">
              <QuoteIcon size={40} className="text-blue-400 dark:text-blue-500" />
            </div>
            <blockquote className="text-xl md:text-2xl text-center font-serif text-gray-800 dark:text-gray-100 mb-6">
              "{moodQuotes[currentQuoteIndex].quote}"
            </blockquote>
            <div className="text-center text-gray-600 dark:text-gray-300 mb-8">
              — {moodQuotes[currentQuoteIndex].author}
            </div>
            <div className="flex justify-center gap-4">
              <motion.button
                onClick={getRandomQuote}
                className="flex items-center px-5 py-2 bg-white dark:bg-gray-800 rounded-full shadow text-blue-600 dark:text-blue-400 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCcw size={16} className="mr-2" />
                New Quote
              </motion.button>
              <motion.button
                onClick={() => handleShare(moodQuotes[currentQuoteIndex].quote)}
                className="flex items-center px-5 py-2 bg-white dark:bg-gray-800 rounded-full shadow text-blue-600 dark:text-blue-400 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={16} className="mr-2" />
                Share
              </motion.button>
            </div>
          </motion.div>
        )}


        {activeTab === 'horoscopes' && (
          <motion.div
            key="horoscopes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-8 rounded-lg shadow"
          >
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={prevHoroscope}
                className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30"
              >
                <ChevronLeft className="text-purple-600 dark:text-purple-400" />
              </button>
              
              <div className="text-center">
                <h3 className="text-xl font-serif font-bold text-purple-700 dark:text-purple-300">
                  {skinHoroscopes[currentHoroscopeIndex].sign} Skin Horoscope
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Weekly skincare forecast for your sign
                </p>
              </div>
              
              <button 
                onClick={nextHoroscope}
                className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30"
              >
                <ChevronRight className="text-purple-600 dark:text-purple-400" />
              </button>
            </div>
            
            <div className="text-lg text-center text-gray-800 dark:text-gray-100 mb-6">
              {skinHoroscopes[currentHoroscopeIndex].horoscope}
            </div>
            
            <div className="text-center mb-8">
              <span className="text-sm font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full">
                Lucky Product: {skinHoroscopes[currentHoroscopeIndex].luckySkinProduct}
              </span>
            </div>
            
            <div className="flex justify-center">
              <motion.button
                onClick={() => handleShare(skinHoroscopes[currentHoroscopeIndex].horoscope)}
                className="flex items-center px-5 py-2 bg-white dark:bg-gray-800 rounded-full shadow text-purple-600 dark:text-purple-400 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={16} className="mr-2" />
                Share
              </motion.button>
            </div>
          </motion.div>
        )}


        {activeTab === 'memes' && (
          <motion.div
            key="memes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthMemes.map((meme) => (
                <motion.div
                  key={meme.id}
                  className="card bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={meme.image}
                    alt={meme.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    loading="lazy"
                  />
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                    {meme.title}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Heart size={16} />
                      <span>{meme.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={16} />
                      <span>{meme.comments.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => handleShare(meme.title)}
                      className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <Share2 size={16} />
                      <span>Share</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}


        {activeTab === 'jokes' && (
          <motion.div
            key="jokes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="card bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 p-8 rounded-lg shadow"
          >
            <div className="flex justify-center mb-6">
              <QuoteIcon size={40} className="text-green-400 dark:text-green-500" />
            </div>
            
            <div className="text-xl text-center font-medium text-gray-800 dark:text-gray-100 mb-6">
              {healthJokes[currentJokeIndex].text}
            </div>
            
            <div className="text-center text-gray-600 dark:text-gray-300 mb-8">
              — {healthJokes[currentJokeIndex].category}
            </div>
            
            <div className="flex justify-center gap-4">
              <motion.button
                onClick={getRandomJoke}
                className="flex items-center px-5 py-2 bg-white dark:bg-gray-800 rounded-full shadow text-green-600 dark:text-green-400 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCcw size={16} className="mr-2" />
                New Joke
              </motion.button>
              
              <motion.button
                onClick={() => handleShare(healthJokes[currentJokeIndex].text)}
                className="flex items-center px-5 py-2 bg-white dark:bg-gray-800 rounded-full shadow text-green-600 dark:text-green-400 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={16} className="mr-2" />
                Share
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400 capitalize">
        <p>Remember, laughter is the best medicine, after actual medicine, of course!</p>
        <p className="mt-1">Always follow your healthcare provider's advice.</p>
      </div>
    </div>
  );
};

export default FunZonePage;