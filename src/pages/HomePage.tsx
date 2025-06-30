import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import {
  Stethoscope,
  Calendar,
  SparkleIcon,
  ArrowRight,
  Smile,
  Dumbbell,
  Cross,
  Utensils,
} from 'lucide-react'

const HomePage: React.FC = () => {
  const featureCards = [
    {
      title: 'Symptom Checker',
      description: 'Get personalized care plans for your symptoms',
      icon: <Stethoscope size={24} />,
      path: '/symptom-checker',
      color:
        'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300',
    },
    {
      title: 'Routine Generator',
      description: 'Create daily health routines and reminders',
      icon: <Calendar size={24} />,
      path: '/routine-generator',
      color:
        'bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300',
    },
    {
      title: 'Skincare Solutions',
      description: 'Personalized skincare plans for your skin type',
      icon: <SparkleIcon size={24} />,
      path: '/skincare',
      color:
        'bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300',
    },
    {
      title: 'Consult Doctor',
      description: 'Get expert medical advice from certified professionals',
      icon: <Cross size={24} />,
      path: '/consult-doctor',
      color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    },
    {
      title: 'Exercise Plans',
      description: 'Custom workout routines tailored to your fitness goals',
      icon: <Dumbbell size={24} />,
      path: '/exercises',
      color:
        'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    },
    {
      title: 'Fun Zone',
      description: 'Entertaining activities to boost your mood and energy',
      icon: <Smile size={24} />,
      path: '/fun-zone',
      color:
        'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  const navigate = useNavigate()

  return (
    <div className='space-y-8'>
      {/* Hero section */}
      <motion.section
        className='text-center space-y-6'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='mt-10 text-3xl md:text-4xl font-bold text-gray-800 dark:text-white'>
          Welcome to{' '}
          <span className='text-primary-600 dark:text-primary-400'>Sympto</span>
          <span className='text-accent-600 dark:text-accent-400'>Wise</span>
        </h1>
        <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto capitalize'>
          Your personal AI-powered healthcare assistant for managing symptoms,
          creating health plans, and tracking wellness routines
        </p>

        <div className='flex flex-wrap justify-center gap-5'>
          <Link to='/symptom-checker'>
            <motion.button
              className='btn-primary'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Check Your Symptoms
            </motion.button>
          </Link>
          <Link to='/consult-doctor'>
            <motion.button
              className='btn-outline'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Medical Consultation
            </motion.button>
          </Link>
        </div>
      </motion.section>

      {/* Features section */}
      <motion.section
        className='grid grid-cols-1 md:grid-cols-2 gap-8 px-4'
        variants={container}
        initial='hidden'
        animate='show'
      >
        {featureCards.map((feature, index) => (
          <motion.div
            key={index}
            variants={item}
            whileHover={{
              y: -4,
              transition: { type: 'spring', stiffness: 300 },
            }}
            className='relative isolate group'
          >
            {/* Unique shape background */}
            <div
              className={`absolute -inset-2 rounded-3xl ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity`}
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%)',
              }}
            ></div>

            <Link
              to={feature.path}
              className='flex flex-col h-full p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-4xl border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden transition-all'
            >
              <div
                className={`p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 ${feature.color}`}
              >
                {feature.icon}
              </div>

              <h3 className='text-xl font-bold mb-2.5 text-gray-800 dark:text-white'>
                {feature.title}
              </h3>

              <p className='text-gray-600 dark:text-gray-300 mb-5 leading-relaxed capitalize'>
                {feature.description}
              </p>

              {/* Animated arrow button */}
              <div className='flex items-center mt-auto text-primary-600 dark:text-primary-400 font-medium'>
                <span>Explore</span>
                <motion.span
                  className='ml-2'
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <ArrowRight size={18} />
                </motion.span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.section>

      {/* Nutrition Card */}
      <motion.div
        className='relative bg-white/80 dark:bg-gray-800/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 overflow-hidden group mx-4'
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Backdrop blur shape */}
        <div className='absolute -right-10 -top-10 w-32 h-32 bg-green-200/30 dark:bg-green-800/20 rounded-full filter blur-xl -z-10 group-hover:scale-110 transition-transform' />

        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-green-100 dark:bg-gray-700 rounded-lg'>
              <Utensils
                size={20}
                className='text-green-600 dark:text-green-400'
              />
            </div>
            <div>
              <h3 className='font-small text-gray-800 dark:text-white'>
                Nutrition Plans
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize'>
                View your personalized diet
              </p>
            </div>
          </div>

          <motion.button
            className='flex items-center gap-1 px-4 py-2 bg-green-100 dark:bg-gray-700 hover:bg-green-200 dark:hover:bg-gray-600 text-green-700 dark:text-green-300 rounded-lg transition-colors'
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/diet-page')}
          >
            <span className='text-sm font-medium'>View</span>
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </motion.div>

      <div className='text-center text-sm text-gray-500 dark:text-gray-400'>
        <p>SymptoWise v1.0.0</p>
        <p className='mt-1'>
          © {new Date().getFullYear()} SymptoWise Health Technologies
        </p>

        <div className='relative'>
          <div className='absolute top-0 right-0 p-2'>
            <a
              href='https://bolt.new/'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Visit Bolt website'
              className='inline-block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded'
            >
              {/* Light Mode Logo */}
              <img
                src='https://res.cloudinary.com/dhn92qb61/image/upload/v1750943693/black_w3zehv.png'
                alt='Bolt Logo'
                className='w-16 h-auto dark:hidden'
              />

              {/* Dark Mode Logo */}
              <img
                src='https://res.cloudinary.com/dhn92qb61/image/upload/v1750943705/white_ynuqzq.png'
                alt='Bolt Logo'
                className='w-16 h-auto hidden dark:block'
              />
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}

export default HomePage
