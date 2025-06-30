/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  ArrowRight,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Thermometer,
  HeartPulse,
  Pill,
} from 'lucide-react'
import { useHealthData } from '../contexts/HealthDataContext'

type Step = 'input' | 'analysis' | 'plan'

interface CarePlan {
  dietTips: string[]
  medications: { name: string; dosage: string; timing: string }[]
  homeRemedies: string[]
  dosDonts: { dos: string[]; donts: string[] }
}

interface DiseasePrediction {
  possibleConditions: string[]
  likelihood: 'low' | 'medium' | 'high'
  whenToSeeDoctor: string
}

const SymptomCheckerPage: React.FC = () => {
  const { addSymptom, addCarePlan } = useHealthData()

  // State
  const [step, setStep] = useState<Step>('input')
  const [symptomName, setSymptomName] = useState('')
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate')
  const [duration, setDuration] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [symptomId, setSymptomId] = useState<string | null>(null)
  const [carePlan, setCarePlan] = useState<CarePlan | null>(null)
  const [diseasePrediction, setDiseasePrediction] = useState<DiseasePrediction | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  // Helper function to get random subset
  const getRandomSubset = (array: string[], count: number) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  // Load local JSON fallback
  const getLocalCarePlan = async (symptom: string): Promise<CarePlan> => {
    try {
      const response = await fetch('/assets/json/symptoms.json')
      const mockPlans = await response.json()
      
      // Symptom matching logic
      const normalizedSymptom = symptom.toLowerCase().trim()
      const symptomMap: Record<string, keyof typeof mockPlans> = {
        // Headache and neurological
        headache: 'headache',
        'head pain': 'headache',
        migraine: 'headache',
        'tension headache': 'headache',
        'cluster headache': 'headache',

        // Respiratory conditions
        cough: 'cough',
        coughing: 'cough',
        'dry cough': 'cough',
        'wet cough': 'cough',
        'persistent cough': 'cough',
        cold: 'cold',
        'common cold': 'cold',
        'nasal congestion': 'cold',
        'runny nose': 'cold',
        'stuffy nose': 'cold',
        flu: 'flu',
        influenza: 'flu',
        'sore throat': 'soreThroat',

        // Skin conditions
        acne: 'acne',
        pimple: 'acne',
        zit: 'acne',
        blackhead: 'acne',
        whitehead: 'acne',

        // General conditions
        fever: 'fever',
        'high temperature': 'fever',
        pyrexia: 'fever',
        fatigue: 'fatigue',
        tiredness: 'fatigue',
        exhaustion: 'fatigue',
        'low energy': 'fatigue',
        dehydration: 'dehydration',
        'dry mouth': 'dehydration',
        thirst: 'dehydration',
        stress: 'stress',
        anxiety: 'stress',
        nervousness: 'stress',
        insomnia: 'insomnia',
        sleeplessness: 'insomnia',
        'trouble sleeping': 'insomnia',
      }

      // First try exact matches
      if (symptomMap[normalizedSymptom]) {
        return mockPlans[symptomMap[normalizedSymptom]]
      }

      // Then try partial matches
      for (const [key, planKey] of Object.entries(symptomMap)) {
        if (normalizedSymptom.includes(key)) {
          return mockPlans[planKey]
        }
      }

      // Default to headache if no match found
      return mockPlans.headache
    } catch (error) {
      console.error('Error loading local symptom data:', error)
      return {
        dietTips: ['Stay hydrated and eat balanced meals'],
        medications: [],
        homeRemedies: ['Rest and monitor your symptoms'],
        dosDonts: {
          dos: ['Get adequate rest', 'Monitor your symptoms'],
          donts: ['Ignore worsening symptoms', 'Overexert yourself']
        }
      }
    }
  }

  // Generate disease prediction using OpenAI API
  const generateDiseasePrediction = async (
    symptom: string,
    severity: string,
    duration: string,
    notes: string
  ): Promise<DiseasePrediction | null> => {
    try {
      const prompt = `
        You are a medical assistant analyzing symptoms to predict possible conditions.
        The patient reports:
        - Main symptom: ${symptom}
        - Severity: ${severity}
        - Duration: ${duration}
        - Additional notes: ${notes || 'none'}
        
        Provide a prediction with:
        1. Top 3 possible conditions (ordered by likelihood)
        2. Likelihood level (low, medium, high)
        3. Clear guidance on when to see a doctor
        
        Format the response as JSON exactly like this:
        {
          "possibleConditions": ["condition1", "condition2", "condition3"],
          "likelihood": "low|medium|high",
          "whenToSeeDoctor": "string with specific guidance"
        }
        
        Important:
        - Be conservative with predictions
        - Always recommend seeing a doctor for severe symptoms
        - Consider duration in your assessment
        - For medium/high likelihood, be specific about urgency
      `

      const response = await fetch('https://api.chatanywhere.com.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.5, 
          max_tokens: 500
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content
      
      if (!content) {
        throw new Error('No content in API response')
      }

      return JSON.parse(content)
    } catch (error) {
      console.error('Error generating disease prediction:', error)
      return null
    }
  }

  // Generate care plan using OpenAI API
  const generateAICarePlan = async (
    symptom: string,
    severity: string,
    duration: string,
    notes: string
  ): Promise<CarePlan | null> => {
    try {
      const prompt = `
        You are a medical assistant providing care recommendations for patients.
        The patient reports:
        - Main symptom: ${symptom}
        - Severity: ${severity}
        - Duration: ${duration}
        - Additional notes: ${notes || 'none'}
        
        Provide a structured care plan with:
        1. 4 diet recommendations
        2. 2-3 appropriate medications with dosage and timing (or "none" if not needed)
        3. 4 home remedies
        4. 4 dos and 4 dont's
        
        Format the response as JSON exactly like this:
        {
          "dietTips": ["tip1", "tip2", ...],
          "medications": [{"name": "med1", "dosage": "Xmg", "timing": "every X hours"}, ...],
          "homeRemedies": ["remedy1", "remedy2", ...],
          "dosDonts": {
            "dos": ["do1", "do2", ...],
            "donts": ["don't1", "don't2", ...]
          }
        }
        
        Important:
        - Be concise but professional
        - Only suggest OTC medications for mild/moderate cases
        - Always recommend consulting a doctor for severe symptoms
        - Tailor advice to the symptom severity and duration
        - Consider any additional notes provided
      `

      const response = await fetch('https://api.chatanywhere.com.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1000
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content
      
      if (!content) {
        throw new Error('No content in API response')
      }

      const aiPlan = JSON.parse(content)

      // Add severity-based tip
      const severityTip =
        severity === 'severe'
          ? '⚠️ Consult a doctor immediately if symptoms worsen'
          : severity === 'moderate'
          ? '💡 Monitor your symptoms and seek medical attention if they persist'
          : '💡 These suggestions may help relieve mild symptoms'

      return {
        ...aiPlan,
        dietTips: [...aiPlan.dietTips, severityTip]
      }
    } catch (error) {
      console.error('Error generating AI care plan:', error)
      setApiError('Failed to generate AI recommendations. Using local database instead.')
      return null
    }
  }

  // Symptom Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!symptomName.trim() || !duration.trim()) {
      return
    }

    setIsLoading(true)
    setStep('analysis')
    setApiError(null)

    try {
      // First try to get AI-generated plan and prediction
      const [aiPlan, prediction] = await Promise.all([
        generateAICarePlan(symptomName, severity, duration, additionalNotes),
        generateDiseasePrediction(symptomName, severity, duration, additionalNotes)
      ])

      // If AI fails, fall back to local JSON
      const plan = aiPlan || await getLocalCarePlan(symptomName)

      // Add symptom to health data
      const id = addSymptom({
        name: symptomName,
        severity,
        duration,
        notes: additionalNotes,
        date: new Date().toISOString(),
      })

      setSymptomId(id)
      setCarePlan(plan)
      setDiseasePrediction(prediction)
      
      if (plan) {
        addCarePlan({
          symptomId: id,
          ...plan,
        })
      }
    } catch (error) {
      console.error('Error in symptom analysis:', error)
      setApiError('An error occurred during analysis. Please try again.')
    } finally {
      setIsLoading(false)
      setStep('plan')
    }
  }

  // Reset the form
  const handleReset = () => {
    setStep('input')
    setSymptomName('')
    setSeverity('moderate')
    setDuration('')
    setAdditionalNotes('')
    setSymptomId(null)
    setCarePlan(null)
    setDiseasePrediction(null)
    setApiError(null)
  }

  // Get likelihood color
  const getLikelihoodColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500 dark:text-red-400'
      case 'medium': return 'text-amber-500 dark:text-amber-400'
      case 'low': return 'text-green-500 dark:text-green-400'
      default: return 'text-gray-500 dark:text-gray-400'
    }
  }

  return (
    <div className='space-y-6'>
      <div className='text-center mb-8'>
        <h1 className='mt-5 text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2'>
          <span className='text-primary-600 dark:text-primary-400'>
            Symptom
          </span>
          <span className='text-accent-600 dark:text-accent-400'> Checker</span>
        </h1>
        <p className='mt-3 text-gray-600 dark:text-gray-300 capitalize'>
          Tell us what's bothering you to get personalized care recommendations
        </p>
      </div>

      {step === 'input' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className='card'
        >
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='symptom'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                What symptom are you experiencing?
              </label>
              <div className='relative'>
                <Search
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                  size={18}
                />
                <input
                  type='text'
                  id='symptom'
                  value={symptomName}
                  onChange={(e) => setSymptomName(e.target.value)}
                  placeholder='e.g. Headache, Cough, Fever'
                  className='input pl-10'
                  required
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                How severe is it?
              </label>
              <div className='grid grid-cols-3 gap-3'>
                {(['mild', 'moderate', 'severe'] as const).map((level) => (
                  <button
                    key={level}
                    type='button'
                    onClick={() => setSeverity(level)}
                    className={`py-2 px-4 rounded-lg border-2 transition-all ${
                      severity === level
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'border-gray-300 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor='duration'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                How long have you been experiencing this?
              </label>
              <input
                type='text'
                id='duration'
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder='e.g. 2 days, 1 week'
                className='input'
                required
              />
            </div>

            <div>
              <label
                htmlFor='notes'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                Additional notes (optional)
              </label>
              <textarea
                id='notes'
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder='Any other symptoms, triggers, or details'
                className='input min-h-[80px]'
                rows={3}
              />
            </div>

            <div className='pt-2'>
              <motion.button
                type='submit'
                className='btn-primary w-full flex items-center justify-center'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Analyze Symptoms <ArrowRight size={18} className='ml-2' />
              </motion.button>
            </div>
          </form>

          <div className='mt-4 flex items-start pt-4 border-t border-gray-200 dark:border-gray-700'>
            <AlertCircle
              size={20}
              className='text-amber-500 mr-2 flex-shrink-0 mt-0.5'
            />
            <p className='text-sm text-gray-600 dark:text-gray-400 capitalize'>
              This tool provides general guidance and is not a substitute for
              professional medical advice. Always consult a healthcare provider
              for serious conditions.
            </p>
          </div>
        </motion.div>
      )}

      {step === 'analysis' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className='card text-center'
        >
          <div className='flex flex-col items-center justify-center py-8'>
            <div className='relative w-20 h-20 mb-6'>
              <div className='absolute inset-0 bg-primary-100 dark:bg-primary-900/30 rounded-full animate-ping opacity-75'></div>
              <div className='relative flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-900/50 rounded-full'>
                <Search
                  size={32}
                  className='text-primary-600 dark:text-primary-400'
                />
              </div>
            </div>

            <h2 className='text-xl font-semibold text-gray-800 dark:text-white mb-3 capitalize'>
              Analyzing your symptoms
            </h2>
            <p className='text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6 capitalize'>
              Our AI is analyzing your symptoms and creating personalized recommendations
            </p>

            <div className='w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6'>
              <motion.div
                className='bg-primary-600 h-2.5 rounded-full'
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
              ></motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {step === 'plan' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className='space-y-6'
        >
          {apiError && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {apiError}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className='flex items-center'>
            <button
              onClick={handleReset}
              className='mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800'
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className='text-xl font-semibold text-gray-800 dark:text-white'>
                Your Symptom Analysis
              </h2>
              <p className='text-gray-600 dark:text-gray-300'>
                For: {symptomName} ({severity}, {duration})
              </p>
            </div>
          </div>

          {/* Disease Prediction Section */}
          {diseasePrediction && (
            <motion.div
              className='card'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className='flex items-center mb-4'>
                <HeartPulse size={24} className='text-primary-600 dark:text-primary-400 mr-2' />
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
                  Possible Conditions
                </h3>
              </div>

              <div className='space-y-4'>
                <div>
                  <h4 className='font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Based on your symptoms, these conditions are possible:
                  </h4>
                  <ul className='list-disc pl-5 space-y-1'>
                    {diseasePrediction.possibleConditions.map((condition, index) => (
                      <li key={index} className='text-gray-700 dark:text-gray-300'>
                        {condition}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    <span className='font-medium'>Likelihood:</span>{' '}
                    <span className={`font-semibold ${getLikelihoodColor(diseasePrediction.likelihood)}`}>
                      {diseasePrediction.likelihood.charAt(0).toUpperCase() + diseasePrediction.likelihood.slice(1)}
                    </span>
                  </p>
                </div>

                <div className='p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                  <h4 className='font-medium text-blue-700 dark:text-blue-300 mb-1'>
                    When to see a doctor:
                  </h4>
                  <p className='text-blue-600 dark:text-blue-200'>
                    {diseasePrediction.whenToSeeDoctor}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Care plan sections */}
          {carePlan && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Diet Tips */}
              <motion.div
                className='card'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className='flex items-center mb-4'>
                  <Thermometer size={24} className='text-primary-600 dark:text-primary-400 mr-2' />
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
                    Diet Recommendations
                  </h3>
                </div>
                <ul className='space-y-2'>
                  {carePlan.dietTips.map((tip, index) => (
                    <li key={index} className='flex items-start'>
                      <CheckCircle
                        size={18}
                        className='text-success-500 mr-2 flex-shrink-0 mt-0.5'
                      />
                      <span className='text-gray-700 dark:text-gray-300'>
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Home Remedies */}
              <motion.div
                className='card'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className='flex items-center mb-4'>
                  <HeartPulse size={24} className='text-primary-600 dark:text-primary-400 mr-2' />
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
                    Home Remedies
                  </h3>
                </div>
                <ul className='space-y-2'>
                  {carePlan.homeRemedies.map((remedy, index) => (
                    <li key={index} className='flex items-start'>
                      <CheckCircle
                        size={18}
                        className='text-success-500 mr-2 flex-shrink-0 mt-0.5'
                      />
                      <span className='text-gray-700 dark:text-gray-300'>
                        {remedy}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Medications */}
              <motion.div
                className='card'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className='flex items-center mb-4'>
                  <Pill size={24} className='text-primary-600 dark:text-primary-400 mr-2' />
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
                    Medication Suggestions
                  </h3>
                </div>
                <div className='space-y-4'>
                  {carePlan.medications.length > 0 ? (
                    carePlan.medications.map((med, index) => (
                      <div
                        key={index}
                        className='p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'
                      >
                        <p className='font-semibold text-gray-800 dark:text-white'>
                          {med.name}
                        </p>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                          <span className='font-medium'>Dosage:</span> {med.dosage}
                        </p>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                          <span className='font-medium'>Timing:</span> {med.timing}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className='text-gray-600 dark:text-gray-400'>
                      No specific medications recommended for this symptom.
                    </p>
                  )}
                  <div className='flex items-start mt-2'>
                    <AlertCircle
                      size={18}
                      className='text-amber-500 mr-2 flex-shrink-0 mt-0.5'
                    />
                    <p className='text-sm text-gray-600 dark:text-gray-400 capitalize'>
                      Always consult with a healthcare provider before taking any
                      medication.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Do's & Don'ts */}
              <motion.div
                className='card'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className='text-lg font-semibold mb-4 text-gray-800 dark:text-white'>
                  Do's & Don'ts
                </h3>
                <div className='space-y-4'>
                  <div>
                    <h4 className='font-medium text-success-600 dark:text-success-400 mb-2'>
                      Do:
                    </h4>
                    <ul className='space-y-2'>
                      {carePlan.dosDonts.dos.map((item, index) => (
                        <li key={index} className='flex items-start'>
                          <CheckCircle
                            size={18}
                            className='text-success-500 mr-2 flex-shrink-0 mt-0.5'
                          />
                          <span className='text-gray-700 dark:text-gray-300'>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className='font-medium text-error-600 dark:text-error-400 mb-2'>
                      Don't:
                    </h4>
                    <ul className='space-y-2'>
                      {carePlan.dosDonts.donts.map((item, index) => (
                        <li key={index} className='flex items-start'>
                          <AlertCircle
                            size={18}
                            className='text-error-500 mr-2 flex-shrink-0 mt-0.5'
                          />
                          <span className='text-gray-700 dark:text-gray-300'>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          <div className='flex flex-col sm:flex-row gap-4 justify-center mt-8'>
            <motion.button
              className='btn-primary'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => (window.location.href = '/consult-doctor')}
            >
              Medical Consultation
            </motion.button>
            <motion.button
              className='btn-outline'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
            >
              Check Another Symptom
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default SymptomCheckerPage