import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define interfaces for our health data
export interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  date: string;
}

export interface RoutineTask {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  category: 'medication' | 'skincare' | 'diet' | 'exercise' | 'other';
}

export interface CarePlan {
  id: string;
  symptomId: string;
  dietTips: string[];
  medications: { name: string; dosage: string; timing: string }[];
  homeRemedies: string[];
  dosDonts: { dos: string[]; donts: string[] };
  createdAt: string;
}

export interface SkincareRoutine {
  id: string;
  condition: string;
  morningRoutine: { step: string; product: string }[];
  eveningRoutine: { step: string; product: string }[];
  weeklyTreatments: string[];
}

// Health data context type
interface HealthDataContextType {
  symptoms: Symptom[];
  routineTasks: RoutineTask[];
  carePlans: CarePlan[];
  skincareRoutines: SkincareRoutine[];
  addSymptom: (symptom: Omit<Symptom, 'id'>) => string;
  updateSymptom: (symptom: Symptom) => void;
  removeSymptom: (id: string) => void;
  addRoutineTask: (task: Omit<RoutineTask, 'id'>) => string;
  updateRoutineTask: (task: RoutineTask) => void;
  toggleTaskCompletion: (id: string) => void;
  removeRoutineTask: (id: string) => void;
  addCarePlan: (plan: Omit<CarePlan, 'id' | 'createdAt'>) => string;
  getCarePlanForSymptom: (symptomId: string) => CarePlan | undefined;
  addSkincareRoutine: (routine: Omit<SkincareRoutine, 'id'>) => string;
  getCompletionPercentage: () => number;
}

// Create context
const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

// Sample data
const initialSymptoms: Symptom[] = [
  {
    id: '1',
    name: 'Headache',
    severity: 'moderate',
    duration: '2 days',
    date: new Date().toISOString(),
  },
];

const initialRoutineTasks: RoutineTask[] = [
  {
    id: '1',
    title: 'Take Aspirin',
    time: '08:00',
    completed: false,
    category: 'medication',
  },
  {
    id: '2',
    title: 'Drink water',
    time: '09:00',
    completed: false,
    category: 'other',
  },
];

const initialCarePlans: CarePlan[] = [
  {
    id: '1',
    symptomId: '1',
    dietTips: ['Avoid caffeine', 'Stay hydrated', 'Eat small, frequent meals'],
    medications: [
      { name: 'Aspirin', dosage: '500mg', timing: 'Every 6 hours as needed' },
    ],
    homeRemedies: [
      'Apply cold compress to forehead',
      'Rest in a dark, quiet room',
      'Gentle head massage',
    ],
    dosDonts: {
      dos: ['Get adequate sleep', 'Practice stress reduction techniques'],
      donts: ['Avoid bright screens', 'Avoid loud noises', 'Skip meals'],
    },
    createdAt: new Date().toISOString(),
  },
];

const initialSkincareRoutines: SkincareRoutine[] = [
  {
    id: '1',
    condition: 'Acne-prone skin',
    morningRoutine: [
      { step: 'Cleanse', product: 'Gentle foaming cleanser' },
      { step: 'Tone', product: 'Alcohol-free toner' },
      { step: 'Treat', product: 'Benzoyl peroxide spot treatment' },
      { step: 'Moisturize', product: 'Oil-free moisturizer' },
      { step: 'Protect', product: 'SPF 30+ sunscreen' },
    ],
    eveningRoutine: [
      { step: 'Remove makeup', product: 'Micellar water' },
      { step: 'Cleanse', product: 'Salicylic acid cleanser' },
      { step: 'Exfoliate', product: 'Chemical exfoliant (2-3x per week)' },
      { step: 'Treat', product: 'Retinol serum' },
      { step: 'Moisturize', product: 'Lightweight gel moisturizer' },
    ],
    weeklyTreatments: [
      'Clay mask (once weekly)',
      'Hydrating mask (once weekly)',
    ],
  },
];

