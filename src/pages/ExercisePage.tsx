/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import {
  Dumbbell,
  HeartPulse,
  Activity,
  ChevronDown,
  ChevronUp,
  Mountain,
  Move,
  Sparkles,
  StretchHorizontal,
  X,
  Info,
  ShieldCheck,
  StickyNote,
  Star,
} from "lucide-react";

type Exercise = {
  id: string;
  title: string;
  category: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  animationUrl: string;
  steps: string[];
  safetyTips?: string[];
  recommendation?: string;
};

type Category = {
  id: string;
  name: string;
  icon: React.ReactNode;
};

const categories: Category[] = [
  { id: "all", name: "All", icon: <Activity size={16} /> },
  { id: "cardio", name: "Cardio", icon: <HeartPulse size={16} /> },
  { id: "core", name: "Core", icon: <Dumbbell size={16} /> },
  { id: "legs", name: "Legs", icon: <Move size={16} /> },
  { id: "yoga", name: "Yoga", icon: <StretchHorizontal size={16} /> },
  { id: "abs", name: "Abs", icon: <Sparkles size={16} /> },
  { id: "stretching", name: "Stretching", icon: <Mountain size={16} /> },
];

const getDurationSeconds = (duration: string) => {
  // e.g. "3 sets of 30 seconds"
  const match = duration.match(/(\d+)\s*sets?\s*of\s*(\d+)/i);
  if (match) {
    return parseInt(match[1]) * parseInt(match[2]);
  }
  const secMatch = duration.match(/(\d+)\s*seconds?/i);
  if (secMatch) return parseInt(secMatch[1]);
  return 0;
};

const difficultyDescriptions: Record<string, string> = {
  Beginner: "Great for all fitness levels!",
  Intermediate: "A bit more challenging.",
  Advanced: "For experienced users.",
};

const ExercisePage: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [animations, setAnimations] = useState<Record<string, any>>({});
  const [animationLoader, setAnimationLoader] = useState<(id: string) => void>();
  const [animationErrors, setAnimationErrors] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedTips, setCheckedTips] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
  const loadingAnimations = new Set<string>();
  const abortController = new AbortController();

  const fetchExercises = async () => {
    try {
      // 1. Fetch exercise metadata
      const response = await fetch('/assets/json/exercises.json', {
        signal: abortController.signal
      });
      if (!response.ok) throw new Error('Failed to load exercises');
      
      const data: Exercise[] = await response.json();
      setExercises(data);
      setLoading(false);

      // 2. Set up lazy loading system
      const loadAnimation = async (exerciseId: string) => {
        if (animations[exerciseId] || loadingAnimations.has(exerciseId)) return;

        const exercise = data.find(ex => ex.id === exerciseId);
        if (!exercise) return;

        loadingAnimations.add(exerciseId);
        try {
          const res = await fetch(exercise.animationUrl, {
            signal: abortController.signal
          });
          
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          
          const animData = await res.json();
          setAnimations(prev => ({ ...prev, [exerciseId]: animData }));
        } catch (err) {
          const error = err as Error;
          if (error.name !== 'AbortError') {
            console.warn(`Animation load failed for ${exerciseId}:`, error);
          }
        } finally {
          loadingAnimations.delete(exerciseId);
        }
      };

      // 3. Make loader available to components
      setAnimationLoader(() => loadAnimation);

      // 4. Preload first 6 animations immediately for better UX
      const preloadCount = Math.min(6, data.length);
      const preloadPromises = data.slice(0, preloadCount).map(ex => loadAnimation(ex.id));
      
      // 5. Load remaining animations in background with slight delay
      if (data.length > preloadCount) {
        setTimeout(() => {
          data.slice(preloadCount).forEach((ex, index) => {
            // Stagger loading to avoid network congestion
            setTimeout(() => loadAnimation(ex.id), index * 300);
          });
        }, 1000);
      }
      
    } catch (err) {
      const error = err as Error;
      if (error.name !== 'AbortError') {
        setError(error.message);
        setLoading(false);
      }
    }
  };

  fetchExercises();

  return () => {
    abortController.abort();
  };
}, []); // No dependencies needed as we use state setters

