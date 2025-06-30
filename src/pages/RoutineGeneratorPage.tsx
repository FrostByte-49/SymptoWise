import React, { useState } from 'react'
import { motion } from 'framer-motion'

import {
  Plus,
  Clock,
  Trash2,
  CheckCircle,
  X,
  Calendar,
} from 'lucide-react'

import { useHealthData, RoutineTask } from '../contexts/HealthDataContext'

interface RoutineFormData {
  title: string
  time: string
  category: 'medication' | 'skincare' | 'diet' | 'exercise' | 'other'
}

const RoutineGeneratorPage: React.FC = () => {
  const {
    routineTasks,
    addRoutineTask,
    toggleTaskCompletion,
    removeRoutineTask,
  } = useHealthData()

  const [isAddingTask, setIsAddingTask] = useState(false)
  const [formData, setFormData] = useState<RoutineFormData>({
    title: '',
    time: '',
    category: 'medication',
  })

  // Group tasks by time
  const groupedTasks = routineTasks.reduce(
    (acc: Record<string, RoutineTask[]>, task) => {
      if (!acc[task.time]) {
        acc[task.time] = []
      }
      acc[task.time].push(task)
      return acc
    },
    {}
  )

  // Sort times
  const sortedTimes = Object.keys(groupedTasks).sort()

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.time) {
      return
    }

    addRoutineTask({
      title: formData.title.trim(),
      time: formData.time,
      category: formData.category,
      completed: false,
    })

    // Reset form
    setFormData({
      title: '',
      time: '',
      category: 'medication',
    })

    setIsAddingTask(false)
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication':
        return <div className='w-2 h-2 bg-primary-500 rounded-full'></div>
      case 'skincare':
        return <div className='w-2 h-2 bg-accent-500 rounded-full'></div>
      case 'diet':
        return <div className='w-2 h-2 bg-success-500 rounded-full'></div>
      case 'exercise':
        return <div className='w-2 h-2 bg-warning-500 rounded-full'></div>
      default:
        return <div className='w-2 h-2 bg-gray-500 rounded-full'></div>
    }
  }

  return (
    <div className='space-y-6'>
      <div className='text-center mb-8'>
        <h1 className='mt-5 text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2'>
          <span className='text-primary-600 dark:text-primary-400'>Routine</span>
          <span className='text-accent-600 dark:text-accent-400'> Planner</span>
        </h1>
        <p className='text-gray-600 dark:text-gray-300 capitalize'>
          Create and manage your personalized health routine
        </p>
      </div>

      {/* Add task button */}
      {!isAddingTask && (
        <motion.button
          className='btn-primary w-full flex items-center justify-center'
          onClick={() => setIsAddingTask(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={18} className='mr-2' />
          Add Task to Routine
        </motion.button>
      )}

      {/* Add task form */}
      {isAddingTask && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className='card'
        >
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
              Add New Task
            </h3>
            <button
              onClick={() => setIsAddingTask(false)}
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label
                htmlFor='title'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                Task Title
              </label>
              <input
                type='text'
                id='title'
                name='title'
                value={formData.title}
                onChange={handleChange}
                placeholder='e.g. Take medication, Apply face mask'
                className='input'
                required
              />
            </div>

            <div>
              <label
                htmlFor='time'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                Time
              </label>
              <input
                type='time'
                id='time'
                name='time'
                value={formData.time}
                onChange={handleChange}
                className='input'
                required
              />
            </div>

            <div>
              <label
                htmlFor='category'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                Category
              </label>
              <select
                id='category'
                name='category'
                value={formData.category}
                onChange={handleChange}
                className='input'
                required
              >
                <option value='medication'>Medication</option>
                <option value='skincare'>Skincare</option>
                <option value='diet'>Diet</option>
                <option value='exercise'>Exercise</option>
                <option value='other'>Other</option>
              </select>
            </div>

            <div className='flex justify-end space-x-3 pt-2'>
              <motion.button
                type='button'
                className='btn-outline'
                onClick={() => setIsAddingTask(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type='submit'
                className='btn-primary'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add Task
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Routine timeline */}
      <div className='mt-8'>
        <div className='flex items-center mb-6'>
          <Calendar
            className='text-gray-600 dark:text-gray-400 mr-2'
            size={20}
          />
          <h2 className='text-xl font-semibold text-gray-800 dark:text-white'>
            Today's Schedule
          </h2>
        </div>

        {sortedTimes.length === 0 ? (
          <div className='card text-center py-12'>
            <p className='text-gray-500 dark:text-gray-400 mb-4'>
              No tasks added to your routine yet
            </p>
            <button
              onClick={() => setIsAddingTask(true)}
              className='btn-outline inline-flex items-center'
            >
              <Plus size={18} className='mr-2' />
              Create Your First Task
            </button>
          </div>
        ) : (
          <div className='space-y-6'>
            {sortedTimes.map((time) => (
              <div key={time} className='card relative'>
                <div className='absolute top-0 left-0 bottom-0 w-1 bg-primary-200 dark:bg-primary-900 rounded-l-lg'></div>
                <div className='pl-4'>
                  <div className='flex items-center mb-4'>
                    <Clock
                      size={18}
                      className='text-primary-600 dark:text-primary-400 mr-2'
                    />
                    <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
                      {new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </h3>
                  </div>

                  <div className='space-y-3'>
                    {groupedTasks[time].map((task) => (
                      <motion.div
                        key={task.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          task.completed
                            ? 'bg-gray-100 dark:bg-gray-800'
                            : 'bg-white dark:bg-gray-800'
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className='flex items-center'>
                          <button
                            onClick={() => toggleTaskCompletion(task.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                              task.completed
                                ? 'bg-success-500 border-success-500 text-white'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}
                          >
                            {task.completed && <CheckCircle size={14} />}
                          </button>

                          <div className='flex flex-col'>
                            <span
                              className={`font-medium ${
                                task.completed
                                  ? 'text-gray-500 line-through'
                                  : 'text-gray-800 dark:text-white'
                              }`}
                            >
                              {task.title}
                            </span>
                            <div className='flex items-center text-xs text-gray-500 mt-1'>
                              {getCategoryIcon(task.category)}
                              <span className='ml-1 capitalize'>
                                {task.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => removeRoutineTask(task.id)}
                          className='text-gray-400 hover:text-error-500 p-1'
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default RoutineGeneratorPage