// Provider component
export const HealthDataProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // Initialize state with localStorage data or defaults
  const [symptoms, setSymptoms] = useState<Symptom[]>(() => {
    const saved = localStorage.getItem('symptoms');
    return saved ? JSON.parse(saved) : initialSymptoms;
  });
  
  const [routineTasks, setRoutineTasks] = useState<RoutineTask[]>(() => {
    const saved = localStorage.getItem('routineTasks');
    return saved ? JSON.parse(saved) : initialRoutineTasks;
  });
  
  const [carePlans, setCarePlans] = useState<CarePlan[]>(() => {
    const saved = localStorage.getItem('carePlans');
    return saved ? JSON.parse(saved) : initialCarePlans;
  });
  
  const [skincareRoutines, setSkincareRoutines] = useState<SkincareRoutine[]>(() => {
    const saved = localStorage.getItem('skincareRoutines');
    return saved ? JSON.parse(saved) : initialSkincareRoutines;
  });
  
  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem('symptoms', JSON.stringify(symptoms));
  }, [symptoms]);
  
  useEffect(() => {
    localStorage.setItem('routineTasks', JSON.stringify(routineTasks));
  }, [routineTasks]);
  
  useEffect(() => {
    localStorage.setItem('carePlans', JSON.stringify(carePlans));
  }, [carePlans]);
  
  useEffect(() => {
    localStorage.setItem('skincareRoutines', JSON.stringify(skincareRoutines));
  }, [skincareRoutines]);
  
  // Symptom functions
  const addSymptom = (symptom: Omit<Symptom, 'id'>) => {
    const id = uuidv4();
    setSymptoms([...symptoms, { ...symptom, id }]);
    return id;
  };
  
  const updateSymptom = (symptom: Symptom) => {
    setSymptoms(symptoms.map(s => s.id === symptom.id ? symptom : s));
  };
  
  const removeSymptom = (id: string) => {
    setSymptoms(symptoms.filter(s => s.id !== id));
  };
  
  // Routine task functions
  const addRoutineTask = (task: Omit<RoutineTask, 'id'>) => {
    const id = uuidv4();
    setRoutineTasks([...routineTasks, { ...task, id }]);
    return id;
  };
  
  const updateRoutineTask = (task: RoutineTask) => {
    setRoutineTasks(routineTasks.map(t => t.id === task.id ? task : t));
  };
  
  const toggleTaskCompletion = (id: string) => {
    setRoutineTasks(
      routineTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const removeRoutineTask = (id: string) => {
    setRoutineTasks(routineTasks.filter(t => t.id !== id));
  };
  
  // Care plan functions
  const addCarePlan = (plan: Omit<CarePlan, 'id' | 'createdAt'>) => {
    const id = uuidv4();
    const newPlan = { 
      ...plan, 
      id, 
      createdAt: new Date().toISOString() 
    };
    setCarePlans([...carePlans, newPlan]);
    return id;
  };
  
  const getCarePlanForSymptom = (symptomId: string) => {
    return carePlans.find(plan => plan.symptomId === symptomId);
  };
  
  // Skincare routine functions
  const addSkincareRoutine = (routine: Omit<SkincareRoutine, 'id'>) => {
    const id = uuidv4();
    setSkincareRoutines([...skincareRoutines, { ...routine, id }]);
    return id;
  };
  
  // Get completion percentage for progress tracking
  const getCompletionPercentage = () => {
    if (routineTasks.length === 0) return 0;
    
    const completedTasks = routineTasks.filter(task => task.completed).length;
    return Math.round((completedTasks / routineTasks.length) * 100);
  };
  
  return (
    <HealthDataContext.Provider
      value={{
        symptoms,
        routineTasks,
        carePlans,
        skincareRoutines,
        addSymptom,
        updateSymptom,
        removeSymptom,
        addRoutineTask,
        updateRoutineTask,
        toggleTaskCompletion,
        removeRoutineTask,
        addCarePlan,
        getCarePlanForSymptom,
        addSkincareRoutine,
        getCompletionPercentage,
      }}
    >
      {children}
    </HealthDataContext.Provider>
  );
};

// Custom hook to use the health data context
// eslint-disable-next-line react-refresh/only-export-components
export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (context === undefined) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};