// Load animation when exercise is selected
useEffect(() => {
  if (selectedExercise && animationLoader) {
    animationLoader(selectedExercise.id);
  }
}, [selectedExercise, animationLoader]); // Only depend on what we actually use



  useEffect(() => {
    // Reset step and tips when modal closes/opens
    setCurrentStep(0);
    setCheckedTips([]);
  }, [selectedExercise]);

  // Favorite toggle (local state for demo)
  const toggleFavorite = (id: string) => {
    setFavorites((favs) =>
      favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id]
    );
  };

  const filteredExercises =
    selectedCategory === "all"
      ? exercises
      : exercises.filter((ex) => ex.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600 border-b-4 border-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading exercises: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white drop-shadow">
        <span className='text-primary-600 dark:text-primary-400'>Exercise</span>
        <span className='text-accent-600 dark:text-accent-400'> Library</span>
      </h1>
      <p className='text-lg text-center mb-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto capitalize'>
          Data-Driven Workouts for Next-Level Gains
      </p>


      {/* Category Filter */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition whitespace-nowrap font-medium shadow-sm ${
              selectedCategory === cat.id
                ? "bg-gradient-to-tr from-primary-600 to-primary-400 text-white border-primary-600 shadow-md"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 border-transparent"
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Exercise Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            tabIndex={0}
            aria-label={`Open details for ${ex.title}`}
            onClick={() => setSelectedExercise(ex)}
            onKeyDown={(e) =>
              e.key === "Enter" ? setSelectedExercise(ex) : null
            }
            className="relative group cursor-pointer p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl transition transform hover:-translate-y-2 hover:scale-[1.03] focus:ring-2 focus:ring-primary-500 outline-none"
          >
            {/* Favorite Star */}
            <button
              className={`absolute top-4 right-4 z-10 p-1 rounded-full transition ${
                favorites.includes(ex.id)
                  ? "bg-yellow-100 text-yellow-500"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 hover:text-yellow-500"
              }`}
              title={
                favorites.includes(ex.id)
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(ex.id);
              }}
            >
              <Star
                fill={favorites.includes(ex.id) ? "#facc15" : "none"}
                size={20}
              />
            </button>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              {ex.title}
            </h2>
            <div className="h-44 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl flex items-center justify-center mb-3 shadow-inner">
              {animations[ex.id] ? (
                <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: animations[ex.id],
                    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
                  }}
                  height={150}
                  width={150}
                />
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No Animation
                </p>
              )}
            </div>
            {/* Progress Bar for Duration */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    (getDurationSeconds(ex.duration) / 180) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <span>⏱️ {ex.duration}</span>
              {/* Difficulty Badge with Tooltip */}
              <span className="relative group">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition ${
                    ex.difficulty === "Beginner"
                      ? "bg-green-100 text-green-700"
                      : ex.difficulty === "Intermediate"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {ex.difficulty}
                </span>
                <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-36 bg-black text-white text-xs rounded p-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-20">
                  {difficultyDescriptions[ex.difficulty]}
                </span>
              </span>
            </div>
            {/* Quick View Button */}
            <button
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition bg-primary-600 text-white px-3 py-1 rounded-full text-xs shadow font-semibold"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedExercise(ex);
              }}
              tabIndex={-1}
            >
              Quick View
            </button>
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {selectedExercise && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            {/* Colorful Sidebar */}
            <div
              className="flex flex-col items-center justify-center h-[115vh] md:w-1/3 w-full py-8 px-4"
              style={{
                background: "linear-gradient(135deg, #60a5fa 0%, #818cf8 100%)",
              }}
            >
              <div className="mb-6">
                {animations[selectedExercise.id] ? (
                  <Lottie
                    options={{
                      loop: true,
                      autoplay: true,
                      animationData: animations[selectedExercise.id],
                      rendererSettings: {
                        preserveAspectRatio: "xMidYMid slice",
                      },
                    }}
                    height={250}
                    width={200}
                  />
                ) : (
                  <div className="h-28 w-28 flex items-center justify-center bg-white/30 rounded-full">
                    <Activity size={48} className="text-white" />
                  </div>
                )}
              </div>
              <span className="text-white text-lg font-bold text-center">
                {selectedExercise.title}
              </span>
              <span className="mt-2 px-3 py-1 bg-white/30 text-white rounded-full text-xs font-medium">
                {selectedExercise.category.charAt(0).toUpperCase() +
                  selectedExercise.category.slice(1)}
              </span>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
                onClick={() => setSelectedExercise(null)}
                aria-label="Close"
              >
                <X size={28} />
              </button>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <strong>⏱ Duration:</strong> {selectedExercise.duration}
                </p>
                <p>
                  <strong>📊 Difficulty:</strong>{" "}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedExercise.difficulty === "Beginner"
                        ? "bg-green-100 text-green-700"
                        : selectedExercise.difficulty === "Intermediate"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedExercise.difficulty}
                  </span>
                </p>
              </div>

              {/* Steps */}
              <div className="mb-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                  <Info size={18} /> How to Perform
                </h3>
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-5 shadow-inner flex flex-col items-center">
                  <div className="flex items-center w-full gap-4 mb-2">
                    <button
                      disabled={currentStep === 0}
                      onClick={() => setCurrentStep((s) => Math.max(s - 1, 0))}
                      className="px-2 py-1 rounded bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 disabled:opacity-50 transition"
                      aria-label="Previous step"
                    >
                      <ChevronUp size={18} className="rotate-180" />
                    </button>
                    <div className="flex-1 text-base text-gray-700 dark:text-gray-200 font-medium py-4 px-5 rounded bg-white dark:bg-gray-800 shadow">
                      {selectedExercise.steps[currentStep]}
                    </div>
                    <button
                      disabled={
                        currentStep === selectedExercise.steps.length - 1
                      }
                      onClick={() =>
                        setCurrentStep((s) =>
                          Math.min(s + 1, selectedExercise.steps.length - 1)
                        )
                      }
                      className="px-2 py-1 rounded bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 disabled:opacity-50 transition"
                      aria-label="Next step"
                    >
                      <ChevronUp size={18} />
                    </button>
                  </div>
                  <div className="mt-1 text-xs text-blue-600 dark:text-blue-200 text-center">
                    Step {currentStep + 1} of {selectedExercise.steps.length}
                  </div>
                  <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1 mt-2">
                    <div
                      className="bg-primary-400 h-1 rounded-full transition-all"
                      style={{
                        width: `${
                          ((currentStep + 1) / selectedExercise.steps.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Safety Tips */}
              {selectedExercise.safetyTips && (
                <div className="mb-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    <ShieldCheck size={18} /> Safety Tips
                  </h3>
                  <ul className="space-y-2 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                    {selectedExercise.safetyTips.map((tip, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checkedTips.includes(i)}
                          onChange={() =>
                            setCheckedTips((tips) =>
                              tips.includes(i)
                                ? tips.filter((t) => t !== i)
                                : [...tips, i]
                            )
                          }
                          className="form-checkbox accent-primary-600 h-5 w-5 transition"
                          aria-label={`Mark tip as read: ${tip}`}
                        />
                        <span
                          className={
                            checkedTips.includes(i)
                              ? "line-through text-gray-400"
                              : ""
                          }
                        >
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendation */}
              {selectedExercise.recommendation && (
                <div className="mb-2">
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    <StickyNote size={18} /> Recommendation
                  </h3>
                  <p className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl text-base text-gray-700 dark:text-gray-300">
                    {selectedExercise.recommendation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {filteredExercises.length === 0 && (
        <p className="text-center mt-12 text-gray-500 dark:text-gray-400">
          No exercises found in this category.
        </p>
      )}
    </div>
  );
};

export default ExercisePage;
